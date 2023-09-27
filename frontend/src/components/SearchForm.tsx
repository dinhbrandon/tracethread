import { useState } from 'react';

const BASE_URL = "http://localhost:8000/querier/search-job-listing/";

const customEncodeURIComponent = (str: string): string => {
    return encodeURIComponent(str)
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/&/g, '%26')
        .replace(/\|/g, '%7C')
        .replace(/~/g, '%7E');
};   

    enum Operator {
        And = 'AND',
        Or = 'OR',
        Not = 'NOT',
        OpenParenthesis = '(',
        CloseParenthesis = ')'
    }

    // Type definitions
    interface QueryComponent {
        type: 'field' | 'operator';
        value: Operator | string;
        queryName?: string;
        inputValue?: string;
    }

    interface CustomQueryBuilderProps {
        onSearch: (query: string) => void;
    }

    function CustomQueryBuilder({ onSearch }: CustomQueryBuilderProps) {
        const [queryComponents, setQueryComponents] = useState<QueryComponent[]>([]);
        const [query, setQuery] = useState<string>('');

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
                <h2>QUERY</h2>
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
        </div>
    );
}

// type SearchFormProps = {
//     onSearch: (url: string) => void;
//   }
const SearchForm = () => {
    const handleSearch = (query: string) => {

        const encodedQuery = customEncodeURIComponent(query);
        const url = `${BASE_URL}?q=${encodedQuery}`;
        console.log(url);

    };

    return <CustomQueryBuilder onSearch={handleSearch} />;
}

export default SearchForm;
