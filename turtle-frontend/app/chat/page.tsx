"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  useEffect(() => {
    async function createProject() {
      const token = await getToken();

      try {
        const project = await axios.post(
          "https://ai-chatbot-for-nepal-constitution-production.up.railway.app/createProject",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { projectId } = project.data as { projectId: string };
        router.push(`/chat/${projectId}`);
      } catch (err) {
        console.log(err);
      }
    }

    createProject();
  }, [getToken, router]);

  return <div>creating project.....</div>;
}