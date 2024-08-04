import { signIn } from "next-auth/react";
import { signOut } from "next-auth/react";
import { GoogleSVG, GitHubSVG } from "@/app/components/SVGs";

type SignInButtonProps = {
  providerId: string;
  providerName: string;
};

export function SignInButton({ providerId, providerName }: SignInButtonProps) {
  const providerDetails = {
    google: {
      bgClass:
        "bg-gray-900 text-white hover:bg-gray-800 border border-gray-300",
      SVGComponent: GoogleSVG,
    },
    github: {
      bgClass: "bg-gray-800 hover:bg-gray-700",
      SVGComponent: GitHubSVG,
    },
  };
  const { bgClass, SVGComponent } = providerDetails[providerId] || {};

  return (
    <button
      onClick={() => signIn(providerId, { callbackUrl: window.location.href })}
      className={`flex items-center justify-center py-4 px-5 rounded text-white w-full ${bgClass}`}
    >
      {SVGComponent && <SVGComponent className="h-5 w-5 mr-2" />}
      Sign in with {providerName}
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  );
}

export function Button({ children, onClick = undefined }: any) {
  return (
    <button
      onClick={onClick}
      type={onClick ? "button" : "submit"}
      className={`px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200 mb-6`}
    >
      {children}
    </button>
  );
}
