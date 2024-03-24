'use server'

import { unstable_cache, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@/prisma/generated/client';
import prisma from "@/db";
import { auth } from "@/auth";
import { number, z } from 'zod';
import { Topic, Comment } from '@/app/lib/definitions';
import { getIP } from '@/app/lib/ip'

const FormSchema = z.object({
    authorId: z.string(),
    title: z.string({invalid_type_error: 'Type Error'})
            .min(1, {message: 'Input title'})
            .max(255, {message: 'Too long'}),
    body: z.string({invalid_type_error: 'Type Error'})
            .min(1, {message: 'Too short'})
            .max(2048, {message: 'Too long'}),
    categoryId: z.coerce.number({invalid_type_error: 'Please select a category'})
            .gt(0, {message: 'Please select a category'}),
});
const NewPost = FormSchema;
const NewComment = FormSchema.omit({ categoryId: true });

export type createTopicState = {
    errors?: {
        authorId?: string[];
        title?: string[];
        body?: string[];
        categoryId?: string[];
    };
    message?: string | null;
};

export async function createTopic(prevState: createTopicState, formData: FormData) {
    const session = await auth();
    const ip = await getIP();

    // TODO: validation
    if (session?.user == null) {
        return {
            message: 'Please sign in.',
        }
    }
    
    const validatedPost = NewPost.safeParse({
        authorId: session.user.id,
        title: formData.get('title'),
        body: formData.get('body'),
        categoryId: formData.get('categoryId')
    });

    if (!validatedPost.success) {
        return {
            errors: validatedPost.error.flatten().fieldErrors,
            message: 'Failed to post.'
        };
    }

    const { authorId, title, body, categoryId } = validatedPost.data;
 
    try {
        await prisma.$transaction(async (tx) => {
            const topic = await tx.topic.create({
                data: {
                    authorId: authorId,
                    title: title,
                    body: body,
                    categoryId: categoryId
                }
            });
            await tx.postLog.create({
                data: {
                    topicId: topic.id,
                    authorId: authorId,
                    title: title,
                    body: body,
                    ip: ip
                }
            });
        });
    } catch (error) {
        return {
            message: 'Database Error: Failed to Error.'
        };
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

export async function createComment(prevState: createCommentState, formData: FormData) : Promise<createCommentState> {
    const session = await auth();
    const ip = await getIP();

    const commentInfo = {
        topic_id: prevState.topic_id,
        parent_id: prevState.parent_id
    }

    // TODO: validation
    if (session?.user == null) {
        return {
            ...commentInfo,
            message: 'Please sign in.',
        }
    }

    if (commentInfo.topic_id == null) {
        return {
            ...commentInfo,
            message: 'Topic error',
        }
    }
    const topic_id = commentInfo.topic_id;
    
    const validatedPost = NewComment.safeParse({
        authorId: session.user.id,
        title: formData.get('title'),
        body: formData.get('body')
    });

    if (!validatedPost.success) {
        return {
            ...commentInfo,
            errors: validatedPost.error.flatten().fieldErrors,
            message: 'Failed to comment.'
        };
    }

    const { authorId, title, body } = validatedPost.data;
 
    try {
        await prisma.$transaction(async (tx) => {
            const comment = await tx.comment.create({
                data: {
                    topicId: topic_id,
                    parentId: commentInfo.parent_id,
                    authorId: authorId,
                    title: title,
                    body: body
                }
            });
            await tx.postLog.create({
                data: {
                    topicId: commentInfo.topic_id,
                    commentId: comment.id,
                    authorId: authorId,
                    title: title,
                    body: body,
                    ip: ip
                }
            });
        });
    } catch (error) {
        return {
            ...commentInfo,
            message :'Database Error: Failed to comment.'
        };
    }

    revalidatePath(`/topic/${commentInfo.topic_id}`);

    return {
        ...commentInfo,
        message :'success'
    };
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
            where: {
                deletedAt: null
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
                id: id,
                deletedAt: null
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
                deletedAt: null
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
