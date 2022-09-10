import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, FormEventHandler } from "react";
import { toast } from "react-toastify";

import * as api from "@/services";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { props: {}, redirect: { destination: "/", permanent: false } };
  }

  return { props: { session } };
};

const MeSettingsIndex: NextPage = () => {
  const { data: session } = useSession();
  const [displayName, setDisplayName] = useState("");
  const [screenName, setScreenName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!session) return "";

  const postProfile: FormEventHandler<HTMLFormElement> = async (e) => {
    const errors: string[] = [];
    if (!displayName) {
      errors.push("名前を入力してください");
    } else {
      const userExists = await api.getMeUser(screenName);
      if (userExists.userExists) {
        errors.push("存在するユーザーです");
      }
    }
    if (!screenName) {
      errors.push("アカウントIDを入力してください");
    }
    if (errors.length !== 0) {
      for (let i = 0; i < errors.length; i++) {
        toast.error(errors[i]);
      }

      return;
    }
    try {
      if (isLoading) return;

      e.preventDefault();
      setIsLoading(true);
      await api.postMeProfile({
        displayName,
        screenName,
      });
      router.push("/");
      toast.success("Successed");
    } catch (error) {
      toast.error("Falled");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 h-screen">
      <div className="container max-w-3xl pt-5">
        <h1 className="text-lg mb-2">User profile</h1>
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
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={postProfile}
              disabled={isLoading}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeSettingsIndex;
