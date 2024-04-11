import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ open: false, message: "" });

  const triggerNotification = (message) => {
    setNotification({ open: true, message });
  };

  return (
    <NotificationContext.Provider value={{ notification, triggerNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
