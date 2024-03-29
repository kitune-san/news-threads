import { Comment } from '@/app/lib/definitions';
import CommentForm from '@/app/components/topic/comment-form';
import { CommentBox } from '@/app/components/topic/post';

export default function CommentView({ parent_id, comments }: { parent_id: number | null, comments: Comment[]})
{
    const child_comments = comments.filter(comment => comment?.parentId === parent_id);

    if (child_comments.length === 0) return (<></>);
   
    return (
        <div className='ml-10'>
            {child_comments.map((comment) => {
                return (comment &&
                    <div key={comment.id} className='mb-1 border-2 border-[#AA9D80]'>
                        <CommentBox title={comment?.title} 
                            sub={`by ${comment.user?.userName} on ${new Date(comment.createdAt).toString()} #${comment.id}`}
                            body={comment?.body}/>
                        <div  className='mb-5'>
                            {comment.topicId && 
                            <CommentForm topic_id={comment.topicId} parent_id={comment.id} title_value={comment?.title.startsWith('Re:') ? comment?.title : `Re:${comment?.title}`} />}
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