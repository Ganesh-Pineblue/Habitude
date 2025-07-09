import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

const placeholderNotifications = [
  { id: 2, message: 'Goal deadline: Submit project by tomorrow' },
  { id: 3, message: 'Achievement unlocked: 7-day streak!' },
];

const NotificationsBar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center cursor-pointer"
        aria-label="Notifications"
      >
        <span role="img" aria-label="bell" className="text-sm sm:text-base">🔔</span>
      </button>
      {open && (
        <Card className="absolute top-full right-0 mt-2 p-3 w-64 shadow-lg z-50">
          <h3 className="font-bold mb-2 text-sm">Notifications</h3>
          <ul className="text-sm">
            {placeholderNotifications.map(n => (
              <li key={n.id} className="mb-2 border-b pb-2 last:border-b-0 last:pb-0">
                {n.message}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default NotificationsBar; 