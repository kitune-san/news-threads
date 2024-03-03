import { fetchPost, fetchComments } from "@/app/lib/post";
import CommentForm from "@/app/components/comment";
import CommentView from "@/app/components/comment-view";
import { pages } from "next/dist/build/templates/app-page";

export default async function Page({ params }: {params: { id: string} })
{
    const id = parseInt(params.id);
    const [post, comments] = await Promise.all([fetchPost(id),  fetchComments(id, 0)]);

    return (
        <div>
            <div>
                <h1>{post?.title}</h1>
            </div>
            <div>
                <p>{post?.createdAt.toDateString()}</p>
            </div>
            <div>
                <span>{post?.body}</span>
            </div>
            <div>
                <CommentForm topic_id={id} parent_id={id} />
            </div>
            <div>
                <CommentView parent_id={id} comments={comments}/>
            </div>
        </div>
    );
}