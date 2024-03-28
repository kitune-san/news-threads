import { Suspense } from 'react';
import Link from 'next/link';
import { fetchPost, fetchComments } from '@/app/lib/post';
import CommentForm from '@/app/components/topic/comment-form';
import CommentView from '@/app/components/topic/comment-view';
import { TopicBox } from '@/app/components/topic/post';
import LoadAllButton from '@/app/components/topic/load-all-button';
import { fetchCategoryIdByName } from '@/app/lib/category';
import { Topic } from '@/app/lib/definitions';

async function Comments({id, getNum} : {id: number, getNum: number | undefined}) {
    const comments = await fetchComments(id, getNum);

    return (
        <div>
            <CommentView parent_id={null} comments={comments}/>
        </div>
    );
}

export default async function Page({
    params,
    searchParams 
}: {
    params: { category: string, id: string },
    searchParams?: {
        all?: string;
    }
}) {
    const id = parseInt(params.id);
    const getNum = searchParams?.all == null ? 50 : undefined;
    const post = await fetchPost(id);

    if (!post || post.category?.name == null) return (<p>まだない</p>);
    
    return (
        <div>
            <TopicBox key={`comment-${post.id}`} title={post.title} href={`/topic/${post.id}`} 
                sub={`by ${post.user?.userName} ${new Date(post.createdAt).toString()}`}
                body={post.body} />
            <LoadAllButton />
            <div>
                <CommentForm topic_id={post.id} parent_id={null} title_value='' />
            </div>
            <Suspense fallback={<p>Loading Comments...</p>}>
                <Comments id={id} getNum={getNum} />
            </Suspense>
        </div>
    );
}