import { useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
}

export function ImageLightbox({ isOpen, onClose, src, alt = "Image" }: Props) {
  const [zoomed, setZoomed] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Controls */}
      <div className="absolute right-4 top-4 flex items-center gap-3 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoomed(!zoomed);
          }}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          {zoomed ? (
            <ZoomOut className="h-5 w-5" />
          ) : (
            <ZoomIn className="h-5 w-5" />
          )}
        </button>
        <button
          onClick={onClose}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Image */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => {
          e.stopPropagation();
          setZoomed(!zoomed);
        }}
        className={`max-h-[90vh] max-w-[90vw] object-contain transition-transform duration-200 cursor-zoom-in ${
          zoomed ? "scale-150 cursor-zoom-out" : ""
        }`}
      />
    </div>
  );
}
