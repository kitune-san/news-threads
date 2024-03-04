import Link from 'next/link'
import { fetchLatestPosts } from "@/app/lib/post";

export default async function LatestPosts() {
    const latestPosts = await fetchLatestPosts(0);

    return (
        <div>
            {latestPosts.map((post) => {
                return (post &&
                    <div key={post.id} className='mb-1 border-2 border-black'>
                        <div className='border-2 border-black'>
                            <Link href={`/topic/${post.id}`}>{post.title}</Link>
                        </div>
                        <p>by {post.user.userName} (ID:{post.authorId}) {post.createdAt.toDateString()}</p>
                        <div>
                            <p className='bodytext'>{post.body}</p>
                        </div>
                        <Link className='border-2 border-black' href={`/topic/${post.id}`}>Read topic and comments</Link>
                    </div>
                );
            })}
        </div>
    );
}