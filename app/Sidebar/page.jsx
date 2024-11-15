'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconHome2, IconCreditCard, IconMenu2, IconX, IconCreditCardPay, IconCalendarClock, IconFiles, IconLogout } from '@tabler/icons-react';
import supabase from "../../lib/supabaseClient";
import { useRouter } from 'next/navigation';

const Sidebar = ({ onNavigate, isOpen, setIsOpen }) => {
  const [activeView, setActiveView] = useState('overview');
  const router = useRouter();

  const handleNavigation = (view) => {
    setActiveView(view);
    onNavigate(view);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); 
  };

  const links = [
    { label: 'Advance-Form', icon: <IconFiles />, view: 'AdvanceForm' },
    { label: 'Advance-Requests', icon: <IconCalendarClock />, view: 'AdvanceRequests' },
    { label: 'Payroll', icon: <IconCreditCardPay />, view: 'Payroll' },
    { label: 'Stats', icon: <IconCreditCardPay />, view: 'Stats' },

  ];

  return (
    <motion.div
      className={`h-full text-black fixed transition-all  rounded-md duration-300 ${isOpen ? 'bg-white w-64' : 'bg-black w-16'}`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-4">
        <button onClick={() => setIsOpen(!isOpen)} className="text-black">
          {isOpen ? <IconX size={24} color="black" /> : <IconMenu2 size={24} color="white" />}
        </button>
      </div>

      {/* Company Logo */}
      <div className="flex justify-center items-center p-4 border-b border-gray-300">
        <img src="/logo.png" alt="Company Logo" className="h-8 w-50" />
      </div>

      {/* User Info Section */}
      <div className="p-4 flex items-center border-b border-gray-300">
        <motion.img
          src="/user.svg"
          alt="User"
          className="rounded-full mr-3"
          animate={{ width: isOpen ? '2.5rem' : '1.5rem', height: isOpen ? '2.5rem' : '1.5rem' }}
        />
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <p className="font-semibold">John Doe</p>
              <p className="text-xs text-gray-500">john.doe@origen.com</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar Links */}
      <ul className="mt-4 space-y-2">
        {links.map((link, index) => (
          <motion.li
            key={index}
            className={`p-2 cursor-pointer text-sm flex items-center gap-2  ${
              activeView === link.view ? (isOpen ? 'bg-[#668743] text-white' : 'text-white') : (isOpen ? 'text-black' : 'text-gray-400')
            }`}
            onClick={() => handleNavigation(link.view)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className={`text-lg ${isOpen ? 'text-black' : 'text-white'}`}>
              {link.icon}
            </span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.li>
        ))}
      </ul>

      {/* Logout Button */}
      <div className="mt-auto p-4">
        <button
          onClick={handleLogout}
          className="flex items-center mt-36 gap-2 text-sm text-red-500 bg-black hover:bg-red-100 rounded-md p-2 w-full"
        >
          <IconLogout size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
