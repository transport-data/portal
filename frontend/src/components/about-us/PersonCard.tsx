import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkFrontmatter from "remark-frontmatter";

export default function PersonCard({
  title,
  subtitle,
  image,
  content,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  content?: string;
}) {
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  const checkTruncate = () => {
    const contentElement = contentRef.current;
    if (contentElement) {
      setIsTruncated(contentElement.scrollHeight > contentElement.clientHeight);
    }
  };

  useEffect(() => {
    checkTruncate();
    window.addEventListener("resize", checkTruncate);
    return () => {
      window.removeEventListener("resize", checkTruncate);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {image && (
        <img
          alt=""
          src={image}
          className="h-[192px] w-full rounded-[8px] object-contain object-cover"
        />
      )}
      <div>
        <span className="block text-xl font-bold">{title}</span>
        <span className="block text-xs font-medium">{subtitle}</span>
      </div>
      <div
        ref={contentRef}
        className={`${
          !showAll && "line-clamp-5"
        } overflow-hidden text-ellipsis text-sm font-normal text-gray-500`}
      >
        <Markdown remarkPlugins={[remarkFrontmatter]}>{content}</Markdown>
      </div>
      {isTruncated && (
        <span
          className="cursor-pointer text-xs font-medium leading-none text-accent"
          role="button"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "Show More"}
        </span>
      )}
    </div>
  );
}
