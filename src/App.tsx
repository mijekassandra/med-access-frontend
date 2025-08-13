import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useState } from "react";

// components
import Sidebar from "./global-components/Sidebar";
import Body from "./components/Body";

// pages
import BaseTheme2 from "./design-system/BaseTheme2";
import KaraDesignSystem from "./design-system/KaraDesignSystem";
import KassyDesignSystem from "./design-system/KassyDesignSystem";
import MillborneDesignSystem from "./design-system/MillborneDesignSystem";
import Login from "./features/auth/pages/Login";

// Main app layout component with sidebar
const AppLayout = () => {
  // Mock user data - in real app this would come from auth context
  const mockUser = {
    role: "doctor" as const,
    name: "John Smith",
    avatar: undefined,
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logout clicked");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        userRole={mockUser.role}
        userName={mockUser.name}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <Body />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page - standalone without sidebar */}
        <Route path="/" element={<Login />} />

        {/* Design System Routes - standalone */}
        <Route path="/base-theme" element={<BaseTheme2 />} />
        <Route path="/kassy" element={<KassyDesignSystem />} />
        <Route path="/millborne" element={<MillborneDesignSystem />} />
        <Route path="/kara" element={<KaraDesignSystem />} />

        {/* Main Application Routes - with sidebar layout */}
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
