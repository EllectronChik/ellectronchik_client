"use client";

import Image from "next/image";
import { FC } from "react";

interface IMedia {
  mediaPath: string;
  mediaIVHex: string;
}

interface IProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  media: IMedia;
}

const LoadImage: FC<IProps> = ({ media, ...props }) => {
  const src = `${process.env.NEXT_PUBLIC_API_URL}/static/${media.mediaPath}?iv=${media.mediaIVHex}`;
  return (
    <Image
      {...props}
      loader={({ src, width }) => {
        return src + `?w=${width}`;
      }}
      src={src}
      width={350}
      height={350}
      alt="media"
      draggable={false}
      crossOrigin={`${
        process.env.NODE_ENV === "production" ? "" : "use-credentials"
      }`}
    />
  );
};

export default LoadImage;
