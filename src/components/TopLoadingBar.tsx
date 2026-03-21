interface Props {
  isLoading: boolean;
}

export function TopLoadingBar({ isLoading }: Props) {
  if (!isLoading) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-0.5">
      <div className="h-full animate-pulse bg-gradient-to-r from-brand-500 via-brand-600 to-brand-500 [animation-duration:1s]">
        <div className="h-full w-1/3 animate-[slide_1.5s_ease-in-out_infinite] bg-white/30" />
      </div>
    </div>
  );
}
