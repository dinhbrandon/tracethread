import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { addJobToNotebook } from './redux/jobSlice';

interface SearchResultsProps {
    encodedQuery: string;
    onSelectJob: (job: JobListing) => void;
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
    const dispatch = useDispatch();
    // Get the URL from SearchForm and make a request to the backend
    // Display the results in a table
    const [data, setData] = useState<JobListing[]>([]);

    async function getQueryFromURL(encodedQuery: string) {
        const url = encodedQuery;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const fetchedData = await response.json();
        setData(fetchedData);
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
                {data.map(data => (
                    <tr key={data.id}>
                        <td>{data.job_title}</td>
                        <td>{data.company_name}</td>
                        <td>{data.location}</td>
                        <td>{data.listing_details}</td>
                        <td>{data.description}</td>
                        <td><button 
                        className="rounded-xl w-6 bg-gradient-to-r from-cyan-500 to-blue-500"
                        onClick={() => dispatch(addJobToNotebook(data))}
                        >+</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}

export default SearchResults;
