'use server'
import { Prisma } from '@/prisma/generated/client';
import prisma from '@/db';
import { auth } from '@/auth';
import { number, z } from 'zod';

export type setUserNameState = {
    errors?: {
        userName?: string[];
    };
    message?: string | null;
};

const FormSchema = z.object({
    userId: z.string(),
    userName: z.string({invalid_type_error: 'Type Error'})
                .regex(/^[-_a-zA-Z0-9]+$/, {message: 'Usable characters: a-z A-Z 0-9 - _'})
                .min(4,  {message: 'Too Short. MIN: 4'})
                .max(30, {message: 'Too long. MAX: 30'}),
});
const NewPost = FormSchema;

export async function setNewUserName(prevState: setUserNameState, formData: FormData) : Promise<setUserNameState> {
    const session = await auth();

    if (session?.user == null) {
        return {
            message: 'Please sign in.',
        }
    }

    const validatedAccount = NewPost.safeParse({
        userId: session.user.id,
        userName: formData.get('userName')
    });

    if (!validatedAccount.success) {
        return {
            errors: validatedAccount.error.flatten().fieldErrors,
            message: 'Failed to update account.'
        };
    }

    const { userId, userName } = validatedAccount.data;

    try {
        const user = await prisma.user.findUnique({
            select: {
                userName: true
            },
            where: {
                id: userId
            }
        });
        if (user?.userName != null) {
            return {
                message: 'User name cannot be changed.'
            }
        }
    } catch (error) {
        return {
            message: 'Database Error: Failed to Error.'
        };       
    }
    
    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                userName: userName
            }
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if ((error.code = "P2002")) {
                return {
                    message: 'This user name is already used.'
                }
            }
        }
        return {
            message: 'Database Error: Failed to Error.'
        };
    }
    return {message: 'success'};
}
