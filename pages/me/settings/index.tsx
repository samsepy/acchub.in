import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

import { prisma } from "@/lib/prisma";
import * as api from "@/services";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const serviceList = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const session = await getSession({ req: context.req });
  if (!session) {
    return { props: {}, redirect: { destination: "/", permanent: false } };
  }

  return { props: { session, serviceList } };
};

const MeSettingsIndex: NextPage = ({
  serviceList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();

  if (!session) return "";

  const profile = session?.user.profile!;
  let services;
  if (session?.user.services.length) {
    services = session?.user.services.map((service, i) => ({
      id: i + 1,
      userId: session?.user.id,
      serviceId: service.serviceId,
      screenName: service.screenName,
    }));
  } else {
    services = [
      {
        id: 1,
        userId: session?.user.id,
        serviceId: "",
        screenName: "",
      },
    ];
  }
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [screenName, setScreenName] = useState(profile.screenName);
  const [bio, setBio] = useState(profile.bio);
  const [webSite, setWebSite] = useState(profile.siteUrl);
  const [userServices, setUserServices] = useState(services);
  const addUserService = () => {
    setUserServices([
      ...userServices,
      {
        id: userServices.length + 1,
        userId: session?.user.id,
        serviceId: "",
        screenName: "",
      },
    ]);
  };

  const putProfile: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await api.patchMeProfile({
      displayName,
      screenName,
      bio,
      siteUrl: webSite,
    });
    await api.patchMeUserService(
      userServices.map((userService) => ({
        userId: userService.userId,
        serviceId: userService.serviceId,
        screenName: userService.screenName,
      })),
    );
  };

  return (
    <div className="bg-gray-50 h-screen">
      <div className="container max-w-3xl pt-5">
        <h1 className="text-lg mb-2">User settings</h1>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="displayName"
            >
              Display name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="displayName"
              type="text"
              placeholder="John Smith"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="screenName"
            >
              Account ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="screenName"
              type="text"
              placeholder="john_smith"
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="bio"
            >
              bio
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="bio"
              type="text"
              placeholder="Hello, I'm John Smith."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="siteUrl"
            >
              Web site
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="siteUrl"
              type="text"
              placeholder="https://example.com"
              value={webSite}
              onChange={(e) => setWebSite(e.target.value)}
            />
          </div>
          <hr className="mb-4" />
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="siteUrl"
            >
              Social links
            </label>
            {userServices.map((userService) => {
              return (
                <div
                  className="flex flex-wrap items-center -mx-3 mb-6"
                  key={userService.id}
                >
                  <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="userServiceScreenName"
                      type="text"
                      placeholder="john_smith"
                      value={userService.screenName}
                      onChange={(e) =>
                        setUserServices(
                          userServices.map((us) =>
                            us.id === userService.id
                              ? {
                                  id: us.id,
                                  userId: session?.user.id,
                                  screenName: e.target.value,
                                  serviceId: us.serviceId,
                                }
                              : us,
                          ),
                        )
                      }
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-2 md:mb-0">
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="siteUrl"
                      value={userService.serviceId}
                      onChange={(e) =>
                        setUserServices(
                          userServices.map((us) =>
                            us.id === userService.id
                              ? {
                                  id: us.id,
                                  userId: session?.user.id,
                                  screenName: us.screenName,
                                  serviceId: e.target.value,
                                }
                              : us,
                          ),
                        )
                      }
                    >
                      <option value="">-- Not selected --</option>
                      {serviceList.map((service) => {
                        return (
                          <option value={service.id} key={service.id}>
                            {service.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="w-full md:w-1/6 px-3 mb-2 md:mb-0">
                    <IoIosAddCircleOutline
                      onClick={() => addUserService()}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={putProfile}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeSettingsIndex;
