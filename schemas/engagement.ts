import { z } from "zod";

export const formQuestion = z.object({
    question: z.string().min(3, { message: "Question is required" }),
    questionImage: z.any(),
    selectedType: z.string(),
    optionFields: z.any(),
    isRequired: z.boolean(),
    questionId: z.string(),
})

export const formQuestionSchema = z.object({
    questions: z.array(formQuestion),
    title: z.string().min(3, { message: "Title is required" }),
    description: z.string().optional(),
    coverImage: z.any(),
    isActive:z.boolean(),
    eventAlias: z.string(),
    formAlias: z.string()
    
    
});



export const formAnswerSchema = z.object( {
    attendeeAlias: z.string(),
    eventAlias: z.string(),
    formResponseAlias: z.string(),
    formAlias: z.string(),
    questions: z.array(formQuestion),
    responses: z.array(z.object({
        type:z.string(),
        response: z.any(),
        questionId: z.string()
    }))
})