export interface Project {
  id: string;
  description: string;
}

export interface Message {
  type: "SYSTEM" | "USER";
  content: string;
}