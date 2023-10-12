import { useEffect, useState } from 'react';
import { useToken } from '../hooks/useToken';
import { SavedSearchParameters, SavedParametersProps } from '../types/types';

const SavedParameters = ({ refreshKey, onSearch, savedParameters } : SavedParametersProps) => {

    const token = useToken();
    // const [savedParameters, setSavedParameters] = useState<SavedSearchParameters[]>([]);

    const handleSearchWithSavedQuery = (query: string) => {
        onSearch(query);
    }


    async function getParametersFromUser() {
        const url = `http://localhost:8000/querier/saved-search-parameters`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
        });
        if (response.ok){
            const fetchedData = await response.json();
            setSavedParameters(fetchedData);
        }

}

useEffect(() => {
    getParametersFromUser();   
}, [refreshKey]);

// return (
//     <div>
//         <h1 className="text-xl font-bold mb-4">Saved Searches</h1>
//         <ul>
//             {savedParameters.map((param) => (
//                 <li key={param.id} className="bg-black p-4 m-4 rounded shadow-md">
//                     <h2 className="text-lg font-semibold mb-2">Name: {param.name}</h2>
//                     <p className="text-gray-700">Query address: {param.query}</p>
//                     <button onClick={() => handleSearchWithSavedQuery(param.query)}>Search With This Query</button>
//                 </li>
//             ))}
//         </ul>
//     </div>
// );

}

export default SavedParameters;