'use client';
import React, { useState } from 'react';
import Sidebar from '../Sidebar/page';
import Payroll from '../Payroll/page';
import AdvanceForm from './components/AdvanceForm';

const Dashboard = () => {
    const [activeView, setActiveView] = useState('overview');
    const [isOpen, setIsOpen] = useState(true); // Default state of sidebar

    const renderActiveView = () => {
        switch (activeView) {
            case 'AdvanceForm':
                return <AdvanceForm />;
            case 'AdvanceRequests':
            case 'AdvanceRequest':
            case 'Payroll':
            default:
                return <Payroll />;
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar 
                onNavigate={(view) => setActiveView(view)} 
                isOpen={isOpen} 
                setIsOpen={setIsOpen} 
            />
            <div className={`transition-all duration-300 flex-grow p-4 bg-white ${isOpen ? 'ml-64' : 'ml-16'}`}>
                {renderActiveView()}
            </div>
        </div>
    );
};

export default Dashboard;
