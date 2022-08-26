import * as Icons from "react-icons/fa";

import type { FC } from "react";

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
