import React, { useState } from 'react';

const BASE_URL = "http://localhost:8000/querier/search-job-listing/";

const customEncodeURIComponent = (str) => {
    return encodeURIComponent(str)
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/&/g, '%26')
        .replace(/\|/g, '%7C')
        .replace(/~/g, '%7E');
};   

function CustomQueryBuilder({ onSearch }) {
    const [queryComponents, setQueryComponents] = useState([]);
    const [query, setQuery] = useState('');

    const fields = [
        { name: 'job_title', label: 'Job Title' },
        { name: 'company_name', label: 'Company Name' },
        { name: 'listing_details', label: 'Listing Details' },
        { name: 'description', label: 'Job Description' },
        { name: 'location', label: 'Location' },
        
    ];

    const operators = ['AND', 'OR', 'NOT', '(', ')']; 

    const addFieldToQuery = (field) => {
        setQueryComponents([...queryComponents, { type: 'field', value: field.label, queryName: field.name }]);
    };

    const addOperatorToQuery = (operator) => {
        setQueryComponents([...queryComponents, { type: 'operator', value: operator }]);
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
                    <button key={field.name} onClick={() => addFieldToQuery(field)}>
                        {field.label}
                    </button>
                ))}
            </div>
            <div>
                Operators:
                {operators.map(op => (
                    <button key={op} onClick={() => addOperatorToQuery(op)}>
                        {op}
                    </button>
                ))}
            </div>
            <div>
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
            <button onClick={generateQuery}>Search</button>
            <button onClick={undoLastAction}>Undo</button>
            <button onClick={clearAll}>Clear</button>
        </div>
    );
}

const SearchForm = () => {
    const handleSearch = (query) => {

        const encodedQuery = customEncodeURIComponent(query);
        const url = `${BASE_URL}?q=${encodedQuery}`;
        console.log(url);

    };

    return <CustomQueryBuilder onSearch={handleSearch} />;
}

export default SearchForm;
