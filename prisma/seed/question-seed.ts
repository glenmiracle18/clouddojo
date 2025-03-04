import { PrismaClient } from "@prisma/client";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const prisma  = new PrismaClient();

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
        const jsonPath = path.join(__dirname, '../../public/data/questions.json');
        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        const questionsData: QuestionData[] = JSON.parse(rawData);


        // create quiz in db
        const quiz = await prisma.quiz.create({
            data: {
                title: "AWS Solutions Architect Assosciate Practice Questios 1",
                description: "105 questions form Cohort 3",
                isPublic: true, // later correct to isPublished
                price: 0,
               
            }
        });
        console.log(`Create quiz with ID: ${quiz.id}`);

        // prepare quetions for seeding
        const questionRecords = questionsData.map((question) => {
            const options = question.options.map((option) => Object.values(option)[0]);


            // basic checks
            if(!question.q_text || !options.length || !question.correct_answer || !question.explanation) {
                console.error(`Skipping question ${question.q_number} due to missing or  incomplete data`);
                return null;
            }
            if(!options.length){
                console.warn(`Question ${question.q_number} has fewer than 4 options: ${options.length}`);
                return null;
            }

            // Handle multiple correct answers (comma-separated like "C, D" or with spaces like "C,D")
            let correctAnswers = question.correct_answer.split(/,\s*/).filter(Boolean).map((answer) => answer.trim());
            
            // Validate all correct answers are valid options
            const isValidAnswers = correctAnswers.every(answer => 
                ['A', 'B', 'C', 'D', 'E'].includes(answer)
            );
            
            if (!isValidAnswers) {
                console.error(`Question ${question.q_number} has invalid correct answer: ${question.correct_answer}`);
                return null;
            }

            const isMultiSelect = correctAnswers.length > 1;
            if (isMultiSelect) {
                console.log(`Question ${question.q_number} has multiple correct answers: ${question.correct_answer}`);
            }

            return {
                quizId: quiz.id,
                text: question.q_text,
                options: options,
                correctAnswer: correctAnswers,
                explanation: question.explanation,
                isMultiSelect: isMultiSelect,
            };
        }).filter((record) => record !== null); // remover invalid questions


        // seed data to prisma using a transaction
        await prisma.$transaction(
            questionRecords.map((record) => 
                prisma.question.create({
                    data: record!,
                })
            )
        );

        console.log(`Seeded ${questionRecords.length} questions succesfully`);
        

    } catch (error) {
        console.log("Error seeding questions: ", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// function call for running
questionSeed().then(() => {
    console.log("Seeding completed");
    process.exit(0)
})
.catch((error) => {
    console.log("Error seeding questions: ", error);
    process.exit(1);
});