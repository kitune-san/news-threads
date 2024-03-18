import Link from 'next/link';

export default function SideNav() {
    return (
        <div className='flex grow flex-row justify-between md:flex-col'>
            <Link href='/control_panel/category'>[Category]</Link>
        </div>
    );
}