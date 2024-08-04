"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { getProviders } from "next-auth/react";
import { Button, SignInButton } from "@/app/components/Buttons";
import Loader from "@/app/components/Loader";
import { Provider } from "next-auth/providers/index";
import themeColors from "@/app/utils/themeColors";

function CommentForm({ postId, onCommentAdded }) {
  const { data: session, status }: any = useSession();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      if (res) {
        setProviders(Object.values(res) as any);
      }
    };
    fetchProviders();
  }, []);

  if (status === "loading") {
    return <Loader />;
  }

  if (!session) {
    return (
      <div className={`bg-blue-50 ${themeColors.fgColor} shadow-md rounded-lg`}>
        <p className="text-gray-800 dark:text-gray-200 text-lg font-medium mb-4">
          You must be signed in to leave a comment.
        </p>
        <div className="space-y-3 mb-6">
          {providers.map((provider: Provider) => (
            <SignInButton
              key={provider.name}
              providerName={provider.name}
              providerId={provider.id}
            />
          ))}
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/comments/${postId}`, {
        name: session.user.name,
        content,
      });
      setContent("");
      onCommentAdded();
    } catch (error) {
      setError("Failed to submit comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>}
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white ${themeColors.fgColor} text-gray-900 dark:text-gray-200`}
          required
        ></textarea>
      </div>
      <Button>Submit</Button>
    </form>
  );
}

export default CommentForm;
