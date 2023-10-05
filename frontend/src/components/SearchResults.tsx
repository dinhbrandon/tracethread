import { useEffect, useState } from "react";
import { useToken } from '../hooks/useToken';
import { JobListing, SearchResultsProps } from '../types/types';

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
            <h1>Search Results</h1>
            <table>
            <thead className="bg-gray-700">
                <tr>
                    <th className="px-6 py-3">Job Title</th>
                    <th>Company Name</th>
                    <th>Location</th>
                    {expandedJobId !== null && (
                    <>
                        <th>Listing Details</th>
                        <th>Description</th>
                    </>
                )}
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {results.map(job => (
                    <tr 
                    className="bg-gray-800 hover:bg-gray-700 border-b"
                    key={job.id}>
                        <td className="px-6 py-4">{job.job_title}</td>
                        <td>{job.company_name}</td>
                        <td>{job.location}</td>
                        {expandedJobId === job.id && (
                            <>
                                <td>{job.listing_details}</td>
                                <td>{job.description}</td>
                            </>
                        )}
                        <td>
                            {expandedJobId !== job.id ? (
                                <button className="bg-orange-500 rounded-xl m-1 p-1" onClick={() => setExpandedJobId(job.id)}>See More</button>
                            ) : (
                                <button className="bg-purple-500 rounded-xl m-1 p-1" onClick={() => setExpandedJobId(null)}>See Less</button>
                            )}
                        </td>
                        <td>
                            <button 
                                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 m-1 p-1"
                                onClick={() => saveJob(job.id).catch(error => console.log(error))}
                            >
                                Save Job
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <Modal isVisible={isModalVisible} onClose={closeModal} status={status} />
        </div>
    );
}

export default SearchResults;