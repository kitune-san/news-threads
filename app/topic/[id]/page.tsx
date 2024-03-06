import { fetchPost, fetchComments } from '@/app/lib/post';
import CommentForm from '@/app/components/comment';
import CommentView from '@/app/components/comment-view';
import { pages } from 'next/dist/build/templates/app-page';
import { TopicBox } from '@/app/components/ui/post';

export default async function Page({ params }: {params: { id: string} })
{
    const id = parseInt(params.id);
    const [post, comments] = await Promise.all([fetchPost(id), fetchComments(id, 0)])

    if (!post) return (<p>まだない</p>);

    return (
        <div>
            <TopicBox title={post.title} href={`/topic/${post.id}`} 
                sub={`by ${post.user.userName} (ID:${post.authorId}) ${post.createdAt.toDateString()}`}
                body={post.body} />
            <div>
                <CommentForm topic_id={id} parent_id={null} />
            </div>
            <div>
                <CommentView parent_id={null} comments={comments}/>
            </div>
        </div>
    );
}