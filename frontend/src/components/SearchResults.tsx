import { useEffect, useState } from "react";
import { useToken } from '../hooks/useToken';
import { JobListing, SearchResultsProps } from '../types/types';
import TimeSince from "./TimeSince";


const Modal = ({ isVisible, onClose, status }: { isVisible: boolean, onClose: () => void, status: string }) => {
    if (!isVisible) return null;
    return (
        <div className="flex w-48 h-12 bg-green-600 rounded-xl">
            <div className="modal-content">
                <span className="close cursor-pointer" onClick={onClose}>Close</span>
                <p>{status}</p>
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

    console.log(hasResults)
    
    async function getQueryFromURL(encodedQuery: string) {
        console.log(encodedQuery)
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
        const url = `http://localhost:8000/querier/jobsaved/${jobListingId}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
        });
        if (response.ok) {
            setStatus("saved");
            setIsModalVisible(true);
            // Refresh the job listings to reflect the saved job
            getQueryFromURL(encodedQuery);
        } else {
            console.error('Error saving job');
        }
    }

    function closeModal() {
        setIsModalVisible(false);
    }
    
    useEffect(() => {
        getQueryFromURL(encodedQuery);
    }, [encodedQuery]);

    return (
        <div>
          

          {hasResults ? (
            <table className="min-w-full divide-y divide-gray-200 ">
            <thead>
                <tr>
                    <th className="w-10"></th>
                    <th className="w-32 text-left font-semibold text-gray-700">Job Title</th>
                    <th className="w-10 text-left font-semibold text-gray-700">Company Name</th>
                    <th className="w-32 text-left font-semibold text-gray-700">Location</th>
                    <th className="w-16 text-left font-semibold text-gray-700">Date Posted</th>
                    <th className="w-32"></th>
                </tr>
            </thead>
                <tbody className="divide-y divide-gray-200 ">
                    {results.map(job => (
                        <tr 
                        className="bg-white hover:bg-gray-50 border-b"
                        key={job.id}>
                            <td className="pr-4">
                                <img src={job.company_logo} alt="Company Logo" className="object-cover mx-auto"/>
                            </td>
                            <td className="text-sm text-gray-600">{job.job_title}</td>
                            <td className="text-sm text-gray-600">{job.company_name}</td>
                            <td className="text-sm text-gray-600">{job.location}</td>
                            <td className="text-sm text-gray-600"><TimeSince date={job.date}/></td>
                            <td>
                                {expandedJobId !== job.id ? (
                                    <button className="py-2 px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm" onClick={() => setExpandedJobId(job.id)}>See More</button>
                                ) : (
                                    <button className="py-2 px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm" onClick={() => setExpandedJobId(null)}>See Less</button>
                                )}
                                <button 
                                    className="m-1 py-2 px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm"
                                    onClick={() => saveJob(job.id).catch(error => console.log(error))}
                                >
                                    Save Job
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            ) : (
                <div className="flex justify-center items-center h-32">
                    <p className="text-2xl text-gray-400">No results found.</p>
                </div>
            )
            
          }
            
            <Modal isVisible={isModalVisible} onClose={closeModal} status={status} />
        </div>
    );
    
}

export default SearchResults;