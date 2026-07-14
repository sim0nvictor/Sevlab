import { FeedSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <FeedSkeleton />
    </main>
  );
}
