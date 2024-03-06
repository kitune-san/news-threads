import { auth } from '@/auth';
import Link from 'next/link'
import { SignIn, SignOut } from '@/app/components/user-button'

const User = async () => {
  const session = await auth();
  if (!session?.user) return <SignIn />
  return (
    <>
      <p>{session.user.name} ({session.user.id})</p>
      <Link href='/post'>Post</Link>
      <SignOut />
    </>
  );
}

export default async function Header() {
  return (
    <header className='justify-center border-b '>
      <div className='flex justify-center bg-amber-800 text-white text-6xl'>
        <Link href='/'>
          <h1>Title</h1>
        </Link>
      </div>
      <div className='flex justify-between text-white bg-amber-950'>
        <User />
      </div>
    </header>
  );
}