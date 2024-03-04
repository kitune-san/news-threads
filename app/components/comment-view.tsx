import CommentForm from '@/app/components/comment';
import { Comment } from '@/app/lib/definitions';

export default function CommentView({ parent_id, comments }: { parent_id: number, comments: Comment[]})
{
    const child_comments = comments.filter(comment => comment?.parentId === parent_id);

    if (child_comments.length === 0) return (<></>);
   
    return (
        <div className='ml-10 border-2 border-black'>
            {child_comments.map((comment) => {
                return (comment &&
                    <div key={comment.id} className='mb-1 border-2 border-black'>
                        <div className='mb-1 border-2 border-black'>
                            <h1>{comment?.title}</h1>
                        </div>
                        <div>
                        <p>by {comment.user.userName} (ID:{comment.authorId}) {comment.createdAt.toDateString()} #{comment.id}</p>
                        </div>
                        <div>
                            <p className='bodytext'>{comment?.body}</p>
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