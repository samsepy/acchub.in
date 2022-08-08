import * as Icons from "react-icons/fa";

import type { FC } from "react";

export const DynamicFaIcon: FC = ({ name }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return <Icons.FaBeer />;
  }

  return <IconComponent />;
};
