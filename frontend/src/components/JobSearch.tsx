import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
// import { resetJobAdditionStatus } from '../redux/jobSlice';

const baseUrlApi = import.meta.env.VITE_API_BASE_URL;

const JobSearch = () => {
  // const dispatch = useDispatch();

  // const isAuthenticated = useSelector((state: RootState) => state.auth.loggedIn);
  // const username = useSelector((state: RootState) => state.auth.username);
  const jobAdditionStatus = useSelector((state: RootState) => state.job.jobAdditionStatus);

  const [searchUrl, setSearchUrl] = useState<string | null>(null);
  const [_showModal, setShowModal] = useState(false);
  const [_modalMessage, setModalMessage] = useState('');
  const [_modalColor, setModalColor] = useState('green');
  const [refreshKey, setRefreshKey] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSimpleSearchLocked, setIsSimpleSearchLocked] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }

const handleSearchButtonClick = () => {
  if (!searchText.trim()) {
    // setErrorMessage('Please enter a search query.');
    setSearchUrl(`${baseUrlApi}/querier/search-job-listing/?q=`);
    setHasSearched(true);
  } else {
    // setErrorMessage('');
    setSearchUrl(`${baseUrlApi}/querier/search-job-listing/?q=%28job_title%3D'${searchText}'%20%7C%20company_name%3D'${searchText}'%29`);
    setHasSearched(true);
  }
};

  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
    if (!showAdvancedSearch) {
      setSearchText('');
      setIsSimpleSearchLocked(true);
    } else {
      setIsSimpleSearchLocked(false);
    }
  }

  const refreshSavedParameters = () => {
    setRefreshKey(!refreshKey);
  }


  const handleSearch = (url: string) => {
    setSearchUrl(url);
  }

  // const handleCloseModal = () => {
  //   setShowModal(false);
  //   dispatch(resetJobAdditionStatus());
  // };

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

    <div className='flex h-screen relative'>

      <div className={`absolute top-0 left-0 h-full transition-transform duration-300 ease-in-out ${showAdvancedSearch ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full border-r p-4 w-auto">
            <h1 className="text-xl font-semibold text-gray-700">Advanced Search Tool</h1>
            <SearchForm onSearch={handleSearch} onRefresh={refreshSavedParameters} refreshKey={refreshKey} />
        </div>
      </div>




      <div className={`flex-grow p-4 transition-all duration-300 ease-in-out`} style={{ marginLeft: showAdvancedSearch ? '500px' : '0' }}>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden ">
                <div className="px-6 py-4">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 ">
                      <div className="sm:col-span-1">

                      <form
  onSubmit={(e) => {
    e.preventDefault();
    handleSearchButtonClick();
  }}
>
  <div className="sm:col-span-1">
    <div className="relative">
      <input
        type="text"
        value={searchText}
        onChange={handleSearchTextChange}
        className="py-2 px-3 pl-11 block w-full border-gray-200 shadow-sm rounded-md text-sm"
        placeholder="Search"
        disabled={isSimpleSearchLocked}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <button type="submit" disabled={isSimpleSearchLocked} className="p-1">
          <svg className="h-4 w-4 text-gray-400 hover:h-5 hover:w-5 transition duration-700" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078,.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
      </div>
    </div>
    {/* {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>} */}
  </div>
</form>



  </div>


  <div className="sm:col-span-2 md:grow">
    <div className="flex justify-end gap-x-2">
      <div className="hs-dropdown relative inline-block [--placement:bottom-right]" data-hs-dropdown-auto-close="inside">
        <button onClick={toggleAdvancedSearch} id="hs-as-table-table-filter-dropdown" type="button" className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm">
          <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
          </svg>
          Advanced search
        </button>
        </div>
      </div>
    </div>
  </div>
</div>
{hasSearched && (
  <div className='mt-5 mb-5'>
    <h2 className="text-xl font-semibold text-gray-700">
        Search Results
    </h2>
    <p className="text-sm text-gray-600">
        View job details, save jobs, and more.
    </p>
  </div>
)}
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-200px)] mb-10">
          {searchUrl && <SearchResults encodedQuery={searchUrl} />}
      </div>

  </div>
  </div>

    </div>



  

  );
};

export default JobSearch;
