import Image from "next/image";
import type { FC } from "react";

type Props = {
  src: string;
  alt: string;
  size: number;
};

export const ProductImage: FC<Props> = ({ src, alt, size }) => (
  <Image
    src={src}
    alt={alt}
    width={size}
    height={size}
    className="object-contain"
    draggable={false}
  />
);
