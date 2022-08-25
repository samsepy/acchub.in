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
          iconUrl: string;
        };
        const { displayName = "no name", iconUrl } = req.body as PostData;
        if (!iconUrl) {
          return res.status(400).json({ message: "アイコンは必須です。" });
        }
        if (displayName.length > 20) {
          return res.status(400).json({ message: "表示名が長すぎます。" });
        }
        const result = await prisma.profile.create({
          data: {
            bio: "",
            displayName,
            iconUrl,
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
        // if (!iconUrl) {
        //   return res.status(400).json({ message: "アイコンは必須です。" });
        // }
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
