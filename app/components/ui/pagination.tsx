'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Pagination() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 0;
    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className='flex justify-center text-xl mt-5'>
            <Link className='pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]' href={currentPage === 0 ? {}: createPageURL(currentPage - 1)}>Prev</Link>
            <p className='ml-2 mr-2 pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]'>{currentPage}</p>
            <Link className='pl-2 pr-2 rounded-md border-2 border-[#AA9D80] bg-[#E8D8B8]' href={createPageURL(currentPage + 1)}>Next</Link>
        </div>
    );
}