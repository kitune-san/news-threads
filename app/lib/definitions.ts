
export type Topic = {
    id: number;
    createdAt: Date;
    title: string;
    body: string;
    authorId: string | null;
    user: {
        userName: string | null;
    } | null;
    category: {
        name: string;
    } | null;
} | null;

export type Comment = {
    id: number;
    topicId: number | null;
    parentId: number | null;
    createdAt: Date;
    title: string;
    body: string;
    authorId: string | null;
    user: {
        userName: string | null;
    } | null;
} | null;

export type Category = {
    id: number,
    name: string;
    alias: string | null;
    description: string | null;
    image: string | null;
} | null;

export type CategoriesField = {
    id: number,
    name: string;
} | null;