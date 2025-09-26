import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

// components
import Sidebar from "./global-components/Sidebar";
import Body from "./components/Body";
import PageNotFound from "./components/PageNotFound";

// pages
import BaseTheme2 from "./design-system/BaseTheme2";
import KaraDesignSystem from "./design-system/KaraDesignSystem";
import KassyDesignSystem from "./design-system/KassyDesignSystem";
import MillborneDesignSystem from "./design-system/MillborneDesignSystem";
import Login from "./features/auth/pages/Login";

// Main app layout component with sidebar
const AppLayout = () => {
  const [userRole, setUserRole] = useState<"admin" | "doctor">("doctor");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Get user role from sessionStorage
    const storedRole = sessionStorage.getItem("userRole") as
      | "admin"
      | "doctor"
      | null;
    const storedEmail = sessionStorage.getItem("userEmail");

    if (storedRole) {
      setUserRole(storedRole);
    }

    if (storedEmail) {
      setUserName(storedEmail.split("@")[0]); // Use email prefix as username
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar userRole={userRole} userName={userName} />

      {/* Main Content Area */}
      <Body userRole={userRole} />
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
        {/* <Route path="/base-theme" element={<BaseTheme2 />} />
        <Route path="/kassy" element={<KassyDesignSystem />} />
        <Route path="/millborne" element={<MillborneDesignSystem />} />
        <Route path="/kara" element={<KaraDesignSystem />} /> */}

        {/* 404 Page - Standalone route for direct access */}
        <Route path="/404" element={<PageNotFound />} />

        {/* Main Application Routes - with sidebar layout */}
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
