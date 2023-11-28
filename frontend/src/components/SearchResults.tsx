import { useEffect, useState, useRef } from "react";
import { useToken } from '../hooks/useToken';
import { JobListing, SearchResultsProps } from '../types/types';
import TimeSince from "./TimeSince";
import * as React from "react";

const baseUrlApi = import.meta.env.VITE_API_BASE_URL;


const Modal = ({ isVisible, onClose, status }: { 
    isVisible: boolean, 
    onClose: () => void, 
    status: string, 
}) => {
    if (!isVisible) return null;

    return (
<div className="fixed bottom-0 right-0 mb-4 mr-4 z-50 p-4 rounded-md bg-teal-50 border border-teal-200" role="alert">
  <div className="flex">
    <div className="flex-shrink-0">
      <svg className="h-4 w-4 text-teal-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
    </svg> 
    </div>
    <div className="ml-3">
      <div className="text-sm text-teal-800 font-medium">
        {status}
      </div>
    </div>
    <div className="pl-3 ml-auto">
      <div className="-mx-1.5 -my-1.5">
        <button type="button" className="inline-flex bg-teal-50 rounded-md p-1.5 text-teal-500 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-50 focus:ring-teal-600" onClick={onClose}>
          <span className="sr-only">Dismiss</span>
          <svg className="h-3 w-3" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0.92524 0.687069C1.126 0.486219 1.39823 0.373377 1.68209 0.373377C1.96597 0.373377 2.2382 0.486219 2.43894 0.687069L8.10514 6.35813L13.7714 0.687069C13.8701 0.584748 13.9882 0.503105 14.1188 0.446962C14.2494 0.39082 14.3899 0.361248 14.5321 0.360026C14.6742 0.358783 14.8151 0.38589 14.9468 0.439762C15.0782 0.493633 15.1977 0.573197 15.2983 0.673783C15.3987 0.774389 15.4784 0.894026 15.5321 1.02568C15.5859 1.15736 15.6131 1.29845 15.6118 1.44071C15.6105 1.58297 15.5809 1.72357 15.5248 1.85428C15.4688 1.98499 15.3872 2.10324 15.2851 2.20206L9.61883 7.87312L15.2851 13.5441C15.4801 13.7462 15.588 14.0168 15.5854 14.2977C15.5831 14.5787 15.4705 14.8474 15.272 15.046C15.0735 15.2449 14.805 15.3574 14.5244 15.3599C14.2437 15.3623 13.9733 15.2543 13.7714 15.0591L8.10514 9.38812L2.43894 15.0591C2.23704 15.2543 1.96663 15.3623 1.68594 15.3599C1.40526 15.3574 1.13677 15.2449 0.938279 15.046C0.739807 14.8474 0.627232 14.5787 0.624791 14.2977C0.62235 14.0168 0.730236 13.7462 0.92524 13.5441L6.59144 7.87312L0.92524 2.20206C0.724562 2.00115 0.611816 1.72867 0.611816 1.44457C0.611816 1.16047 0.724562 0.887983 0.92524 0.687069Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>
    );
};






