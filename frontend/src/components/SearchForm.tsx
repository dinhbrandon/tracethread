import { useState } from 'react';
import { QueryComponent, CustomQueryBuilderProps, Operator } from '../types/types';
import { useToken } from '../hooks/useToken';


const BASE_URL = "http://localhost:8000/querier/search-job-listing/";

const customEncodeURIComponent = (str: string): string => {
    return encodeURIComponent(str)
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/&/g, '%26')
        .replace(/\|/g, '%7C')
        .replace(/~/g, '%7E');
};   

    function CustomQueryBuilder({ onSearch, onRefresh }: CustomQueryBuilderProps) {
        const [queryComponents, setQueryComponents] = useState<QueryComponent[]>([]);
        const [query, setQuery] = useState<string>('');
        const [savedSearchName, setSavedSearchName] = useState<string>('');
        const token = useToken();

        async function saveParameters(name: string, encodedQuery: string) {
            const url = `http://localhost:8000/querier/saved-search-parameters`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    query: encodedQuery 
                })
            });
            if (response.ok) {
                onRefresh();
            }

        }

        const handleSaveSearch = () => {
            saveParameters(savedSearchName, query);
        }
        const fields = [
            { name: 'job_title', label: 'Job Title' },
            { name: 'company_name', label: 'Company Name' },
            { name: 'listing_details', label: 'Listing Details' },
            { name: 'description', label: 'Job Description' },
            { name: 'location', label: 'Location' },
            
        ];

        const operators = [Operator.And, Operator.Or, Operator.Not, Operator.OpenParenthesis, Operator.CloseParenthesis]; 

        const addFieldToQuery = (field: { name: string, label: string }) => {
            setQueryComponents([...queryComponents, { type: 'field', value: field.label, queryName: field.name }]);
        };

        const addOperatorToQuery = (operator: Operator) => {
            const newComponent: QueryComponent = {
                type: 'operator',
                value: operator
            };
            setQueryComponents(prevComponents => [...prevComponents, newComponent]);
        };

        const undoLastAction = () => {
            const updatedComponents = [...queryComponents];
            updatedComponents.pop();
            setQueryComponents(updatedComponents);
        }

        const clearAll = () => {
            setQueryComponents([]);
        }

        const generateQuery = () => {
            let queryString = queryComponents.map(comp => {
                if (comp.type === 'field') {
                    return `${comp.queryName}='${comp.inputValue || 'value'}'`; 
                    // Replace 'value' with actual user input if available
                }
                if (comp.type === 'operator') {
                    switch (comp.value) {
                        case 'AND':
                            return '&';
                        case 'OR':
                            return '|';
                        case 'NOT':
                            return '~';
                        default:
                            return comp.value;
                    }
                }
                return comp.value;
            }).join(' ');
        
            setQuery(queryString);
            onSearch(queryString);
        };
    

    return (
        <div>
            <div>
                Fields:
                {fields.map(field => (
                    <button className='ml-2 mt-2 mr-2 bg-gray-500' key={field.name} onClick={() => addFieldToQuery(field)}>
                        [{field.label}]
                    </button>
                ))}
            </div>
            <div>
                Operators:
                {operators.map(op => (
                    <button className='ml-2 mt-2 mr-2 bg-gray-500' key={op} onClick={() => addOperatorToQuery(op)}>
                        [ {op} ]
                    </button>
                ))}
            </div>
            <div className='mt-2'>
                Commands:
                <button className='ml-2 mr-2 bg-gray-500' onClick={generateQuery}>Search</button>
                <button className='ml-2 mr-2 bg-gray-500' onClick={undoLastAction}>Undo</button>
                <button className='ml-2 mr-2 bg-gray-500' onClick={clearAll}>Clear</button>
            </div>
            <div className='mt-2'>
                <h2>QUERY BUILDER - </h2>
                {queryComponents.map((comp, index) => (
                    <span key={index}>
                        {comp.type === 'field' ? (
                            <>
                                {comp.value}:
                                <input
                                    type="text"
                                    onChange={(e) => {
                                        const updatedComponents = [...queryComponents];
                                        updatedComponents[index].inputValue = e.target.value;
                                        setQueryComponents(updatedComponents);
                                    }}
                                />
                            </>
                        ) : (
                            comp.value
                        )}
                        {' '}
                    </span>
                ))}
            </div>
            <div className="mt-2">
                <label>Save Search As: </label>
                <input 
                    type="text" 
                    value={savedSearchName} 
                    onChange={(e) => setSavedSearchName(e.target.value)} 
                    placeholder="Name your search" 
                />
                <button className='ml-2 mr-2 bg-gray-500' onClick={() => handleSaveSearch()}>Save</button>
            </div>
        </div>
    );
}

interface SearchFormProps {
    onSearch: (query: string) => void;
}

const SearchForm = ({ onSearch, onRefresh }: SearchFormProps & { onRefresh: () => void }) => {
    const handleSearch = (query: string) => {
        const encodedQuery = customEncodeURIComponent(query);
        const url = `${BASE_URL}?q=${encodedQuery}`;
        onSearch(url);
    };

    return <CustomQueryBuilder onSearch={handleSearch} onRefresh={onRefresh} />;
}


export default SearchForm;
