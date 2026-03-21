import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  onTrigger: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export function LoadMoreTrigger({ onTrigger, isLoading, hasMore }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onTrigger();
        }
      },
      { threshold: 0.1 }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [onTrigger, isLoading, hasMore]);

  if (!hasMore) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        You've seen all posts
      </p>
    );
  }

  return (
    <div ref={ref} className="flex justify-center py-6">
      {isLoading && (
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      )}
    </div>
  );
}
