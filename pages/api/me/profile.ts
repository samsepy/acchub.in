import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

import { AuthMiddleware } from "@/serverMiddleware/auth";

const prisma = new PrismaClient();

export default AuthMiddleware(
  async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const userId = session.user.id;
    switch (req.method) {
      case "POST": {
        type PostData = {
          displayName: string;
          screenName: string;
          bio: string;
          siteUrl: string;
        };
        const { displayName, screenName, bio, siteUrl } = req.body as PostData;
        const result = await prisma.profile.create({
          data: {
            displayName,
            screenName,
            bio,
            siteUrl,
            user: { connect: { id: userId } },
          },
        });

        return res.status(200).json(result);
      }
      case "PATCH": {
        type PatchData = {
          displayName: string;
          screenName: string;
          bio: string;
          siteUrl: string;
        };
        const { displayName, screenName, bio, siteUrl } = req.body as PatchData;
        const result = await prisma.profile.update({
          where: {
            id: session.user.profile?.id,
          },
          data: {
            displayName,
            screenName,
            bio,
            siteUrl,
          },
        });

        return res.status(200).json(result);
      }
    }
  },
);
