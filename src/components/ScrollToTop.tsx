import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-4 z-30 rounded-full bg-brand-500 p-3 text-white shadow-lg transition-transform hover:bg-brand-600 active:scale-90 lg:bottom-6"
      title="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
