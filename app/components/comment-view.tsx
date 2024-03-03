import { Post } from '@prisma/client';
import CommentForm from '@/app/components/comment';

export default function CommentView({ parent_id, comments }: { parent_id: number, comments: Post[]})
{
    const child_comments = comments.filter(comment => comment.parentId === parent_id);

    if (child_comments.length === 0) return (<></>);
   
    return (
        <div className='ml-10 border-2 border-black'>
            {child_comments.map((comment) => {
                return (
                    <div key={comment.id}>
                        <div>
                            <h1>{comment?.title}</h1>
                        </div>
                        <div>
                            <p>{comment?.createdAt.toDateString()}</p>
                        </div>
                        <div>
                            <span>{comment?.body}</span>
                        </div>
                        <div  className='mb-5'>
                            {comment.topicId && 
                            <CommentForm topic_id={comment.topicId} parent_id={comment.id} />}
                        </div>
                        <div>
                            <CommentView parent_id={comment.id} comments={comments}/>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}