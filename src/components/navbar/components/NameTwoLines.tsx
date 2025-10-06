import type { FC } from "react";

type Props = {
  text: string;
};

export const NameTwoLines: FC<Props> = ({ text }) => {
  const [line1, line2] = text.split("\n");
  return (
    <>
      <span>{line1}</span>
      {line2 && <span>{line2}</span>}
    </>
  );
};
