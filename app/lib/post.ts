'use server'

import { unstable_cache, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from "@prisma/client";
import prisma from "@/db";
import { auth } from "@/auth";
import { number, z } from 'zod';
import { Topic, Comment } from '@/app/lib/definitions';

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

export type createTopicState = {
    errors?: {
        authorId?: string[];
        title?: string[];
        body?: string[];
    };
    message?: string | null;
};

export async function createTopic(prevState: createTopicState, formData: FormData) {
    const session = await auth();

    // TODO: validation
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
        await prisma.topic.create({
            data: {
                authorId: authorId,
                title: title,
                body: body
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return {
                message: 'Database Error: Failed to Error.'
            };
        }
        throw error;
    }
   
    revalidatePath('/');
    redirect('/');

    return prevState;
}

export type createCommentState = {
    errors?: {
        authorId?: string[];
        title?: string[];
        body?: string[];
    };
    message?: string | null;
    topic_id?: number | null;
    parent_id?: number | null;
}

export async function createComment(prevState: createCommentState, formData: FormData) {
    const session = await auth();

    // TODO: validation
    if (session?.user == null) {
        return {
            ...prevState,
            message: 'Please sign in.',
        }
    }

    if (prevState.topic_id == null) {
        return {
            ...prevState,
            message: 'Topic error',
        }
    }
    
    const validatedPost = NewPost.safeParse({
        authorId: session.user.id,
        title: formData.get('title'),
        body: formData.get('body')
    });

    if (!validatedPost.success) {
        return {
            ...prevState,
            errors: validatedPost.error.flatten().fieldErrors,
            message: 'Failed to comment.'
        };
    }

    const { authorId, title, body } = validatedPost.data;
 
    try {
        await prisma.comment.create({
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
            return {
                ...prevState,
                message :'Database Error: Failed to comment.'
            };
        }
        throw error;
    }

    revalidatePath(`/topic/${prevState.topic_id}`);
    //redirect(`/topic/${prevState.topic_id}`);

    return prevState;
}

async function fetchLatestTopicsNoStore(page: number) : Promise<Topic[]> {
    const perPage = 15;
    const skip = perPage * page;

    try {
        const topics = await prisma.topic.findMany({
            skip: skip,
            take: perPage,
            select : {
                id: true,
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
            orderBy: [{
                createdAt: 'desc',
            }]
        });
        return topics;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return [];
        } else {
            throw error;
        }
    }
}
export const fetchLatestTopics = unstable_cache(fetchLatestTopicsNoStore);

async function fetchPostNoStore(id: number) : Promise<Topic> {
    try {
        const topic = await prisma.topic.findFirst({
            select : {
                id: true,
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
        return topic;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return null;
        } else {
            throw error;
        }
    }
}
export const fetchPost = unstable_cache(fetchPostNoStore);

async function fetchCommentsNoStore(id: number, getNum: number | undefined) : Promise<Comment[]> {
    try {
        const comments = await prisma.comment.findMany({
            take: getNum,
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
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return [];
        } else {
            throw error;
        }
    }
}
export const fetchComments = unstable_cache(fetchCommentsNoStore);
