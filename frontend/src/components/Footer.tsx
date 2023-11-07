import { useState } from 'react';

const baseUrl = import.meta.env.VITE_BASE_URL;

const Footer = () => {

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalColor, setModalColor] = useState('green');
    const [email, setEmail] = useState('');


    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubscribeClick = () => {
        if (validateEmail(email)) {
            setModalMessage('Subscription successful!');
            setModalColor('green');
        } else {
            setModalMessage('Please enter a valid email address.');
            setModalColor('red');

        }
        setShowModal(true);

        setTimeout(() => {
            setShowModal(false);
        }, 3000);
    };


    return (
        <footer className="bg-gray-900">
  <div className="max-w-[85rem] py-2 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">

    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div className="col-span-full lg:col-span-1">
        <a className="flex-none text-xl font-semibold text-white" href={`${baseUrl}`} aria-label="Brand">Trace Thread</a>
      </div>

      <div className="col-span-1">
        <h4 className="font-semibold text-gray-100">Product</h4>

        <div className="mt-3 grid space-y-3">
  <p><a className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200" href={`${baseUrl}/pricing`}>Pricing</a></p>
  <p><a className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200" href={`${baseUrl}/tutorial`}>Tutorial</a></p>
  <p><a className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200" href={`${baseUrl}/support`}>Support</a></p>
</div>
</div>


<div className="col-span-1">
  <h4 className="font-semibold text-gray-100">Company</h4>

  <div className="mt-3 grid space-y-3">
    <p><a className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200" href={`${baseUrl}/about`}>About us</a></p>
    <p><a className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200" href={`${baseUrl}/careers`}>Careers</a></p>
    <p><a className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200" href={`${baseUrl}/contact`}>Contact Us</a></p>
  </div>
</div>


      <div className="col-span-2">
                <h4 className="font-semibold text-gray-100">Stay up to date</h4>

                <form>
                    <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:gap-3 bg-white rounded-md p-2">
                        <div className="w-full">
                            <label htmlFor="hero-input" className="sr-only">Email</label>
                            <input type="text" id="hero-input" name="hero-input" className="py-3 px-4 block w-full border-transparent shadow-sm rounded-md focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <button type="button" className="w-full sm:w-auto whitespace-nowrap inline-flex justify-center items-center gap-x-3 text-center bg-sky-600 hover:bg-sky-700 border border-transparent text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition py-3 px-4" onClick={handleSubscribeClick}>
                            Subscribe
                        </button>
                    </div>
                </form>
            </div>

            {
    showModal && (
<div className={`fixed bottom-0 right-0 mb-4 mr-4 z-50 p-4 rounded-md bg-teal-50 border border-teal-200 ${modalColor === 'green' ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`} role="alert">
  <div className="flex">
    <div className="flex-shrink-0">
      {modalColor === 'green' && (
        <svg className="h-4 w-4 text-teal-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg> 
      )}
    </div>
    <div className="ml-3">
      <div className="text-sm text-teal-800 font-medium">
        {modalMessage}
      </div>
    </div>
  </div>
</div>

    )
}


    </div>


    <div className="mt-5 sm:mt-12 grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-between sm:items-center">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">© 2023 Trace Thread. All rights reserved.</p>
      </div>


{/* 
      <div>
        <a className="inline-flex justify-center items-center gap-x-3.5 w-10 h-10 text-center text-gray-200 hover:bg-white/[.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition" href="#">
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
          </svg>
        </a>
        <a className="inline-flex justify-center items-center gap-x-3.5 w-10 h-10 text-center text-gray-200 hover:bg-white/[.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition" href="#">
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
          </svg>
        </a>
        <a className="inline-flex justify-center items-center gap-x-3.5 w-10 h-10 text-center text-gray-200 hover:bg-white/[.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition" href="#">
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
          </svg>
        </a>
        <a className="inline-flex justify-center items-center gap-x-3.5 w-10 h-10 text-center text-gray-200 hover:bg-white/[.1] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition" href="#">
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
      </div> */}

    </div>
  </div>
</footer>
    );
}

export default Footer;