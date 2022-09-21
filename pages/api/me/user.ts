import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

import { AuthMiddleware } from "@/serverMiddleware/auth";

const prisma = new PrismaClient();

export default AuthMiddleware(
  async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const userId = session.user.id;
    switch (req.method) {
      case "GET": {
        type GetData = {
          screenName: string;
        };
        const { screenName } = req.query as GetData;
        const profile = await prisma.profile.findFirst({
          where: {
            OR: [
              {
                screenName: screenName,
              },
            ],
            NOT: {
              userId: userId,
            },
          },
        });
        const userExists = profile ? true : false;
        return res.status(200).json(userExists);
      }
    }
  },
);
