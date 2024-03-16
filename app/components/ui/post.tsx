import Link from 'next/link'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '@/app/components/markdown.css'

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

function Body({body}: { body: string })
{
    return (
        <ReactMarkdown className='markdown' remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    )
}

export function TopicDigestBox({ title, href, sub, body, message }: {
     title: string, href: string, sub: string, body: string, message: string})
{
    return (
        <div className='mb-1 border-2 border-[#AA9D80]'>
            <div className='px-1 py-1'>
                <PostTitle title={title} href={href} sub={sub} />
                <div className='px-2 py-2 max-h-96 overflow-hidden'>
                    <Body body={body} />
                </div>
                <div className='flex justify-center'>
                    <Link className='pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]' href={href}>{message}</Link>
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
                <div className='px-2 py-2'>
                    <Body body={body} />
                </div>
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
                <div className='px-2 py-2'>
                    <Body body={body} />
                </div>
            </div>
        </div>
    );
}
