import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Fragment
} from "react";

export const TagsButtonsSelectionGroup = ({
  data,
  setData,
}: {
  data: { name: string; selected: boolean }[];
  setData: Dispatch<SetStateAction<{ name: string; selected: boolean }[]>>;
}) => {
  const invalidIndex = 999999999999999999999999999999999999999999;
  const divRef = useRef<HTMLDivElement>();
  const [indexToShowMoreButton, setIndexToShowMoreButton] =
    useState(invalidIndex);
  useEffect(() => {
    if (divRef?.current) {
      let row = 0;
      for (let i = 0; i < divRef.current.children.length; i++) {
        const el: any = divRef.current.children[i];
        if (
          !el.previousElementSibling ||
          el.offsetLeft < el.previousElementSibling.offsetLeft
        ) {
          if (row === 2) {
            setIndexToShowMoreButton(i - 1);
            return;
          }
          row++;
        }
      }
    }
  }, [divRef]);
  return (
    <div className="flex flex-wrap items-center gap-2" ref={divRef as any}>
      {data.map((x, i) =>
        i === indexToShowMoreButton ? (
          <span
            key={i}
            onClick={() => {
              setIndexToShowMoreButton(invalidIndex);
            }}
            className="cursor-pointer rounded-2xl border px-3 py-2 text-xs text-[#006064] hover:opacity-60"
          >
            + More
          </span>
        ) : i > indexToShowMoreButton ? (
          <Fragment key={i}></Fragment>
        ) : (
          <span
            key={i}
            onClick={() => {
              x.selected = !x.selected;
              setData([...data]);
            }}
            className={
              "cursor-pointer rounded-2xl border px-3 py-2 text-xs text-[#006064] hover:opacity-60 " +
              (x.selected ? "bg-[#006064] text-white" : "")
            }
          >
            {x.name}
          </span>
        )
      )}
    </div>
  );
};
