import Link from 'next/link'
import { fetchLatestTopics } from '@/app/lib/post';
import { TopicDigestBox } from '@/app/components/ui/post';

export default async function TopicsView({page} : {page: number}) {
    const latestPosts = await fetchLatestTopics(page);

    if (!latestPosts.length) return (<div><p>もうない</p></div>);
    
    return (
        <div>
            {latestPosts.map((post) => {
                return (post &&
                    <TopicDigestBox key={`topic-${post.id}`} title={post.title} href={`/topic/${post.id}`} 
                        sub={`by ${post.user?.userName} ${new Date(post.createdAt).toString()}`}
                        body={post.body} message='Read topic and comments'/>
                );
            })}
        </div>
    );
}