type SubheadingProps = {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  align?: "left" | "center" | "right" | "justify";
};

const Subheading: React.FC<SubheadingProps> = ({
  text,
  className = "",
  children,
  align = "center",
}) => {
  return (
    <p
      className={`text-xl font-normal text-gray-500 text-${align} ${className}`}
    >
      {children || text}
    </p>
  );
};

export default Subheading;
