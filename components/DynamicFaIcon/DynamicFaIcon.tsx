import type { FC } from "react";
import * as Icons from "react-icons/fa";

type Props = {
  name: keyof typeof Icons;
};

export const DynamicFaIcon: FC<Props> = ({ name }) => {
  // eslint-disable-next-line
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return <Icons.FaBeer />;
  }

  return <IconComponent />;
};
