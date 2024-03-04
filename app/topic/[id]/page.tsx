import { fetchPost, fetchComments } from "@/app/lib/post";
import CommentForm from "@/app/components/comment";
import CommentView from "@/app/components/comment-view";
import { pages } from "next/dist/build/templates/app-page";

export default async function Page({ params }: {params: { id: string} })
{
    const id = parseInt(params.id);
    const post = await fetchPost(id);

    if (!post) return (<p>まだない</p>);

    const topic_id = (post.topicId == null) ? id : post.topicId;
    const comments = await fetchComments(topic_id, 0);

    return (
        <div>
            <div className='mb-1 border-2 border-black'>
                <div className='mb-1 border-2 border-black'>
                    <h1>{post?.title}</h1>
                </div>
                <div>
                <p>by {post.user.userName} (ID:{post.authorId}) {post.createdAt.toDateString()}</p>
                </div>
                <div>
                    <p className='bodytext'>{post?.body}</p>
                </div>
            </div>
            <div>
                <CommentForm topic_id={topic_id} parent_id={id} />
            </div>
            <div>
                <CommentView parent_id={id} comments={comments}/>
            </div>
        </div>
    );
}