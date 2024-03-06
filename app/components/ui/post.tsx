import Link from 'next/link'

function PostTitle({ title, href, sub }: { title: string, href: string, sub: string })
{
    return (
        <div>
            <div className='text-2xl border-2 border-[#AA9D80] bg-[#E8D8B8]'>
                <h1 className='px-2'><Link href={href}>{title}</Link></h1>
            </div>
            <p className='px-2'>{sub}</p>
        </div>
    );
}

function CommentTitle({ title, sub }: { title: string, sub: string })
{
    return (
        <div>
            <div className='text-xl border-2 border-[#AA9D80] bg-[#E8D8B8]'>
                <h1 className='px-2'>{title}</h1>
            </div>
            <p className='px-2'>{sub}</p>
        </div>
    );
}

export function TopicDigestBox({ title, href, sub, body, message }: {
     title: string, href: string, sub: string, body: string, message: string})
{
    return (
        <div className='mb-1 border-2 border-[#AA9D80]'>
            <div className='px-1 py-1'>
                <PostTitle title={title} href={href} sub={sub} />
                <p className='bodytext px-2 py-2'>{body.substring(0, 255)}</p>
                <div className='flex justify-center'>
                    <Link className='pl-2 pr-2 rounded-full border-2 border-[#AA9D80] bg-[#E8D8B8]' href={href}>{message}</Link>
                </div>
            </div>
        </div>
    );    
}

export function TopicBox({ title, href, sub, body}: {
     title: string, href: string, sub: string, body: string})
{
    return (
        <div className='mb-1 border-2 border-[#AA9D80]'>
            <div className='px-1 py-1'>
                <PostTitle title={title} href={href} sub={sub} />
                <p className='bodytext px-2 py-2'>{body}</p>
            </div>
        </div>
    );   
}

export function CommentBox({ title, sub, body }: {
     title: string, sub: string, body: string})
{
    return (
        <div className='mb-1'>
            <div className='px-1 py-1'>
                <CommentTitle title={title} sub={sub} />
                <p className='bodytext px-2 py-2'>{body}</p>
            </div>
        </div>
    );
}
