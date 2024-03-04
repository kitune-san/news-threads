'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from "@prisma/client";
import prisma from "@/db";
import { auth } from "@/auth";
import { number, z } from 'zod';
import { unstable_noStore as noStore } from 'next/cache';
import { Post, Comment } from '@/app/lib/definitions';

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
    topic_id?: number | null;
    parent_id?: number | null;
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

export async function newComment(prevState: State, formData: FormData) {
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
                topicId: prevState.topic_id,
                parentId: prevState.parent_id,
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

    revalidatePath(`/topic/${prevState.topic_id}`);
    //redirect(`/topic/${prevState.topic_id}`);

    return prevState;
}

export async function fetchLatestPosts(page: number) : Promise<Post[]> {
    noStore();
    const perPage = 10;
    const skip = perPage * page;

    const posts = await prisma.post.findMany({
        skip: skip,
        take: perPage,
        select : {
            id: true,
            topicId: true,
            parentId: true,
            createdAt: true,
            title: true,
            body: true,
            authorId: true,
            user: {
                select: {
                    userName: true
                }
            }
        },
        where: {
            topicId: null,
        },
        orderBy: [{
            createdAt: 'desc',
        }]
    });
    return posts;
}

export async function fetchPost(id: number) : Promise<Post> {
    noStore();
    const post = await prisma.post.findFirst({
        select : {
            id: true,
            topicId: true,
            parentId: true,
            createdAt: true,
            title: true,
            body: true,
            authorId: true,
            user: {
                select: {
                    userName: true
                }
            }
        },
        where: {
            id: id
        }
    })
    return post;
}

export async function fetchComments(id: number, page: number) : Promise<Comment[]> {
    noStore();
    const perPage = 50;
    const skip = perPage * page;

    const comments = await prisma.post.findMany({
        skip: skip,
        take: perPage,
        select : {
            id: true,
            topicId: true,
            parentId: true,
            createdAt: true,
            title: true,
            body: true,
            authorId: true,
            user: {
                select: {
                    userName: true
                }
            }
        },
        where: {
            topicId: id,
        }
    });
    return comments;
}
