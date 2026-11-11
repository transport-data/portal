interface EmbedFrameProps {
  src: string;
  title: string;
  /**
   * Whether the embed adapts to narrow screens. If not, it stays at desktop
   * size and scrolls inside this frame, so the page itself doesn't scroll sideways.
   */
  responsive?: boolean;
}

/** Embeds an external visualization. Fills its parent, which must have a height. */
export function EmbedFrame({
  src,
  title,
  responsive = false,
}: EmbedFrameProps) {
  return (
    <div className="h-full w-full overflow-auto">
      <iframe
        src={src}
        title={title}
        className="block h-full w-full border-0"
        style={
          responsive ? undefined : { minWidth: "1024px", minHeight: "768px" }
        }
        allowFullScreen
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
