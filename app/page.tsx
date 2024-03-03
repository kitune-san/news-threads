import Image from "next/image";
import { Suspense } from 'react';
import LatestPosts from '@/app/components/latest-posts'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-2xl lg:flex">
        <div>
          <LatestPosts />
        </div>
      </div>
    </main>
  );
}
