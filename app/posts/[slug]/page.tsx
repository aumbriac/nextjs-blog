"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommentForm from "@/app/components/CommentForm";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Loader from "@/app/components/Loader";
import { Comment, Post } from "@/app/interfaces";
import DefaultAvatar from "@/app/components/DefaultAvatar";
import themeColors from "@/app/utils/themeColors";
import formatDate from "@/app/utils/formatDate";
import { WavyBackground } from "@/app/components/WavyBackground";

export default function PostPage({ params }) {
  const { slug } = params;
  const { data: session }: any = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [postLoading, setPostLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const response = await axios.get(`/api/posts/${slug}`);
      setPost(response.data);
    } catch (error) {
      console.error("Failed to fetch post", error);
    } finally {
      setPostLoading(false);
    }
  }, [slug]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`/api/comments/${slug}`);
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setCommentsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post, fetchComments]);

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${slug}`, {
        data: { commentId },
      });
      fetchComments();
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  if (postLoading) {
    return <Loader />;
  }

  if (!post && !postLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-900 dark:text-gray-200 p-0">
        <div
          className="flex items-center p-4 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Post Not Found!</span> Please double
            check the URL.
          </div>
        </div>
      </div>
    );
  }

  if (post) {
    return (
      <WavyBackground className="min-h-screen flex flex-col justify-start items-center text-gray-900 dark:text-gray-200 p-0">
        <div
          className={`w-full max-w-3xl bg-white ${themeColors.fgColor} shadow-md p-4 sm:p-6 lg:p-8`}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
            {post.frontmatter.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8">
            Posted {formatDate(post.frontmatter.date, true)} by{" "}
            {post.frontmatter.author}
          </p>
          <div
            className="prose prose-lg sm:prose lg:prose-lg xl:prose-xl prose-blue dark:prose-invert max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <section className="my-8 mb-16">
            <CommentForm postId={slug} onCommentAdded={fetchComments} />
            {commentsLoading ? (
              "Loading comments..."
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className={`mb-4 flex items-start bg-gray-100 ${themeColors.bgColor} p-4 shadow-sm`}
                >
                  {comment.imageUrl ? (
                    <Image
                      width={100}
                      height={100}
                      src={comment.imageUrl}
                      alt={comment.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                  ) : (
                    <DefaultAvatar name={comment.name} />
                  )}
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                        {comment.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(comment.date as unknown as string)}
                      </p>
                    </div>
                    <p className="text-gray-800 dark:text-gray-300 mt-2">
                      {comment.content}
                    </p>
                  </div>
                  {session && session.user.id === comment.userId && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 dark:text-red-400 text-sm ml-4 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  No comments yet.
                </p>
              </>
            )}
          </section>
        </div>
      </WavyBackground>
    );
  }
}
