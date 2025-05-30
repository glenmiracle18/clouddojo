import { PrismaClient } from "@prisma/client";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface QuestionData {
    q_number: string;
    q_text: string;
    options: { [key: string]: string }[];
    correct_answer: string;
    explanation?: string;
}

async function questionSeed() {
    try {
        const jsonPath = path.join(__dirname, '../../public/data/solutions_architect/new-sa2.json');
        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        const questionsData: QuestionData[] = JSON.parse(rawData);

        // Create quiz in db
        const quiz = await prisma.quiz.create({
            data: {
                title: "⏳ AWS SAA (C003) - 2024",
                description: "Every Solutons Architect should practice with real exam questions. This quiz is designed to simulate the AWS Solutions Architect Associate exam experience.",
                isPublic: true,
                duration: 40,
                free: true,
                thumbnail: "https://tcjrhk37ew.ufs.sh/f/CrHVRHXsIQGlgCcZiY4uAgwoybNJF21PKmaTUs5vS7fLRiIq",
                isNew: true,
            }
        });
        console.log(`Created quiz with ID: ${quiz.id}`);

        // Create a default category if needed
        let defaultCategory;
        try {
            defaultCategory = await prisma.category.findFirst({
                where: { name: "AWS Solutions Architect" }
            });
            
            if (!defaultCategory) {
                defaultCategory = await prisma.category.create({
                    data: {
                        name: "AWS Cloud Practioner",
                        description: "Questions related to AWS Associate certification"
                    }
                });
            }
        } catch (error) {
            console.warn("Could not create default category:", error);
        }

        // Process each question
        for (const question of questionsData) {
            const options = question.options.map((option) => Object.values(option)[0]);
            
            // Basic checks
            if(!question.q_text || !options.length || !question.correct_answer) {
                console.error(`Skipping question ${question.q_number} due to missing data`);
                continue;
            }
            
            if(options.length < 2) {
                console.warn(`Question ${question.q_number} has fewer than 2 options: ${options.length}`);
                continue;
            }

            // Handle multiple correct answers
            let correctAnswers = question.correct_answer.split(/,\s*/).filter(Boolean).map((answer) => answer.trim());
            
            // Validate correct answers are valid options
            const isValidAnswers = correctAnswers.every(answer => 
                ['A', 'B', 'C', 'D', 'E'].includes(answer)
            );
            
            if (!isValidAnswers) {
                console.error(`Question ${question.q_number} has invalid correct answer: ${question.correct_answer}`);
                continue;
            }

            // Determine question type
            const questionType = correctAnswers.length > 1 ? "MULTIPLE" : "SINGLE";
            if (questionType === "MULTIPLE") {
                console.log(`Question ${question.q_number} has multiple correct answers: ${question.correct_answer}`);
            }

            // Create the question
            const createdQuestion = await prisma.question.create({
                data: {
                    content: question.q_text,
                    isMultiSelect: questionType === "MULTIPLE",
                    difficultyLevel: "Medium", // Default difficulty, adjust as needed
                    explanation: question.explanation || "",
                    quizId: quiz.id,
                    categoryId: defaultCategory?.id,
                    // Create options with their correctness
                    options: {
                        create: options.map((optionText, index) => {
                            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D, E
                            return {
                                content: optionText,
                                isCorrect: correctAnswers.includes(optionLetter)
                            };
                        })
                    }
                },
                include: {
                    options: true
                }
            });
            
            console.log(`Created question ID: ${createdQuestion.id} with ${createdQuestion.options.length} options`);
        }

        const totalQuestions = await prisma.question.count({
            where: { quizId: quiz.id }
        });
        console.log(`Seeded ${totalQuestions} questions successfully`);
        
    } catch (error) {
        console.log("Error seeding questions: ", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Function call for running
questionSeed().then(() => {
    console.log("Seeding completed");
    process.exit(0);
})
.catch((error) => {
    console.log("Error seeding questions: ", error);
    process.exit(1);
});