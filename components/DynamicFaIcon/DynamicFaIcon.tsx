import type { FC } from "react";
import * as Icons from "react-icons/fa";

export const DynamicFaIcon: FC = ({ name }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return <Icons.FaBeer />;
  }

  return <IconComponent />;
};
