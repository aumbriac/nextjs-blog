import { authOptions } from "@/app/api/auth/authOptions";
import { Session } from "@/app/interfaces";
import { getServerSession } from "next-auth";

export default async function getAuthSession(): Promise<Session | null> {
  try {
    const session: Session | null = await getServerSession(authOptions);

    if (!session) {
      console.warn("No session found.");
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
}
