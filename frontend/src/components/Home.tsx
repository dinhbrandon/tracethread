import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { clearError } from '../redux/authSlice';
import SignUpForm  from './SignUpForm'
import LoginForm from './LoginForm'
import { RootState } from '../redux/store';
import CreateGuest from './CreateGuest';
import homePageAsset from '../assets/HomePage.png'

type ModalState = 'signup' | 'login' | null;

const Home = () => {
  const dispatch = useDispatch();

    const [activeModal, setActiveModal] = useState<ModalState>(null);
    const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
    const modalRef = useRef(null);

    const [loading, setLoading] = useState(false);

    function loadWheel(): any {
      setLoading(true);
    }


    const toggleSignUpModal = () => {
        setActiveModal(prev => prev === 'signup' ? null : 'signup');
    };

    const toggleLoginModal = () => {
            setActiveModal(prev => prev === 'login' ? null : 'login');
    };

    const handleCloseModal = () => {
      dispatch(clearError()); // Dispatch clearError action when modal is closed
      setActiveModal(null);
    };
    
    useEffect(() => {
            const clickOutside = (e: MouseEvent) => {
                if (activeModal && modalRef.current && !(modalRef.current as any).contains(e.target as Node)) {
                    dispatch(clearError());
                    setActiveModal(null);
                }
            };
            document.addEventListener('mousedown', clickOutside);
            return () => {
                document.removeEventListener('mousedown', clickOutside);
            };
    }, [activeModal]);
    

  return (


<div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
    {activeModal === 'signup' && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="w-[600px] relative">
                    <button 
                    onClick={() => setActiveModal(null)} 
                    className="absolute right-28 top-28 m-3 text-black text-2xl"
                >
                    &times;
                </button>
                        <SignUpForm ref={modalRef} toggleSignUpModal={toggleSignUpModal} toggleLoginModal={toggleLoginModal} />
                    </div>
                </div>
            )}
            {activeModal === 'login' && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="p-8 relative">
                    <button 
                    onClick={handleCloseModal}
                    className="absolute right-16 top-36 m-3 text-black text-2xl"
                >
                    &times;
                </button>
                        <LoginForm ref={modalRef} toggleSignUpModal={toggleSignUpModal} toggleLoginModal={toggleLoginModal} />
                    </div>
                </div>
            )}
  <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
    <div>
      <h1 className="block text-3xl font-bold sm:text-4xl lg:text-6xl lg:leading-tight ">A guiding thread to your perfect career.</h1>
      <p className="mt-3 text-lg">Save time for more opportunities with a software platform designed with your job searching needs in mind.</p>

    { loggedIn ? <></> : (
        <div className="mt-7 grid gap-3 w-full sm:inline-flex md:flex md:flex-col">
          <div className="flex">
            <button
        onClick={toggleSignUpModal}
        className="inline-flex justify-center items-center gap-x-3 text-center hover:bg-gray-100 border-2 text-sm lg:text-base font-medium rounded-md transition py-3 px-4 ">
            Sign up
            <svg className="w-2.5 h-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            </button>
            <button className="bg-sky-600 py-3 px-5 inline-flex justify-center ml-8 items-center gap-2 rounded-md border font-medium text-white shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm" onClick={toggleLoginModal}>
            Login here
            </button>
          </div>

        <div className="flex">
        <p className="mt-2 text-sm">
            Just checking us out?&nbsp;
            {loading ? (
            
            <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
              <div role="status">
                  <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
              </div> 
            </div>
            ) 
            :
            (<CreateGuest loadWheel={loadWheel}/>) }
            
            </p>
            
        </div>
        
    </div>
    )}
        

    </div>


    <div className="mt-5 relative ml-4">
      <img className="w-full rounded-md" src={homePageAsset} alt="Image Description"/>
    
      <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-blue-200 via-white/0 to-white/0 w-full h-full rounded-md mt-4 -mb-4 mr-4 -ml-4 lg:mt-6 lg:-mb-6 lg:mr-6 lg:-ml-6 "></div>

      {/* <div className="absolute bottom-0 left-0">
        <svg className="w-2/3 ml-auto h-auto text-white dark:text-slate-900" width="630" height="451" viewBox="0 0 630 451" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="531" y="352" width="99" height="99" fill="currentColor"/>
          <rect x="140" y="352" width="106" height="99" fill="currentColor"/>
          <rect x="482" y="402" width="64" height="49" fill="currentColor"/>
          <rect x="433" y="402" width="63" height="49" fill="currentColor"/>
          <rect x="384" y="352" width="49" height="50" fill="currentColor"/>
          <rect x="531" y="328" width="50" height="50" fill="currentColor"/>
          <rect x="99" y="303" width="49" height="58" fill="currentColor"/>
          <rect x="99" y="352" width="49" height="50" fill="currentColor"/>
          <rect x="99" y="392" width="49" height="59" fill="currentColor"/>
          <rect x="44" y="402" width="66" height="49" fill="currentColor"/>
          <rect x="234" y="402" width="62" height="49" fill="currentColor"/>
          <rect x="334" y="303" width="50" height="49" fill="currentColor"/>
          <rect x="581" width="49" height="49" fill="currentColor"/>
          <rect x="581" width="49" height="64" fill="currentColor"/>
          <rect x="482" y="123" width="49" height="49" fill="currentColor"/>
          <rect x="507" y="124" width="49" height="24" fill="currentColor"/>
          <rect x="531" y="49" width="99" height="99" fill="currentColor"/>
        </svg>
      </div> */}

    </div>

  </div>

</div>

  )
}

export default Home
