import { useState } from 'react';
import { QueryComponent, CustomQueryBuilderProps, Operator, Line, LogicCardProps, InputType, SearchCard } from '../types/types';
import { useToken } from '../hooks/useToken';
import SavedParameters from './SavedParameters';


const BASE_URL = "http://localhost:8000/querier/search-job-listing/";

const customEncodeURIComponent = (str: string): string => {
    return encodeURIComponent(str)
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/&/g, '%26')
        .replace(/\|/g, '%7C')
        .replace(/~/g, '%7E');
};   

    function LogicCard({ onAdd, onRemove, fields, onLineChange }: LogicCardProps) { 
        const [lines, setLines] = useState<Line[]>([{ field: '', operator: '', value: '' }]);
        const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);


        const removeLine = (index: number) => {
            const newLines = [...lines];
            newLines.splice(index, 1);
            setLines(newLines);
            onLineChange(newLines, null);  
        };
        
        const addLine = () => {
            const newLines = [...lines, { field: '', operator: '', value: '' }];
            setLines(newLines);
            onLineChange(newLines, null);  
        };
        

        const handleInputChange = (index: number, type: InputType, value: string) => {
            const newLines = [...lines];
            newLines[index][type] = value;
            setLines(newLines);
            onLineChange(newLines, null); 
        };

        return (
            <div className="border p-4 m-2">
                {lines.map((line, index) => (
                    <div key={index}>
                        <div className="flex items-center mb-2">
                            <select 
                                className="mr-2" 
                                value={line.field}
                                onChange={(e) => handleInputChange(index, 'field', e.target.value)}
                            >
                                {fields.map(f => (
                                    <option key={f.name} value={f.name}>{f.label}</option>
                                ))}
                            </select>
                            <select 
                                className="mr-2"
                                value={line.operator}
                                onChange={(e) => handleInputChange(index, 'operator', e.target.value)}
                            >
                                <option value="contains">contains</option>
                                <option value="not-contains">does not contain</option>
                            </select>
                            <input 
                                type="text" 
                                className="mr-2" 
                                placeholder="Value" 
                                value={line.value}
                                onChange={(e) => handleInputChange(index, 'value', e.target.value)}
                            />
                            <button onClick={addLine}>+</button>
                            {index !== 0 && <button onClick={() => removeLine(index)}>-</button>}
                        </div>
                        {index !== lines.length - 1 && <div className="flex justify-between my-2">
                        <button 
                            style={{backgroundColor: selectedOperator === Operator.And ? 'green' : 'initial'}}
                            onClick={() => {
                                setSelectedOperator(Operator.And);
                                onLineChange(lines, Operator.And);
                            }}
                        >
                            AND
                        </button>
                        <button 
                            style={{backgroundColor: selectedOperator === Operator.Or ? 'green' : 'initial'}}
                            onClick={() => {
                                setSelectedOperator(Operator.Or);
                                onLineChange(lines, Operator.Or);
                            }}
                        >
                            OR
                        </button>

                        </div>}
                    </div>
                ))}
            </div>
        );
    }




    function CustomQueryBuilder({ onSearch, onRefresh }: CustomQueryBuilderProps) {
        const [queryComponents, setQueryComponents] = useState<QueryComponent[]>([]);
        const [query, setQuery] = useState<string>('');
        const [savedSearchName, setSavedSearchName] = useState<string>('');
        const token = useToken();
        const [cards, setCards] = useState<SearchCard[]>([{ lines: [] }]);
        const [selectedOperators, setSelectedOperators] = useState<(Operator | null)[]>([]);

        const handleOperatorSelection = (index: number, operator: Operator) => {
            const newOperators = [...selectedOperators];
            newOperators[index] = operator;
            setSelectedOperators(newOperators);
        };
        

        const addCard = () => {
            setCards([...cards, {}]);
        };
    
        const removeCard = (index) => {
            const newCards = [...cards];
            newCards.splice(index, 1);
            setCards(newCards);
        };

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
            // Generate a string representation for each card
            let cardQueries = cards.map(card => {
                // Convert the lines of each card into a sub-query
                let lineQueries = card.lines.map(line => `${line.field}='${line.value}'`);
                return `(${lineQueries.join(` ${card.selectedOperator} `)})`;
            });
        
            // Use the operatorBetweenCards property to determine logic between cards
            let queryString = cardQueries.join(' & '); // default to AND
            for (let i = 0; i < cards.length - 1; i++) {
                if (cards[i].operatorBetweenCards) {
                    queryString = queryString.replace(' & ', ` ${cards[i].operatorBetweenCards} `);
                }
            }
        
            console.log(queryString);
            setQuery(queryString);
            onSearch(queryString);
        };
        

        const handleLineChange = (newLines: Line[]) => {
            
            const newComponents = newLines.map(line => ({
                type: 'field',
                value: line.field, 
                queryName: line.field,
                inputValue: line.value
            }));
            setQueryComponents(newComponents);
        };
    

        return (
            <div>
                {cards.map((card, index) => (
                    <div key={index}>
                        <LogicCard 
                            onAdd={addCard} 
                            onRemove={() => removeCard(index)} 
                            fields={fields}
                            onLineChange={handleLineChange}  // pass the handler down
                        />
                        {index !== cards.length - 1 && 
                        <div className="flex justify-between my-2">
                            <button 
                                style={{backgroundColor: selectedOperators[index] === Operator.And ? 'green' : 'initial'}}
                                onClick={() => handleOperatorSelection(index, Operator.And)}
                            >
                                AND
                            </button>
                            <button 
                                style={{backgroundColor: selectedOperators[index] === Operator.Or ? 'green' : 'initial'}}
                                onClick={() => handleOperatorSelection(index, Operator.Or)}
                            >
                                OR
                            </button>

                        </div>}

                        <div className='mt-2'>
                            Commands:
                            <button className='ml-2 mr-2 bg-gray-500' onClick={generateQuery}>Search</button>
                            <button className='ml-2 mr-2 bg-gray-500' onClick={undoLastAction}>Undo</button>
                            <button className='ml-2 mr-2 bg-gray-500' onClick={clearAll}>Clear</button>
                        </div>
                    </div>
                    
                ))}
                <button onClick={addCard}>+</button>
            </div>
        );
    }


interface SearchFormProps {
    onSearch: (query: string) => void;
    refreshKey: boolean;  // Add this line
}


const SearchForm = ({ onSearch, onRefresh, refreshKey }: SearchFormProps & { onRefresh: () => void }) => {
    const handleSearch = (query: string) => {
        const encodedQuery = customEncodeURIComponent(query);
        const url = `${BASE_URL}?q=${encodedQuery}`;
        onSearch(url);
    };

    return (
        <div>
            <CustomQueryBuilder onSearch={handleSearch} onRefresh={onRefresh} />
            {/* <SavedParameters onSearch={handleSearch} refreshKey={refreshKey} />  */}
        </div>
    );
}



export default SearchForm;
