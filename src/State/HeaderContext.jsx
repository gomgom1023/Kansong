import React, { createContext, useState } from "react";

// Context 생성
export const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [headerClass, setHeaderClass] = useState("");

  return (
    <HeaderContext.Provider value={{ headerClass, setHeaderClass }}>
      {children}
    </HeaderContext.Provider>
  );
};
