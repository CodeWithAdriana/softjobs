import { createContext, useState } from "react";

const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  const [developer, setDeveloper] = useState(null);

  return (
    <Context.Provider value={{ developer, setDeveloper }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
