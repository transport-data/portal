export default ({ text }: { text: string }) => {
  return (
    <div>
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-start">
          <span className="bg-white pr-6 text-sm font-semibold text-[#111928]">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
};
