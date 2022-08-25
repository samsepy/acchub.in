import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

type Handler = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => Promise<void>;

export const AuthMiddleware =
  (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (!session)
      return res.status(401).json({ message: "ログインしてください。" });
    return handler(req, res, session);
  };
