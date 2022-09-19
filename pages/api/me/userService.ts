import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";

import { AuthMiddleware } from "@/serverMiddleware/auth";

const prisma = new PrismaClient();

export default AuthMiddleware(
  async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    switch (req.method) {
      case "POST": {
        type UserService = {
          userId: string;
          serviceId: string;
          screenName: string;
        };
        type PatchData = UserService[];
        const userServices = req.body as PatchData;
        await prisma.userService.deleteMany({
          where: {
            userId: session.user.id,
          },
        });
        const result = await prisma.userService.createMany({
          data: userServices,
        });

        return res.status(200).json(result);
      }
    }
  },
);
