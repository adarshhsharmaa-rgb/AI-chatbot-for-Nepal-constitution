import axios from "axios";

export const createProject = async (
  message: string,
  setProjectId: (id: string) => void,
  getToken: () => Promise<string | null>
) => {
  try {
    const token = await getToken();

    const project = await axios.post(
      "https://ai-chatbot-for-nepal-constitution-production.up.railway.app/project",
      {
        prompt: message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { projectId } = project.data as { projectId: string };

    setProjectId(projectId);
    console.log(projectId);
  } catch {
    console.error("Failed to create project");
  }
};