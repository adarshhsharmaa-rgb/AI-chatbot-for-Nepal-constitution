import ChatClient from "./ChatClient";

export default async function Page({
  params,
}: {
  params: Promise<{
    chatId: string;
  }>;
}) {
  const { chatId } = await params;

  return (
    <div>
      <ChatClient params={{ chatId }} />
    </div>
  );
}