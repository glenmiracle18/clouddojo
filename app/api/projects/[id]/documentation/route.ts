import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Generate and return project documentation for the authenticated user's project progress.
 *
 * Authenticates the request, retrieves the user's project progress by route `id`, generates
 * a Markdown documentation string from that progress, persists the generated documentation,
 * and responds with the documentation plus metadata.
 *
 * @param params - Route parameters promise resolving to an object with `id` set to the project id
 * @returns A JSON HTTP response containing:
 *   - `documentation`: the generated documentation string
 *   - `generatedAt`: timestamp when documentation was generated
 *   - `projectTitle`: project title
 *   - `userName`: user's full name
 *   - `completedAt`: project completion timestamp or null
 *   - `timeSpent`: total time spent (minutes)
 *   - `achievements`: number of achievements earned
 *
 * The route returns 401 if the request is unauthorized, 404 if no progress is found for the project,
 * and 500 on unexpected failure.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await getAuth(req);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const projectId = id;

    // Get user's completed progress for this project
    const progress = await prisma.projectProgress.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        project: {
          select: {
            title: true,
            description: true,
            category: {
              select: {
                name: true
              }
            },
            keyTechnologies: true,
            estimatedTime: true,
            difficulty: true
          }
        },
        stepResponses: {
          include: {
            step: {
              select: {
                stepNumber: true,
                title: true,
                description: true,
                stepType: true
              }
            }
          },
          orderBy: {
            step: {
              stepNumber: 'asc'
            }
          }
        },
        achievements: {
          orderBy: {
            earnedAt: 'asc'
          }
        }
      }
    });

    if (!progress) {
      return NextResponse.json(
        { error: 'Progress not found for this project' },
        { status: 404 }
      );
    }

    // Generate documentation
    const documentation = generateProjectDocumentation(progress);

    // Update the progress with the generated documentation
    await prisma.projectProgress.update({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      },
      data: {
        generatedDocumentation: documentation
      }
    });

    return NextResponse.json({
      documentation: documentation,
      generatedAt: new Date(),
      projectTitle: progress.project.title,
      userName: `${progress.user.firstName} ${progress.user.lastName}`,
      completedAt: progress.completedAt,
      timeSpent: progress.timeSpent,
      achievements: progress.achievements.length
    });

  } catch (error) {
    console.error('Error generating documentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate project documentation' },
      { status: 500 }
    );
  }
}

/**
 * Produce a Markdown-formatted project documentation string derived from a user's project progress.
 *
 * Generates a human-readable documentation document that summarizes the project overview, technologies used,
 * learning reflections, implementation steps with per-step details, achievements, statistics, and contact placeholders.
 *
 * @param progress - An object representing the user's progress for a project. Expected properties:
 *   - user: { firstName: string, lastName: string, email: string }
 *   - project: { title: string, description: string, category: { name: string }, keyTechnologies: string[], difficulty: string }
 *   - stepResponses: Array of { step: { stepNumber: number, title: string, description?: string, stepType: string }, response: string, timeSpent?: number, hintsUsed?: number }
 *   - achievements: Array of { title: string, description?: string, earnedAt: string|Date }
 *   - startedAt: string|Date
 *   - completedAt?: string|Date
 *   - timeSpent: number (total minutes)
 *   - status?: string
 *   - completedSteps?: any[]
 * @returns The assembled documentation as a Markdown string suitable for display or export.
function generateProjectDocumentation(progress: any): string {
  const {
    user,
    project,
    stepResponses,
    achievements,
    startedAt,
    completedAt,
    timeSpent
  } = progress;

  const userName = `${user.firstName} ${user.lastName}`;
  const completionDate = completedAt ? format(new Date(completedAt), 'MMMM dd, yyyy') : 'In Progress';
  const startDate = format(new Date(startedAt), 'MMMM dd, yyyy');
  const hoursSpent = Math.round(timeSpent / 60 * 10) / 10; // Convert minutes to hours with 1 decimal

  // Filter responses by type for better organization
  const reflectionResponses = stepResponses.filter((r: any) => r.step.stepType === 'REFLECTION');
  const instructionResponses = stepResponses.filter((r: any) => r.step.stepType === 'INSTRUCTION');

  const documentation = `# ${project.title} - Project Documentation

**Completed by:** ${userName}  
**Project Category:** ${project.category.name}  
**Difficulty Level:** ${project.difficulty}  
**Started:** ${startDate}  
**Completed:** ${completionDate}  
**Time Invested:** ${hoursSpent} hours  

---

## Project Overview

${project.description}

### Technologies Used
${project.keyTechnologies.map((tech: string) => `- ${tech}`).join('\n')}

---

## Learning Journey

### What I Set Out to Learn

${reflectionResponses.length > 0 && reflectionResponses[0] ? reflectionResponses[0].response : 'Learning objectives documented during the project.'}

---

## Implementation Steps

${instructionResponses.map((response: any, index: number) => `
### Step ${response.step.stepNumber}: ${response.step.title}

**Objective:** ${response.step.description || 'Complete the implementation step'}

**What I Did:**
${response.response}

**Time Spent:** ${Math.round(response.timeSpent)} minutes
${response.hintsUsed > 0 ? `**Hints Used:** ${response.hintsUsed}` : ''}

---
`).join('')}

## Key Achievements

${achievements.length > 0 ? achievements.map((achievement: any) => `
🏆 **${achievement.title}**  
${achievement.description}  
*Earned on ${format(new Date(achievement.earnedAt), 'MMMM dd, yyyy')}*
`).join('\n') : 'Working towards earning achievements in this project.'}

---

## Reflection & Next Steps

### What I Learned
${reflectionResponses.length > 1 ? reflectionResponses[reflectionResponses.length - 1].response : 'This project provided hands-on experience with cloud technologies and development practices.'}

### Skills Developed
- Practical experience with ${project.keyTechnologies.slice(0, 3).join(', ')}
- Problem-solving and troubleshooting
- Technical documentation and communication
- Project planning and execution

---

## Project Statistics

- **Total Steps Completed:** ${stepResponses.length}
- **Achievements Earned:** ${achievements.length}
- **Completion Rate:** ${progress.status === 'COMPLETED' ? '100%' : `${Math.round((progress.completedSteps.length / stepResponses.length) * 100)}%`}
- **Average Time per Step:** ${stepResponses.length > 0 ? Math.round(timeSpent / stepResponses.length) : 0} minutes

---

*This documentation was automatically generated from project responses and can be used for portfolio purposes, job applications, or LinkedIn sharing.*

**Project completed through [CloudDojo](https://clouddojo.io) - Hands-On Labs Platform**

---

## Connect With Me

Feel free to connect with me to discuss this project or collaborate on similar technologies!

📧 Email: ${user.email}  
💼 LinkedIn: [Add your LinkedIn profile]  
🐙 GitHub: [Add your GitHub profile]  

---

*Generated on ${format(new Date(), 'MMMM dd, yyyy \'at\' h:mm a')}*
`;

  return documentation;
}