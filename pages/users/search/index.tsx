import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import { DynamicFaIcon } from "@/components/DynamicFaIcon";
import { prisma } from "@/lib/prisma";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const queryKeyword = context.query.keyword;
  const users = await prisma.user.findMany({
    take: 10,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    where: {
      OR: [
        {
          profile: {
            screenName: queryKeyword,
          },
        },
        {
          profile: {
            displayName: queryKeyword,
          },
        },
        {
          profile: {
            screenName: {
              startsWith: queryKeyword,
            },
          },
        },
        {
          profile: {
            screenName: {
              endsWith: queryKeyword,
            },
          },
        },
        {
          profile: {
            displayName: {
              startsWith: queryKeyword,
            },
          },
        },
        {
          profile: {
            displayName: {
              endsWith: queryKeyword,
            },
          },
        },
      ],
    },
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
    props: {
      queryKeyword,
      users,
    },
  };
};

const UsersSearchIndex: NextPage = ({
  queryKeyword,
  users,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session?.user && !session?.user?.profile) {
    router.push({ pathname: "/me/profile" });
  }

  const [keyword, setKeyword] = useState("");

  const clickButton = () => {
    if (!keyword) {
      return;
    }

    router.push({
      pathname: "/users/search",
      query: { keyword },
    });
  };

  return (
    <div className="bg-gray-50 h-screen">
      <div className="container max-w-3xl pt-5">
        <h1 className="text-lg mb-2">
          Search: <span className="font-bold">{queryKeyword}</span>
        </h1>
        <div className="mb-10">
          {users.map((user) => {
            return (
              <div
                className="p-4 mb-2 bg-white border rounded-lg flex"
                key={user.id}
              >
                <div className="mr-4" style={{ height: "75px" }}>
                  <Image
                    src={user.image ?? "https://i.imgur.com/CgUjxSp.png"}
                    className="rounded-full"
                    height={75}
                    width={75}
                    alt="user logo"
                  />
                </div>
                <div className="flex flex-col justify-between pb-3">
                  <div>
                    <div className="leading-5">
                      {user?.profile?.displayName}
                    </div>
                    <div className="leading-5 text-gray-500">
                      @{user?.profile?.screenName}
                    </div>
                  </div>
                  <div className="flex">
                    {user.services.map((service) => {
                      return (
                        <div className="mr-2" key={service.service.name}>
                          <a
                            href={
                              new URL(service.screenName, service.service.url)
                            }
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
        <div className="flex justify-center">
          <div className="mb-3 xl:w-96">
            <form
              className="input-group relative flex items-stretch w-full mb-4"
              onSubmit={clickButton}
            >
              <input
                type="search"
                className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
                name="accountId"
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
              />
              <button
                className="btn inline-block px-6 py-2.5 bg-black text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-800 hover:shadow-lg focus:bg-gray-800  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out flex items-center"
                type="button"
                id="button-addon2"
                disabled={!keyword}
                onClick={clickButton}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="search"
                  className="w-4"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                  ></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersSearchIndex;
