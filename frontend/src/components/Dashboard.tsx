import { RootState } from './redux/store';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";

const Dashboard = () => {
  // Retrieve data from the Redux store
  const isAuthenticated = useSelector((state: RootState) => state.auth.loggedIn);
  const username = useSelector((state: RootState) => state.auth.username);
  const [searchUrl, setSearchUrl] = useState<string | null>(null);

  const handleSearch = (url: string) => {
    setSearchUrl(url);
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {isAuthenticated && <h2>Welcome, {username}</h2>}
      <div>
        <SearchForm onSearch={handleSearch} />
      </div>
      <div>
        {searchUrl && <SearchResults encodedQuery={searchUrl} />}
      </div>
    </div>
  );
};

export default Dashboard;
