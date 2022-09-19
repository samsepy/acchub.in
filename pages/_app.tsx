import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import { Header } from "@/components/Header";

const ProfileChecker: NextPage = ({ children }) => {
  const { data: session } = useSession();
  const user = session?.user || null;
  const router = useRouter();

  useEffect(() => {
    if (user && !user?.profile) {
      router.push({ pathname: "/me/profile" });
    }
  }, [user]);

  return <>{children}</>;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ProfileChecker>
        <Header />
        <ToastContainer />
        <Component {...pageProps} />
      </ProfileChecker>
    </SessionProvider>
  );
}

export default MyApp;
