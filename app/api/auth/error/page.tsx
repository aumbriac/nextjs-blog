"use client";
import { Button } from "@/app/components/Buttons";
import redirect from "@/app/utils/redirect";
import themeColors from "@/app/utils/themeColors";

export default function AuthError() {
  return (
    <div
      className={`min-h-screen ${themeColors.bgColor} flex flex-col justify-center items-center`}
    >
      <div className="bg-white p-8 rounded-lg text-center shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
          Authentication Error
        </h1>
        <p className="text-center mb-4">
          An error occurred during authentication.
        </p>
        <Button onClick={() => redirect("/")}>Login Page</Button>
      </div>
    </div>
  );
}
