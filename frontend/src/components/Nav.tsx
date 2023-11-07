import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authActions';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SubmitFeedbackProps } from '../types/types';
import { useToken } from '../hooks/useToken';

const baseUrl = import.meta.env.VITE_BASE_URL;

const SubmitFeedback = ({ isOpen, onClose, pageUrl }: SubmitFeedbackProps) => {
  const [feedback, setFeedback] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const token = useToken();

  const resetForm = () => {
    setFeedback('');
    setImage(null);
  };

  const handleSubmit = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const formData = new FormData();
    formData.append('url', pageUrl);
    formData.append('feedback', feedback);
    if (image) {
      formData.append('screenshot', image);
    }

    try {
      const response = await fetch(`${baseUrl}/api/submit-feedback/`, {
        headers: {
          "Authorization": `Token ${token}`,
        },
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        resetForm(); // Reset the form after successful submission
      } else {
        console.error('Failed to submit feedback.');
      }
    } catch (error) {
      console.error('An error occurred while submitting the feedback:', error);
    }

    onClose();
  };

  const handleClose = () => {
    resetForm(); // Reset the form when the modal is closed
    onClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded p-8 m-4 max-w-xl w-full">
        <h1 className="mb-4 text-xl font-bold">Thanks for the feedback!</h1>
        <p className="mb-4">Page: {pageUrl}</p>
        <textarea className="w-full h-32 mb-4 border p-2" value={feedback} onChange={(e) => setFeedback(e.target.value)}></textarea>
        <p className="text-xs text-gray-500 mb-2">Optional screenshot upload</p>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} className="mb-4" />
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
        <button onClick={handleClose} className="ml-2 text-gray-700 hover:text-black px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
};


const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  // const [isMenuOpen, toggleMenu] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const pageUrl = window.location.href;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
      <header className="border-b flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full py-3 sm:py-0">
      <nav className="relative w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8" aria-label="Global">

      <div className="flex items-center">
    <div>
        <a className="flex-none text-xl font-semibold whitespace-nowrap text-gray-700" href={baseUrl} aria-label="Tracethread">Trace Thread BETA</a>
    </div>

    <div className='ml-10 flex items-center'>
    <button
    onClick={() => setModalOpen(true)}
    className="m-1 py-2 px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm flex items-center min-w-[170px]"
    >
        <img className='h-8 w-8 rounded-full ring-2 ring-blue mr-2'
            src="https://img.icons8.com/?size=96&id=20544&format=png" 
            alt="Feedback" 
        />
        <span className='whitespace-nowrap'>Fix/Suggestions</span>
    </button>
    <SubmitFeedback isOpen={modalOpen} onClose={() => setModalOpen(false)} pageUrl={pageUrl} />
</div>






</div>

        

        
        <div id="navbar-collapse-with-animation" className={`overflow-hidden transition-all duration-300 basis-full grow sm:block`}>
          <div className="flex flex-col gap-y-4 gap-x-0 mt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:pl-7">
            { loggedIn ? (
              <>
              <a className="font-medium" href={`${baseUrl}/feedback`}>Feedback Thread</a>
              <a className="font-medium" href={`${baseUrl}/dashboard`}>Info</a>
              <a className="font-medium" href={`${baseUrl}/search`}>Search</a>
              <a className="font-medium" href={`${baseUrl}/jobnotebook`}>Job Notebook</a>
              
              </>
            ) : <></>}
            
              {loggedIn ? (
              <button onClick={handleLogout} className="flex items-center gap-x-2 font-medium sm:border-l sm:my-6 sm:pl-6">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
                Logout
              </button>
              ) : (
              <a className="flex items-center gap-x-2 font-medium sm:border-l sm:my-6 sm:pl-6" href={`${baseUrl}/login`}>
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
                Login
              </a>
              )}
          </div>
        </div>
      </nav>
    </header>
  );
  
};

export default Nav;
