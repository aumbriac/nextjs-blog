import connect from "@/app/utils/connect";
import Comment from "@/app/models/Comment";
import { NextResponse } from "next/server";
import { Session } from "@/app/interfaces";
import getAuthSession from "@/app/utils/getAuthSession";

export async function POST(req, { params }) {
  const session: Session | null = await getAuthSession();

  if (!session) {
    return NextResponse.json({
      error: "You must be signed in to post a comment",
    });
  }

  await connect();

  const { slug } = params;
  const { content } = await req.json();

  if (!content) {
    return NextResponse.json({ error: "Content is required" });
  }

  try {
    const newComment = new Comment({
      slug,
      name: session.user.name,
      userId: session.user.id,
      content,
      imageUrl: session.user.image,
    });
    await newComment.save();
    return NextResponse.json(newComment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add comment" });
  }
}

export async function GET(_, { params }) {
  await connect();

  const { slug } = params;

  try {
    const comments = await Comment.find({ slug }).sort({ date: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" });
  }
}

export async function DELETE(_, { params }) {
  const session: Session | null = await getAuthSession();
  if (!session) {
    return NextResponse.json({
      error: "You must be signed in to delete a comment",
    });
  }

  await connect();

  const { slug } = params;

  try {
    const comment = await Comment.findOne({ slug });
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" });
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json({
        error: "You do not have permission to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(comment._id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete comment" });
  }
}
