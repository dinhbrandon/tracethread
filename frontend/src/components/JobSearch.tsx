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





        <div className="w-2/3 p-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
                <div className="px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Search Results
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        View job details, save jobs, and more.
                    </p>
                </div>

                <div className="px-6 py-4 overflow-y-auto">
                    {searchUrl && <SearchResults encodedQuery={searchUrl} />}
                </div>

                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center">
                    <div className="inline-flex gap-x-2">
                        <button className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                            Prev
                        </button>
                        <button className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                            Next
                        </button>
                    </div>
                </div>
            </div>
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
