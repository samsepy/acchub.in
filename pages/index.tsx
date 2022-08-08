import { GetServerSidePropsContext } from "next";
import Image from "next/image";

import { DynamicFaIcon } from "@/components/DynamicFaIcon";
import { prisma } from "@/lib/prisma";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const users = await prisma.user.findMany({
    take: 10,
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
              icon: true,
            },
          },
        },
      },
    },
  });

  return {
    props: { users },
  };
};

const Home: NextPage = ({
  users,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      {users.map((user) => {
        return (
          <div className="p-4 mb-2 border flex" key={user.id}>
            <div className="mr-4">
              <Image
                src={user.image ?? "https://i.imgur.com/CgUjxSp.png"}
                className="rounded-full"
                height={75}
                width={75}
                alt="user logo"
              />
            </div>
            <div>
              <div>{user?.profile?.screenName}</div>
              <div className="flex">
                {user.services.map((service) => {
                  return (
                    <div className="mr-2">
                      <a
                        href={new URL(service.screenName, service.service.url)}
                      >
                        <DynamicFaIcon name={service.service.icon} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
