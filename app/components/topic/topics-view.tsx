import Link from 'next/link'
import { fetchLatestTopics } from '@/app/lib/post';
import { TopicDigestBox } from '@/app/components/topic/post';
import { fetchCategoryIdByName } from '@/app/lib/category';

export default async function TopicsView({page, category } : {page: number, category: string | undefined }) {
    const categoryId = await fetchCategoryIdByName(category);
    const latestPosts = await fetchLatestTopics(page, categoryId);

    if (!latestPosts.length) return (<div><p>もうない</p></div>);
    
    return (
        <div>
            {latestPosts.map((post) => {
                return (post &&
                    <TopicDigestBox key={`topic-${post.id}`} title={post.title} href={`/topic/${post.category?.name}/${post.id}`} 
                        sub={`by ${post.user?.userName} ${new Date(post.createdAt).toString()}`}
                        body={post.body} message='Read topic and comments'/>
                );
            })}
        </div>
    );
}