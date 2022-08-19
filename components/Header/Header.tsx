import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import type { FC } from "react";

export const Header: FC = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="flex items-center justify-between py-3 px-2">
        <div className="text-4xl">acchub</div>
        <div className="relative">
          <button type="button">
            <Image
              src={session.user.image ?? "https://i.imgur.com/CgUjxSp.png"}
              className="rounded-full"
              height={40}
              width={40}
              alt="user logo"
            />
          </button>
          <div
            className="absolute top-12 right-0 border rounded px-4 py-3"
            style={{ width: "200px" }}
          >
            <div className="mb-3">
              <Link href="/me/profile">
                <a>
                  <div>
                    {session.user?.profile?.displayName ?? "名前未設定"}
                  </div>
                  <div className="text-gray-500">
                    {session.user?.profile?.screenName ?? "ID未設定"}
                  </div>
                </a>
              </Link>
            </div>
            <hr className="mb-3" />
            <div className="mb-3">
              <Link href="/me/settings">
                <a>ユーザー設定</a>
              </Link>
            </div>
            <hr className="mb-3" />
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 px-2">
      <div className="text-4xl">acchub</div>
      <button onClick={() => signIn()} className="bg-black text-white p-2 rounded">Sign in</button>
    </div>
  );
};
