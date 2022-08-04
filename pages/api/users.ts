import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/prisma";

export default async function usersIndex(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET": {
      const users = await prisma.user.findMany({
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        select: {
          id: true,
          image: true,
          profile: true,
          services: {
            select: {
              screenName: true,
              service: {
                select: {
                  name: true,
                  url: true,
                },
              },
            },
          },
        },
      });

      return res.status(200).json(users);
    }
  }
}
