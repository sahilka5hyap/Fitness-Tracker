import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Apple, Bot, User, Scale } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Workouts', icon: Dumbbell, path: '/workouts' },
    { name: 'Nutrition', icon: Apple, path: '/nutrition' },
    { name: 'Stats', icon: Scale, path: '/body-stats' },
    { name: 'AI Coach', icon: Bot, path: '/ai-coach' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-gray-800 z-50 pb-safe">
      {/* Container to center items on desktop */}
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center md:justify-center md:gap-12">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 group ${
                isActive ? 'text-[#D4FF33]' : 'text-gray-500 hover:text-white'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#D4FF33]/10' : 'bg-transparent'}`}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;