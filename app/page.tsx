import Image from "next/image";
import { Suspense } from 'react';
import TopicsView from '@/app/components/topic/topics-view'
import Pagination from "@/app/components/pagination";

export default function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page || 0);

  return (
    <main>
      <Suspense fallback={<p>Loading topics...</p>}>
        <TopicsView page={currentPage}/>
      </Suspense>
      <Pagination />
    </main>
  );
}
