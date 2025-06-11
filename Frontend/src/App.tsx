import { Outlet, useLocation } from 'react-router-dom';
import TopNavbar from './components/TopNavbar';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatButton from './components/ChatButton';

export default function App() {
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
    const location = useLocation();

    const toggleSidebar = (): void => {
        /**
         * TODO: Complete method to allow sidebar visibility state to be toggled
         */
        setSidebarVisible(!sidebarVisible);
        
    };

    // Don't show chat button on the chat page itself
    const showChatButton = location.pathname !== '/chat';

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden">
            {/** 
             * TODO: Fix this navbar by adding the appropriate props
             */}
            <TopNavbar toggleSidebar={toggleSidebar} />

            <div className="flex flex-1 overflow-hidden">
                <div className={`transition-all duration-300 ${sidebarVisible ? 'w-64' : 'w-0'} flex-shrink-0 overflow-hidden`}>
                    <Sidebar visible={sidebarVisible} />
                </div>
                <Outlet />
            </div>
            
            {/* Floating Chat Button - Only show when not on chat page */}
            {showChatButton && <ChatButton />}
        </div>
    );
}