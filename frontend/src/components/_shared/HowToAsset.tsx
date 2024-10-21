import Video from "@components/home/heroSection/Video";

export default ({
  assetType,
  assetPath,
  heightInPx,
}: {
  assetType: string;
  assetPath: string;
  heightInPx?: string;
}) => {
  return (
    <div>
      {assetType === "mp4" && (
        <Video path={assetPath} heightInPx={heightInPx} />
      )}
      {assetType === "youtube" && (
        <iframe
          className={`h-[${heightInPx ?? "405px"}] w-full`}
          src={assetPath}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      )}
      {assetType === "image" && (
        <img
          src={assetPath}
          className={`relative flex aspect-[4/3] h-[${
            heightInPx ?? "405px"
          }] w-full`}
        />
      )}
    </div>
  );
};