const SearchResults = ({ encodedQuery }: SearchResultsProps) => {
    const token = useToken();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("not saved");
    const [results, setResults] = useState<JobListing[]>([]);
    const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
    const [hasResults, setHasResults] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleRowClick = (jobId: number) => {
        if (expandedJobId === jobId) {
            setExpandedJobId(null);
        } else {

            if (expandedJobId !== null) {
                setExpandedJobId(null);
                setTimeout(() => {
                    setExpandedJobId(jobId);
                }, 500);
            } else {
                setExpandedJobId(jobId);
            }
        }
    };

  

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(results.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    
    async function getQueryFromURL(encodedQuery: string) {
        
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        try {
            const response = await fetch(encodedQuery, {
                method: "GET",
                headers: headers,
            });

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const fetchedData = await response.json();
            setResults(fetchedData);
            setHasResults(fetchedData.length > 0);
        } catch (error) {
            console.error((error as Error).message);
        }
    }
    

    async function saveJob(jobListingId: number) {
        const url = `${baseUrlApi}/querier/jobsaved/${jobListingId}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
        });
        if (response.ok) {
            setStatus("Job saved successfully");
            setIsModalVisible(true);
            setTimeout(() => {
                setIsModalVisible(false); // hide the modal after 3 seconds
            }, 3000);
            getQueryFromURL(encodedQuery);
        } else {
            console.error('Error saving job');
        }
    }

    // function closeModal() {
    //     setIsModalVisible(false);
    // }
    
    useEffect(() => {
        getQueryFromURL(encodedQuery);
    }, [encodedQuery]);

    return (
        <div>
          

          {hasResults ? (
            <table className="w-full divide-y divide-gray-200 ">
            <thead>
                <tr>
                    <th className="w-5"></th>
                    <th className="w-32 text-left font-semibold text-gray-700">Job Title</th>
                    <th className="w-10 text-left font-semibold text-gray-700">Company Name</th>
                    {/* <th className="w-32 text-left font-semibold text-gray-700">Details</th> */}
                    <th className="w-10 text-left font-semibold text-gray-700">Location</th>
                    <th className="w-16 text-left font-semibold text-gray-700">Date Posted</th>
                </tr>
            </thead>
                <tbody className="divide-y divide-gray-200 ">
                    {currentItems.map(job => (
                        
                        <React.Fragment key={job.id}>
                        <tr 
                        className={`cursor-pointer border-b 
                        ${expandedJobId === job.id ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
                        onClick={() => handleRowClick(job.id)}
                    >
                        <td className="pr-0">
                            <img src={job.company_logo} alt="Company Logo" className="object-cover mx-auto"/>
                        </td>
                        <td className="text-sm text-gray-600">{job.job_title}</td>
                        <td className="text-sm text-gray-600">{job.company_name}</td>
                        {/* <td className="text-sm text-gray-600">{job.listing_details}</td> */}
                        <td className="text-sm text-gray-600">{job.location}</td>
                        <td className="text-sm text-gray-600"><TimeSince date={job.date}/></td>  
                    </tr>

                    <tr>
                        <td colSpan={6}>
                            <div 
                                className={`transition-all ease-in-out duration-500 bg-white 
                                            ${expandedJobId === job.id ? 'max-h-[3000px] opacity-100 visible py-2' : 'max-h-0 opacity-0 overflow-hidden py-0'}`}
                            >
                                <p className="text-left font-semibold text-gray-700 mb-2">Job Description</p>
                                <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: job.description }}></p>

                                <button className="m-1 py-2 px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm">
                                    <a href={job.url} target="_blank" rel="noreferrer">Apply</a>
                                </button>
                                <button 
                                    className="m-1 py-2 px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        saveJob(job.id).catch(error => console.log(error));
                                    }}
                                >
                                    Save Job
                                </button>
                            </div>
                        </td>
                    </tr>



                    </React.Fragment>
                    
                ))}
            </tbody>
            </table>
        
            
            ) : (
                <div className="flex justify-center items-center h-32">
                    <p className="text-2xl text-gray-400">No results found.</p>
                </div>
            )
            }

{hasResults && results.length > itemsPerPage ? (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
                <p className="text-sm text-gray-700">
                    Showing
                    <span className="font-medium"> {Math.min(currentPage * itemsPerPage, results.length)} </span>
                    of
                    <span className="font-medium"> {results.length} </span>
                    results
                </p>
            </div>
            <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
                        disabled={currentPage === 1}
                    >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {pageNumbers.map(number => (
                        <a 
                            href="#" 
                            key={number} 
                            onClick={() => paginate(number)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === number ? 'bg-indigo-600 text-white' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'}`}
                        >
                            {number}
                        </a>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageNumbers.length))}
                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === pageNumbers.length ? 'cursor-not-allowed' : ''}`}
                        disabled={currentPage === pageNumbers.length}
                    >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
    </div>
) : null}



            <Modal isVisible={isModalVisible} status={status} onClose={() => setIsModalVisible(false)} />

            
        </div>
    );
        
}

export default SearchResults;