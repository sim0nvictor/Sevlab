import { Skeleton } from "@/components/ui/skeleton";

export function FeedSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-36" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-52 w-full" />
    </div>
  );
}
