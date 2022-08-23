import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return { props: {}, redirect: { destination: "/", permanent: false } };
  }

  return { props: {} };
};

const MeSettingsIndex: NextPage = () => {
  return (
    <div className="bg-gray-50 h-screen">
      <div className="container max-w-3xl pt-5">
        <h1 className="text-lg mb-2">User settings</h1>
      </div>
    </div>
  );
};

export default MeSettingsIndex;
