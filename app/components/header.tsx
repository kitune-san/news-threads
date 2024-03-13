import { auth } from '@/auth';
import Link from 'next/link'
import SignButton from '@/app/components/sign-button'
import { SessionProvider } from 'next-auth/react';

export default async function Header() {
  const session = await auth();
  
  if (session?.user) {
    session.user = {
      userName: session.user.userName,
    }
  }
  
  return (
    <header className='justify-center border-b '>
      <div className='flex justify-center bg-amber-800 text-white text-6xl'>
        <Link href='/'>
          <h1>Title</h1>
        </Link>
      </div>
      
      <div className='flex justify-between text-white bg-amber-950'>
        <Link href='/post'>Post</Link>
        <SessionProvider session={session}>
          <SignButton />
        </SessionProvider>
      </div>
    </header>
  );
}