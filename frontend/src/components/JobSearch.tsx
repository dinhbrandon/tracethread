import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
import { resetJobAdditionStatus } from '../redux/jobSlice';

const JobSearch = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.auth.loggedIn);
  const username = useSelector((state: RootState) => state.auth.username);
  const jobAdditionStatus = useSelector((state: RootState) => state.job.jobAdditionStatus);

  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalColor, setModalColor] = useState('green');
  const [refreshKey, setRefreshKey] = useState(false);

  const refreshSavedParameters = () => {
    setRefreshKey(!refreshKey);
  }


  const handleSearch = (url: string) => {
    setSearchUrl(url);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(resetJobAdditionStatus());
  };

  useEffect(() => {
    if (jobAdditionStatus === 'added') {
      setShowModal(true);
      setModalMessage('Job was added successfully!');
      setModalColor('green');
    } else if (jobAdditionStatus === 'duplicate') {
      setShowModal(true);
      setModalMessage('Job already exists in the notebook!');
      setModalColor('red');
    }
  }, [jobAdditionStatus]);

  return (
    <div className="flex h-screen">
      <div className="w-2/5 border-r p-4">
        <h1>Search Tool</h1>
        <SearchForm onSearch={handleSearch} onRefresh={refreshSavedParameters} refreshKey={refreshKey} />
      </div>
      <div className="w-3/5 p-4 overflow-y-auto">
        {searchUrl && <SearchResults encodedQuery={searchUrl} />}
      </div>

      {showModal && 
        <div className="bg-green-500 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 rounded-lg z-10">
            {modalMessage}
            <button onClick={handleCloseModal} className="mt-2 px-4 py-2 bg-white rounded">Close</button>
        </div>
      }
    </div>
  );
};

export default JobSearch;
