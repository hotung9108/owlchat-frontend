import React from "react";
import Sidebar from "../../../components/Sidebar";
const ChatPage = () => {
  const items = [
    { label: 'Chat 1', onClick: () => console.log('Chat 1') },
    { label: 'Chat 2', onClick: () => console.log('Chat 2') },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar items={items} />
      <div className="flex-1 bg-gray-100 p-4">
        <h1 className="text-2xl font-bold">Welcome to Chat</h1>
        {/* Nội dung chat */}
      </div>
    </div>
  );
};

export default ChatPage;