'use server'
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@/prisma/generated/client';
import prisma from "@/db";
import { auth } from "@/auth";
import { number, z } from 'zod';
import { Category } from '@/app/lib/definitions';

const FormSchema = z.object({
    name: z.string({invalid_type_error: 'Name: Type Error'}).min(1, {message: 'Input name'}),
    description: z.string({invalid_type_error: 'Description: Type Error'}),
    image: z.string({invalid_type_error: 'Image: Type Error'})
});
const NewCategory = FormSchema;

export type createCategoryState = {
    errors?: {
        name?: string[];
        description?: string[];
        image?: string[];
    };
    message?: string | null;
};

export async function createCategory(prevState: createCategoryState, formData: FormData) {
    noStore();
    const session = await auth();

    // role check
    if ((session?.user?.userName == null)) {
        return {
            message: 'Please sign in.',
        }
    }
    try {
        const user = await prisma.user.findUnique({
            select: {
                role: true
            },
            where: {
                id: session.user.id,
                userName: session.user.userName
            }
        });
        if (user?.role != 'ADMIN') {
            return {
                message: 'Not authorized.',
            }
        }
    } catch (error) {
        return {
            message: 'Database error.',
        }
    }

    // validate
    const validatedCategory = NewCategory.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        image: formData.get('image')
    });

    if (!validatedCategory.success) {
        return {
            errors: validatedCategory.error.flatten().fieldErrors,
            message: 'Failed to create category.'
        };
    }
    const { name, description, image } = validatedCategory.data;

    // Add category
    try {
        await prisma.category.create({
            data: {
                name: name,
                description: description,
                image: image
            }
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if ((error.code = "P2002")) {
                return {
                    message: 'This category name is already used.'
                }
            }
        }
        return {
            message: 'Database Error: Failed to Error.'
        };
    }

    revalidatePath('/control_panel/category');
    redirect('/control_panel/category');

    return prevState
}

export async function fetchCategories() : Promise<Category[]> {
    try {
        const categories = await prisma.category.findMany({
            select : {
                id: true,
                name: true,
                description: true,
                image: true
            }
        });
        return categories;
    } catch (error) {
        return [];
    }
}