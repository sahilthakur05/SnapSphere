import { Link } from "react-router-dom";

export function parseText(text: string) {
  const parts = text.split(/(#\w+|@\w+)/g);

  return parts.map((part, i) => {
    if (part.startsWith("#")) {
      return (
        <Link
          key={i}
          to={`/explore?q=${encodeURIComponent(part)}`}
          className="font-medium text-brand-500 hover:text-brand-600 hover:underline"
        >
          {part}
        </Link>
      );
    }
    if (part.startsWith("@")) {
      const username = part.slice(1);
      return (
        <Link
          key={i}
          to={`/profile/${username}`}
          className="font-medium text-brand-500 hover:text-brand-600 hover:underline"
        >
          {part}
        </Link>
      );
    }
    return part;
  });
}
