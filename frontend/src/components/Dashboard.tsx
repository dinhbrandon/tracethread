import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { SavedSearchParameters } from '../types/types';
import { useToken } from '../hooks/useToken';

const Dashboard: React.FC = () => {
  // const baseUrlApi = import.meta.env.VITE_API_BASE_URL;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  //   const [savedParameters, setSavedParameters] = useState<SavedSearchParameters[]>([]);
    const token = useToken();
    const navigate = useNavigate();


  //   async function getParametersFromUser() {
  //       const url = `${baseUrlApi}/querier/saved-search-parameters`;
  //       const response = await fetch(url, {
  //           method: "GET",
  //           headers: {
  //               "Content-Type": "application/json",
  //               "Authorization": `Token ${token}`
  //           },
  //       });
  //       if (response.ok){
  //           const fetchedData = await response.json();
  //           setSavedParameters(fetchedData);
  //       }
  //       else {
  //           console.error('Failed to fetch the data');
  //       }
  //   }

  //   async function deleteParameter(id: number) {
  //     const url = `${baseUrlApi}/querier/saved-search-parameters/${id}`;
  //     const response = await fetch(url, {
  //         method: "DELETE",
  //         headers: {
  //             "Authorization": `Token ${token}`
  //         },
  //     });

  //     if (response.ok) {
  //         setSavedParameters(prevParams => prevParams.filter(param => param.id !== id));
  //         getParametersFromUser();
  //     } else {
  //         console.error('Failed to delete the parameter');
  //     }
  // }

  //   useEffect(() => {
  //       getParametersFromUser();   
  //   }, []); 
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

    return (
        // <!-- Icon Blocks -->
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          {/* <!-- Grid --> */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="lg:w-3/4">
              <h2 className="text-3xl text-gray-800 font-bold lg:text-4xl">
                Comprehensive job applicant tools designed to optimize your path to the perfect career.
              </h2>
              <p className="mt-3 text-gray-800">
              We assist tech professionals in securing their ideal roles by offering a comprehensive platform, enabling users to effectively track, organize, and manage their job applications, as well as discover new opportunities through advanced search and filtering options.</p>
              <a href={`${baseUrl}/tutorial`}>
              <p className="mt-5 inline-flex items-center gap-x-2 font-medium text-blue-600">
                Learn more with our tutorial
                <svg className="w-2.5 h-2.5 transition ease-in-out group-hover:translate-x-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0.975821 6.92249C0.43689 6.92249 -3.50468e-07 7.34222 -3.27835e-07 7.85999C-3.05203e-07 8.37775 0.43689 8.79749 0.975821 8.79749L12.7694 8.79748L7.60447 13.7596C7.22339 14.1257 7.22339 14.7193 7.60447 15.0854C7.98555 15.4515 8.60341 15.4515 8.98449 15.0854L15.6427 8.68862C16.1191 8.23098 16.1191 7.48899 15.6427 7.03134L8.98449 0.634573C8.60341 0.268455 7.98555 0.268456 7.60447 0.634573C7.22339 1.00069 7.22339 1.59428 7.60447 1.9604L12.7694 6.92248L0.975821 6.92249Z" fill="currentColor"/>
                </svg>
              </p>
              </a>
              <p className="text-sm text-gray-600">(Coming soon)</p>
            </div>
            {/* <!-- End Col --> */}
        
            <div className="space-y-6 lg:space-y-10">
              {/* <!-- Icon Block --> */}
              <div className="flex">
                {/* <!-- Icon --> */}
                <span className="flex-shrink-0 inline-flex justify-center items-center w-[46px] h-[46px] rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm mx-auto">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                    <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                  </svg>
                </span>
                <div className="ml-5 sm:ml-8">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Trace Thread: Beta Testing 
                  </h3>
                  <p className="mt-1 text-gray-800">
                    We're beyond excited to have you here to help test our service and we're looking forward to hearing your feedback. This is a beta version of Trace Thread, so the content on this site may not accurately reflect the final product.
                  </p>
                  <p className="mt-2 text-gray-500 text-sm">Note: The beta version of our service is not intended for personal use, but rather for testing design and infrastructure. Please keep in mind that your saved data may be erased as we update our application.</p>
                </div>
              </div>
              {/* <!-- End Icon Block --> */}
        
              {/* <!-- Icon Block --> */}
              <div className="flex">
                {/* <!-- Icon --> */}
                <span className="flex-shrink-0 inline-flex justify-center items-center w-[46px] h-[46px] rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm mx-auto">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
                    <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                  </svg>
                </span>
                <div className="ml-5 sm:ml-8">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Reporting bugs and providing feedback
                  </h3>
                  <p className="mt-1 text-gray-800">
                    At the top left of the screen, you'll see a button that says "Fix/Suggestions". Clicking this button will open a modal where you can report bugs and provide us with your valuable feedback.
                  </p>
                  <p className="mt-2 text-gray-500 text-sm">• Please press the button on the specific page where you want to submit feedback for; this helps us accurately identify and address the problem.</p>
                  <p className="mt-2 text-gray-500 text-sm">• Along with a text field to provide us with input, an optional screenshot upload field is also available if you would like to provice us with comprehensive notes.</p>
                </div>
              </div>
              {/* <!-- End Icon Block --> */}
        
              {/* <!-- Icon Block --> */}
              <div className="flex">
                {/* <!-- Icon --> */}
                <span className="flex-shrink-0 inline-flex justify-center items-center w-[46px] h-[46px] rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm mx-auto">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                  </svg>
                </span>
                <div className="ml-5 sm:ml-8">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    Our goals
                  </h3>
                  <p className="mt-1 text-m text-gray-800">
                    We have a lot of features that we're aiming to add to Trace Thread in the near future. Here are some of the features that we're currently working on:
                  </p>
                  <p className="mt-2 text-gray-500 text-sm">• AI/ML tools for users to upload their resume and identify tech roles best suited to their skillset for a tailored job search.</p>
                  <p className="mt-2 text-gray-500 text-sm">• Data visualization to display job-related trends and matching strengths between jobseekers and potential employers.</p>
                  <p className="mt-2 text-gray-500 text-sm">• Enhancing our current features with your feedback to provide a more intuitive and efficient workflow.</p>
                </div>
              </div>
              {/* <!-- End Icon Block --> */}
            </div>
            {/* <!-- End Col --> */}
          </div>
          {/* <!-- End Grid --> */}
        </div>
        // <!-- End Icon Blocks -->
  );
  
}

export default Dashboard;
