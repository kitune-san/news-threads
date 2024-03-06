import Link from 'next/link'
import { fetchLatestTopics } from '@/app/lib/post';
import { TopicDigestBox } from '@/app/components/ui/post';

export default async function LatestTopics() {
    const latestPosts = await fetchLatestTopics(0);

    if (!latestPosts.length) return (<div><p>もうない</p></div>);

    return (
        <div>
            {latestPosts.map((post) => {
                return (post &&
                    <TopicDigestBox title={post.title} href={`/topic/${post.id}`} 
                        sub={`by ${post.user.userName} (ID:${post.authorId}) ${post.createdAt.toDateString()}`}
                        body={post.body} message='Read topic and comments'/>
                );
            })}
        </div>
    );
}