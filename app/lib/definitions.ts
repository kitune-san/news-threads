
export type Topic = {
    id: number;
    createdAt: Date;
    title: string;
    body: string;
    authorId: string;
    user: {
        userName: string | null;
    };
} | null;

export type Comment = {
    id: number;
    topicId: number | null;
    parentId: number | null;
    createdAt: Date;
    title: string;
    body: string;
    authorId: string;
    user: {
        userName: string | null;
    };
} | null;
