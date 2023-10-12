import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
import SavedParameters from './SavedParameters';
import { resetJobAdditionStatus } from '../redux/jobSlice';

const Dashboard = () => {
  const dispatch = useDispatch();

  // Retrieve data from the Redux store
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
    <div>
      <h1>Saved Parameters</h1>

    </div>
  );
};

export default Dashboard;
