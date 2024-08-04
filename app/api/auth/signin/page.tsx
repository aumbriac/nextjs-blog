"use client";
import { getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import { SignInButton } from "@/app/components/Buttons";
import Loader from "@/app/components/Loader";
import themeColors from "@/app/utils/themeColors";

type Provider = {
  id: string;
  name: string;
};

type SignInProps = {
  providers: Record<string, Provider>;
};

const SignUp = () => {
  const [providers, setProviders] = useState<SignInProps["providers"] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        const res = await getProviders();
        if (!res) {
          throw new Error("No providers returned");
        }
        setProviders(res);
      } catch (_) {
        setError(
          "Please define the required environment variables inside .env.local"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center bg-gray-100 ${themeColors.bgColor} text-red-500 dark:text-red-400`}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-100 ${themeColors.bgColor}`}
    >
      <div className="p-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Anthony Umbriac&lsquo;s Blog
        </h3>
        {providers && Object.values(providers).length > 0 ? (
          Object.values(providers).map((provider) => (
            <div key={provider.name} className="mb-4">
              <SignInButton
                providerId={provider.id}
                providerName={provider.name}
              />
            </div>
          ))
        ) : (
          <div className="text-gray-900 dark:text-gray-100">
            No sign-in providers available.
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
