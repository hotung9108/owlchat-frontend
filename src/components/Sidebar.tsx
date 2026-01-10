import React from 'react';

interface SidebarProps {
  items: { label: string; onClick: () => void }[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full">
      <ul className="space-y-2 p-4">
        {items.map((item, index) => (
          <li
            key={index}
            className="cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={item.onClick}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;