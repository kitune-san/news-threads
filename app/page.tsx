import Image from "next/image";
import { Suspense } from 'react';
import TopicsView from '@/app/components/topics-view'
import Pagination from "@/app/components/ui/pagination";

export default async function Home({
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
      <TopicsView page={currentPage}/>
      <Pagination />
    </main>
  );
}
