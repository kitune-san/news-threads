'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoadAllButton() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    params.set('all', '');
    const loadAllURL= `${pathname}?${params.toString()}`;

    return (
        <div className='flex mt-1 ml-1'>
            <Link className='pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]' href={loadAllURL}>Load All Comments</Link>
        </div>
    );
}