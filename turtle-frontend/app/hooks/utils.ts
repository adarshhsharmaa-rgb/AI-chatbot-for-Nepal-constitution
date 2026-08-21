"use client";
import { useAuth } from "@clerk/nextjs";

const { getToken } = useAuth()

export const fetchProjects = async () => {
  const token = await getToken();
  const response = await axios.get("https://ai-chatbot-for-nepal-constitution-production.up.railway.app/projects", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return response.data;
}

