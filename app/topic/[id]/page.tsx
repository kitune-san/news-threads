import Link from 'next/link';
import { fetchPost, fetchComments } from '@/app/lib/post';
import CommentForm from '@/app/components/comment-form';
import CommentView from '@/app/components/comment-view';
import { TopicBox } from '@/app/components/ui/post';
import LoadAllButton from '@/app/components/ui/load-all-button';

export default async function Page({
    params,
    searchParams 
}: {
    params: { id: string},
    searchParams?: {
        all?: string;
    }
}) {
    const id = parseInt(params.id);
    const getNum = searchParams?.all == null ? 50 : undefined;
    
    const [post, comments] = await Promise.all([fetchPost(id), fetchComments(id, getNum)]);

    if (!post) return (<p>まだない</p>);

    return (
        <div>
            <TopicBox key={`comment-${post.id}`} title={post.title} href={`/topic/${post.id}`} 
                sub={`by ${post.user.userName} (ID:${post.authorId}) ${post.createdAt.toDateString()}`}
                body={post.body} />
            <LoadAllButton />
            <div>
                <CommentForm topic_id={id} parent_id={null} />
            </div>
            <div>
                <CommentView parent_id={null} comments={comments}/>
            </div>
        </div>
    );
}