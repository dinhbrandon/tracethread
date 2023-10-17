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
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
                <tr>
                    <th className="w-20">Logo</th>
                    <th className="w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">Job Title</th>
                    <th className="w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">Company Name</th>
                    <th className="w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">Location</th>
                    <th className="w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">Date Posted</th>


                    <th className="w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">Actions</th>
                </tr>
            </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {results.map(job => (
                        <tr 
                        className="bg-gray-800 hover:bg-gray-700 border-b"
                        key={job.id}>
                            <td className="w-20">
                                <img src={job.company_logo} alt="Company Logo" className="w-16 h-16 object-cover mx-auto"/>
                            </td>
                            <td className="w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">{job.job_title}</td>
                            <td className="w-10 overflow-hidden overflow-ellipsis whitespace-nowrap">{job.company_name}</td>
                            <td className="w-32 overflow-hidden overflow-ellipsis whitespace-nowrap">{job.location}</td>
                            <td className="w-32 overflow-hidden overflow-ellipsis whitespace-nowrap"><TimeSince date={job.date}/></td>
                            <td className="h-px w-px whitespace-nowrap">
                                <div className="px-6 py-1.5">
                                    {expandedJobId !== job.id ? (
                                        <button className="bg-orange-500 rounded-xl m-1 p-1" onClick={() => setExpandedJobId(job.id)}>See More</button>
                                    ) : (
                                        <button className="bg-purple-500 rounded-xl m-1 p-1" onClick={() => setExpandedJobId(null)}>See Less</button>
                                    )}
                                    <button 
                                        className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 m-1 p-1"
                                        onClick={() => saveJob(job.id).catch(error => console.log(error))}
                                    >
                                        Save Job
                                    </button>
                                </div>
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


{/* <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
<thead className="bg-gray-50 dark:bg-slate-800">
  <tr>
    <th scope="col" className="pl-6 py-3 text-left">
      <label for="hs-at-with-checkboxes-main" className="flex">
        <input type="checkbox" className="shrink-0 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-main"/>
        <span className="sr-only">Checkbox</span>
      </label>
    </th>

    <th scope="col" className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3 text-left">
      <div className="flex items-center gap-x-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
          Name
        </span>
      </div>
    </th>

    <th scope="col" className="px-6 py-3 text-left">
      <div className="flex items-center gap-x-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
          Position
        </span>
      </div>
    </th>

    <th scope="col" className="px-6 py-3 text-left">
      <div className="flex items-center gap-x-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
          Status
        </span>
      </div>
    </th>

    <th scope="col" className="px-6 py-3 text-left">
      <div className="flex items-center gap-x-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
          Portfolio
        </span>
      </div>
    </th>

    <th scope="col" className="px-6 py-3 text-left">
      <div className="flex items-center gap-x-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
          Created
        </span>
      </div>
    </th>

    <th scope="col" className="px-6 py-3 text-right"></th>
  </tr>
</thead>

<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
  <tr>
    <td className="h-px w-px whitespace-nowrap">
      <div className="pl-6 py-3">
        <label for="hs-at-with-checkboxes-1" className="flex">
          <input type="checkbox" className="shrink-0 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-1"/>
          <span className="sr-only">Checkbox</span>
        </label>
      </div>
    </td>
    <td className="h-px w-px whitespace-nowrap">
      <div className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3">
        <div className="flex items-center gap-x-3">
          <img className="inline-block h-[2.375rem] w-[2.375rem] rounded-full" src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Image Description"/>
          <div className="grow">
            <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Christina Bersh</span>
            <span className="block text-sm text-gray-500">christina@site.com</span>
          </div>
        </div>
      </div>
    </td>
    <td className="h-px w-72 whitespace-nowrap">
      <div className="px-6 py-3">
        <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Director</span>
        <span className="block text-sm text-gray-500">Human resources</span>
      </div>
    </td>
    <td className="h-px w-px whitespace-nowrap">
      <div className="px-6 py-3">
        <span className="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
          Active
        </span>
      </div>
    </td>
    <td className="h-px w-px whitespace-nowrap">
      <div className="px-6 py-3">
        <div className="flex items-center gap-x-3">
          <span className="text-xs text-gray-500">1/5</span>
          <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
            <div className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-gray-200" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      </div>
    </td>
    <td className="h-px w-px whitespace-nowrap">
      <div className="px-6 py-3">
        <span className="text-sm text-gray-500">28 Dec, 12:12</span>
      </div>
    </td>
    <td className="h-px w-px whitespace-nowrap">
      <div className="px-6 py-1.5">
        <a className="inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 hover:underline font-medium" href="#">
          Edit
        </a>
      </div>
    </td>
  </tr>

  <tr>
    <td className="h-px w-px whitespace-nowrap">
      <div className="pl-6 py-3">
        <label for="hs-at-with-checkboxes-6" className="flex">
          <input type="checkbox" className="shrink-0 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-at-with-checkboxes-6"/>
          <span className="sr-only">Checkbox</span>
        </label>
      </div>
    </td>
    <td className="h-px w-px whitespace-nowrap">
      <div className="pl-6 lg:pl-3 xl:pl-0 pr-6 py-3">
        <div className="flex items-center gap-x-3">
          <img className="inline-block h-[2.375rem] w-[2.375rem] rounded-full" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Image Description"/>
          <div className="grow">
            <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Brian Halligan</span>
            <span className="block text-sm text-gray-500">brian@site.com</span>
          </div>
        </div>
      </div>
    </td>
    <td className="h-px w-72 whitespace-nowrap">
      <div className="px-6 py-3">
        <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">Accountant</span>
        <span className="block text-sm text-gray-500">Finance</span>
      </div>
    </td>
    <td className="h-px w-px whitespace-nowrap">
      <div className="px-6 py-3">
        <span className="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
          Active
        </span>
      </div>
    </td>
    <td className="h-px w-px whitespace-nowrap">
      <div className="px-6 py-3">
        <div className="flex items-center gap-x-3">
          <span className="text-xs text-gray-500">2/5</span>
          <div className="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
            <div className="flex flex-col justify-center overflow-hidden bg-gray-800 dark:bg-gray-200" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      </div>
    </td>
    <td className="h-px w-px whitespace-nowrap">
      <div className="px-6 py-3">
        <span className="text-sm text-gray-500">11 Dec, 18:51</span>
      </div>
    </td>
    <td className="h-px w-px whitespace-nowrap">
      <div className="px-6 py-1.5">
        <a className="inline-flex items-center gap-x-1.5 text-sm text-blue-600 decoration-2 hover:underline font-medium" href="#">
          Edit
        </a>
      </div>
    </td>
  </tr>
</tbody>
</table> */}