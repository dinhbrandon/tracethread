import { useEffect, useState } from 'react';
import { useToken } from '../hooks/useToken';
import { SavedSearchParameters, SavedParametersProps } from '../types/types';
// @ts-ignore 
const SavedParameters: React.FC<SavedParametersProps> = ({ isVisible, onSearch, refreshKey, savedParameters }) => {
    if (!isVisible) {
        return null;
    }

    const [savedParametersState, setSavedParameters] = useState<SavedSearchParameters[]>([]);
    const token = useToken();

    const getParametersFromUser = async () => {
        const url = `http://localhost:8000/querier/saved-search-parameters`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
        });
        if (response.ok) {
            const fetchedData = await response.json();
            setSavedParameters(fetchedData);
        }
    }

    const deleteParameter = async (id: number) => {
        const url = `http://localhost:8000/querier/saved-search-parameters/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Token ${token}`
            },
        });

        if (response.ok) {
            setSavedParameters(prevParams => prevParams.filter(param => param.id !== id));
        } else {
            console.error('Failed to delete the parameter');
        }
    }

    useEffect(() => {
        getParametersFromUser();
    }, [refreshKey]);

    return (
        <div>
            <h1>Saved Searches</h1>
            <table>
                <thead>
                    <tr>
                        <th className='text-left'>Name</th>
                        <th className='text-left'>Query</th>
                    </tr>
                </thead>
                <tbody>
                    {savedParametersState.map((param) => (
                        <tr key={param.id}>
                            <td className='text-left'>{param.name}</td>
                            <td className='text-left'>{param.query}</td>
                            <td className='text-center'>
                                <button onClick={() => deleteParameter(param.id)}>Delete</button>
                                {/* <button onClick={() => onSearch(param.query)}>Use Query</button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SavedParameters;
