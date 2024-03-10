import { Suspense } from 'react';
import Link from 'next/link';
import { fetchPost, fetchComments } from '@/app/lib/post';
import CommentForm from '@/app/components/comment-form';
import CommentView from '@/app/components/comment-view';
import { TopicBox } from '@/app/components/ui/post';
import LoadAllButton from '@/app/components/ui/load-all-button';

export async function Topic({id, getNum} : {id: number, getNum: number | undefined}) {
    const post = await fetchPost(id);

    if (!post) return (<p>まだない</p>);

    return (
        <div>
            <TopicBox key={`comment-${post.id}`} title={post.title} href={`/topic/${post.id}`} 
                sub={`by ${post.user.userName} (ID:${post.authorId}) ${new Date(post.createdAt).toString()}`}
                body={post.body} />
            <LoadAllButton />
            <div>
                <CommentForm topic_id={id} parent_id={null} />
            </div>
        </div>
    );
}

export async function Comments({id, getNum} : {id: number, getNum: number | undefined}) {
    const comments = await fetchComments(id, getNum);

    return (
        <div>
            <CommentView parent_id={null} comments={comments}/>
        </div>
    );
}

export default function Page({
    params,
    searchParams 
}: {
    params: { id: string },
    searchParams?: {
        all?: string;
    }
}) {
    const id = parseInt(params.id);
    const getNum = searchParams?.all == null ? 50 : undefined;
    
    return (
        <div>
            <Suspense fallback={<p>Loading Topic...</p>}>
                <Topic id={id} getNum={getNum} />
            </Suspense>
            <Suspense fallback={<p>Loading Comments...</p>}>
                <Comments id={id} getNum={getNum} />
            </Suspense>
        </div>
    );
}