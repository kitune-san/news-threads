import Link from 'next/link';

export default function SideNav() {
    return (
        <div className='flex grow flex-row justify-between md:flex-col'>
            <Link href='/settings/account'>[Account]</Link>
            <Link href='/settings/profile'>[Profile]</Link>
        </div>
    );
}