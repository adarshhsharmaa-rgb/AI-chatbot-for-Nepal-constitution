"use client";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function() {
  const router = useRouter();
  const { getToken } = useAuth();
  useEffect(() => {
    async function createProject() {
      const token = await getToken();
      console.log(token);
      try {
        const project = await axios.post("https://ai-chatbot-for-nepal-constitution-production.up.railway.app/createProject",
          {},
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );
        const { projectId } = project.data as any
        router.push(`/chat/${projectId}`)
      } catch (err) {
        console.log(err)
      }
    }
    createProject();
  }, [])

  return <div>
    creating project.....
  </div>
}
