"use client";

import axios from "axios";

export const fetchProjects = async (getToken: () => Promise<string | null>) => {
  const token = await getToken();

  const response = await axios.get(
    "https://ai-chatbot-for-nepal-constitution-production.up.railway.app/projects",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};