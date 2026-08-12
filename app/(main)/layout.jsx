import React from "react";

const MainLayout = async ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 navbar-clearance mb-20">
      {children}
    </div>
  );
};

export default MainLayout;

