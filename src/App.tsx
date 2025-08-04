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

function App() {
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
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar
          userRole={mockUser.role}
          userName={mockUser.name}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <Routes>
          {/* Design System Routes */}
          <Route path="/base-theme" element={<BaseTheme2 />} />
          <Route path="/kassy" element={<KassyDesignSystem />} />
          <Route path="/millborne" element={<MillborneDesignSystem />} />
          <Route path="/kara" element={<KaraDesignSystem />} />
          <Route path="/" element={<Login />} />

          {/* Main Application Routes */}
          <Route path="/*" element={<Body />} />

          {/* Fallback route for design system */}
          {/* <Route path="/millborne" element={<MillborneDesignSystem />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
