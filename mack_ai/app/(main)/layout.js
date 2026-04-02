import React, { Children } from "react";

const MainLayout = ({ children }) => {
  // redirect to onboarding if user is not onboarded

  return <div className="mx-auto container mt-28 mb-20">{children}</div>;
};

export default MainLayout;
