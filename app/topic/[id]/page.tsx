import { fetchPost, fetchComments } from "@/app/lib/post";
import CommentForm from "@/app/components/comment";
import CommentView from "@/app/components/comment-view";
import { pages } from "next/dist/build/templates/app-page";

export default async function Page({ params }: {params: { id: string} })
{
    const id = parseInt(params.id);
    const [post, comments] = await Promise.all([fetchPost(id), fetchComments(id, 0)])

    if (!post) return (<p>まだない</p>);

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
                <CommentForm topic_id={id} parent_id={null} />
            </div>
            <div>
                <CommentView parent_id={null} comments={comments}/>
            </div>
        </div>
    );
}