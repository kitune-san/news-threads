'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PrismaClient, Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { z } from 'zod';

const prisma = new PrismaClient();

const FormSchema = z.object({
    authorId: z.string(),
    title: z.string({invalid_type_error: 'Type Error'})
            .min(1, {message: 'Input title'})
            .max(255, {message: 'Too long'}),
    body: z.string({invalid_type_error: 'Type Error'})
            .min(1, {message: 'Too short'})
            .max(2048, {message: 'Too long'}),
});
const NewPost = FormSchema;

export type State = {
    errors?: {
        authorId?: string[];
        title?: string[];
        body?: string[];
    };
    message?: string | null;
};

export async function newPost(prevState: State, formData: FormData) {
    const session = await auth();

    if (session?.user == null) {
        return {
            message: 'Please sign in.',
        }
    }
    
    const validatedPost = NewPost.safeParse({
        authorId: session.user.id,
        title: formData.get('title'),
        body: formData.get('body')
    });

    if (!validatedPost.success) {
        return {
            errors: validatedPost.error.flatten().fieldErrors,
            message: 'Failed to post.'
        };
    }

    const { authorId, title, body } = validatedPost.data;
 
    try {
        await prisma.post.create({
            data: {
                authorId: authorId,
                title: title,
                body: body
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return 'Something went wrong.';
        }
        throw error;
    }

    revalidatePath('/');
    redirect('/');
}