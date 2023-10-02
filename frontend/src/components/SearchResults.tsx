import { useEffect, useState } from "react";
import { useToken } from '../hooks/useToken';

interface SearchResultsProps {
    encodedQuery: string;
}

export interface JobListing {
    id: number;
    job_title: string;
    company_name: string;
    listing_details: string;
    description: string;
    location: string;
}

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
    
    async function getQueryFromURL(encodedQuery: string) {
        console.log('getQueryFromURL called with encodedQuery:', encodedQuery);  // Log when the function is called and with what argument
    
        const url = encodedQuery;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    
        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);  // Log an error if the fetch fails
            return;
        }
    
        const fetchedData = await response.json();
        console.log('fetchedData:', fetchedData);  // Log the data fetched from the server
    
        setResults(fetchedData);
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
            <table className="results-table">
            <thead>
                <tr>
                    <th>Job Title</th>
                    <th>Company Name</th>
                    <th>Location</th>
                    <th>Listing Details</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {results.map(job => (
                    <tr key={job.id}>
                        <td>{job.job_title}</td>
                        <td>{job.company_name}</td>
                        <td>{job.location}</td>
                        <td>{job.listing_details}</td>
                        <td>{job.description}</td>
                        <td>
                            <button 
                                className="rounded-xl w-6 bg-gradient-to-r from-cyan-500 to-blue-500"
                                onClick={() => saveJob(job.id).catch(error => console.log(error))}
                            >
                                +
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
