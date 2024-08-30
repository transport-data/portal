export default function Section({
  className,
  style,
  children,
}: {
  className?: string;
  style?: any;
  children: React.ReactNode;
}) {
  return (
    <div className={`py-[96px] ${className}`} style={style}>
      {children}
    </div>
  );
}
