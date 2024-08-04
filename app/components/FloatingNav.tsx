"use client";
import Image from "next/image";
import Link from "next/link";
import DefaultAvatar from "@/app/components/DefaultAvatar";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/app/components/Buttons";
import themeColors from "@/app/utils/themeColors";

const FloatingNav = ({ session }) => {
  const pathname = usePathname();
  const isPostPage = pathname.startsWith("/posts/");

  if (pathname.includes("/api/auth/")) {
    return null;
  }

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-white ${
        themeColors.bgColor
      } shadow-lg p-4 flex items-center ${
        isPostPage ? "justify-between" : "justify-center"
      } z-50 text-gray-900 dark:text-gray-200`}
    >
      {isPostPage && (
        <Link
          className="text-white bg-black bg-opacity-50 hover:bg-opacity-75 dark:text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
          href="/"
        >
          &larr; Back
        </Link>
      )}
      <div
        className={`flex items-center space-x-4 ${isPostPage ? "ml-auto" : ""}`}
      >
        {session ? (
          <>
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={40}
                height={40}
                className="rounded-full w-10 h-10"
              />
            ) : (
              <DefaultAvatar name={session.user.name} />
            )}
            <SignOutButton />
          </>
        ) : (
          <Link
            className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            href="/api/auth/signin"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default FloatingNav;
