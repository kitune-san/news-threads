import Image from "next/image";
import { Suspense } from 'react';
import LatestPosts from '@/app/components/latest-posts'

export default async function Home() {
  return (
    <main>
      <div>
        <div>
          <LatestPosts />
        </div>
      </div>
    </main>
  );
}
