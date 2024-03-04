import Link from 'next/link'
import { fetchLatestPosts } from "@/app/lib/post";

export default async function LatestPosts() {
    const latestPosts = await fetchLatestPosts(0);

    return (
        <div>
            {latestPosts.map((post) => {
                return (post &&
                    <div key={post.id}>
                        <Link href={`/topic/${post.id}`}>{post.title}</Link>
                        <p>by {post.user.userName} ({post.authorId}) {post.createdAt.toDateString()}</p>
                    </div>
                );
            })}
        </div>
    );
}