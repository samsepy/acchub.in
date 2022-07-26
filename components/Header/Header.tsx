import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import type { FC } from "react";
import { useEffect,useRef, useState } from "react";

export const Header: FC = () => {
  const { data: session } = useSession();
  const [dropDownToggle, setDropDownToggle] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null!);

  const handleClick = (e: any) => {
    if (popupRef.current?.contains(e.target)) {
      return;
    }
    setDropDownToggle(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  if (session) {
    return (
      <header className="flex items-center justify-between py-3 px-2 border-b">
        <Link href="/">
          <a style={{ height: "45px" }}>
            <Image
              src="/images/logo.png"
              height={45}
              width={125}
              alt="logo"
              className="rounded-lg"
            />
          </a>
        </Link>
        <div className="relative" style={{ height: "40px" }} ref={popupRef}>
          <button type="button" style={{ height: "40px" }}>
            <Image
              src={session.user.image ?? "https://i.imgur.com/CgUjxSp.png"}
              className="rounded-full"
              height={40}
              width={40}
              alt="user logo"
              onClick={() => setDropDownToggle(!dropDownToggle)}
            />
          </button>
          {dropDownToggle && (
            <div
              className="absolute top-12 right-0 border rounded px-4 py-3 z-50 bg-white"
              style={{ width: "200px" }}
            >
              <div className="mb-3">
                <Link
                  href={!session.user.profile ? "/me/profile" : "/me/settings"}
                >
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
                <Link
                  href={!session.user.profile ? "/me/profile" : "/me/settings"}
                >
                  <a>User settings</a>
                </Link>
              </div>
              <hr className="mb-3" />
              <button onClick={() => signOut()}>Sign out</button>
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between py-3 px-2 border-b">
      <Link href="/">
        <a style={{ height: "45px" }}>
          <Image
            src="/images/logo.png"
            height={45}
            width={125}
            alt="logo"
            className="rounded-lg"
          />
        </a>
      </Link>
      <button
        onClick={() => signIn()}
        className="bg-black text-white p-2 rounded"
      >
        Sign in
      </button>
    </header>
  );
};
