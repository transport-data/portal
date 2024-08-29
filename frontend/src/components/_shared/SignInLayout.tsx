import { ReactNode } from "react";

export const SingInLayout = ({
  children,
  subtitleText,
  paragraphText,
}: {
  children: any;
  subtitleText: string;
  paragraphText: string | ReactNode;
}) => {
  return (
    <div className="grid grid-cols-12 items-center justify-center bg-[#DFF64D] text-primary">
      <div className="col-span-12 md:col-span-6">{children}</div>
      <div className="col-span-12 md:col-span-6 flex py-14 md:py-0 flex-col justify-center bg-[#DFF64D] px-20">
        <h2 className="pb-7 text-2xl font-semibold text-[#006064]">
          Transport Data Commons
        </h2>
        <h1 className="inline-size-80 pb-3 text-4xl font-extrabold text-[#006064]">
          {subtitleText}
        </h1>
        <p className="text-[#006064]">{paragraphText}</p>
      </div>
    </div>
  );
};
