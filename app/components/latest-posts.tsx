import Link from 'next/link'
import { fetchLatestPosts } from "@/app/lib/post";

export default async function LatestPosts() {
    const latestPosts = await fetchLatestPosts(0);

    return (
        <div>
            {latestPosts.map((post) => {
                return (
                    <div key={post.id}>
                        <Link href={`/${post.id}`}>{post.createdAt.toDateString()}: {post.title}</Link>
                    </div>
                );
            })}
        </div>
    );
}