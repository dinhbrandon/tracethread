import { useEffect, useState } from 'react';
import { useToken } from '../hooks/useToken';
import { SavedSearchParameters, SavedParametersProps } from '../types/types';
const baseUrlApi = import.meta.env.VITE_API_BASE_URL;

// @ts-ignore 
const SavedParameters: React.FC<SavedParametersProps> = ({ isVisible, onSearch, refreshKey, savedParameters }) => {
    if (!isVisible) {
        return null;
    }

    const [savedParametersState, setSavedParameters] = useState<SavedSearchParameters[]>([]);
    const [deletingRows, setDeletingRows] = useState<number[]>([]);
    const token = useToken();

    const getParametersFromUser = async () => {
        const url = `${baseUrlApi}/querier/saved-search-parameters`;
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
        // Start the deletion animation by adding the row to the deletingRows array
        setDeletingRows(prev => [...prev, id]);
    
        // Wait for the animation to complete (in this case, 500ms)
        setTimeout(async () => {
            const url = `${baseUrlApi}/querier/saved-search-parameters/${id}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${token}`
                },
            });
    
            if (response.ok) {
                setSavedParameters(prevParams => prevParams.filter(param => param.id !== id));
                // Remove the row ID from the deletingRows array
                setDeletingRows(prev => prev.filter(rowId => rowId !== id));
            } else {
                console.error('Failed to delete the parameter');
            }
        }, 500);
    }
    

    useEffect(() => {
        getParametersFromUser();
    }, [refreshKey]);

    return (
        <div className="flex flex-col items-center h-screen">
            <div className="mt-10">
                <h1 className="font-bold text-xl text-gray-700 text-center mb-10">Saved filters</h1>
            </div>
            <div>
                {savedParametersState.length === 0 ? (
                    <p className="text-gray-500">You have no saved filters.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>

                                <th className='text-gray-700 text-left'>Name</th>
                                <th className='text-gray-700 text-left'>Query</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {savedParametersState.map((param) => (
                                <tr className={`border-b ${deletingRows.includes(param.id) ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`} key={param.id}>
                                    <td className='text-left pr-20 text-gray-500'>{param.name}</td>
                                    <td className='text-left pr-20 text-gray-500'>{param.query}</td>
                                    <td className='text-center'>
                                        <button onClick={() => deleteParameter(param.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
                                            <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                                        </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
    
}

export default SavedParameters;
