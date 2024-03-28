import { auth } from '@/auth';
import Link from 'next/link'
import { SignIn, SignOut } from '@/app/components/sign-button'
import { Advertise } from './advertise';

export default async function Header() {
  const session = await auth();
  
  return (
    <header className='justify-center border-b'>
      <div className='flex'>
        <Advertise />
      </div>
      <div className='flex justify-center bg-amber-800 text-white text-6xl'>
        <Link href='/'>
          <h1>{process.env.APP_NAME}</h1>
        </Link>
      </div>

      <div className='text-white bg-amber-950 px-2'>      
      { session?.user ?
        <div className='flex justify-between'>
          <p>{session.user.userName}</p>
          <Link href='/post'>Post</Link>
          <Link href='/settings'>Settings</Link>
          <SignOut />
        </div>
        :
        <div className='text-right'>
          <SignIn />
        </div>
      }
      </div>
    </header>
  );
}