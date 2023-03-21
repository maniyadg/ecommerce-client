import { useState, useContext, createContext } from "react";

const SearchContext = createContext();
const SearchProvider = ({ children }) => {
  const [accessToken, setaccessToken] = useState({
    keyword: "",
    results: [],
  });

  return (
    <SearchContext.Provider value={[accessToken, setaccessToken]}>
      {children}
    </SearchContext.Provider>
  );
};

// custom hook
const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };