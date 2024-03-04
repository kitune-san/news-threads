import Image from "next/image";
import { Suspense } from 'react';
import LatestTopics from '@/app/components/latest-topics'

export default async function Home() {
  return (
    <main>
      <div>
        <div>
          <LatestTopics />
        </div>
      </div>
    </main>
  );
}
