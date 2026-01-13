import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Apple, Bot, User, Scale } from 'lucide-react'; // Added Scale icon

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Workouts', icon: Dumbbell, path: '/workouts' },
    { name: 'Nutrition', icon: Apple, path: '/nutrition' },
    { name: 'Stats', icon: Scale, path: '/body-stats' }, // Added Body Stats here
    { name: 'AI Coach', icon: Bot, path: '/ai-coach' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-gray-800 px-4 py-3 md:hidden z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-colors w-full ${
                isActive ? 'text-[#D4FF33]' : 'text-gray-500'
              }`}
            >
              {/* Slightly smaller icons to fit 6 items */}
              <item.icon size={22} />
              <span className="text-[10px] font-medium whitespace-nowrap">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;