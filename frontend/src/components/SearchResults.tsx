import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { addJobToNotebook } from '../redux/jobSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
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


const SearchResults = ({ encodedQuery }: SearchResultsProps) => {
    const token = useToken();
    const username = useSelector((state: RootState) => state.auth.username);
    const dispatch = useDispatch();
    const [results, setResults] = useState<JobListing[]>([]);
    console.log(results)
    async function getQueryFromURL(encodedQuery: string) {
        const url = encodedQuery;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const fetchedData = await response.json();
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
            // body: JSON.stringify({ id: jobListingId }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error:", errorData);
            throw new Error(errorData.detail || "An error occurred while saving the job.");
        }
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
                        <td><button 
                        className="rounded-xl w-6 bg-gradient-to-r from-cyan-500 to-blue-500"
                        onClick={() => saveJob(job.id).catch(error => console.log(error))}
                        >+</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}

export default SearchResults;
