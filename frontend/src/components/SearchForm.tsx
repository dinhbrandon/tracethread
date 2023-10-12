import { useState, useEffect } from 'react';
import { QueryComponent, CustomQueryBuilderProps, Operator, SearchFormProps, Condition, LogicCard } from '../types/types';
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

    function CustomQueryBuilder({ onSearch, onRefresh, savedParameters }: CustomQueryBuilderProps) {
        const [queryComponents, setQueryComponents] = useState<QueryComponent[]>([]);
        const [query, setQuery] = useState<string>('');
        const [savedSearchName, setSavedSearchName] = useState<string>('');
        const [selectedSavedParameter, setSelectedSavedParameter] = useState('');

        const fields = [
            { name: 'job_title', label: 'Job Title' },
            { name: 'company_name', label: 'Company Name' },
            { name: 'listing_details', label: 'Listing Details' },
            { name: 'description', label: 'Job Description' },
            { name: 'location', label: 'Location' },
            
        ];

        const [cards, setCards] = useState<LogicCard[]>([
            {
                conditions: [
                    {
                        field: fields[0], 
                        operator: 'contains', 
                        value: ''
                    }
                ],
                logic: 'AND'
            }
        ]);
        

        // async function saveParameters(name: string, encodedQuery: string) {
        //     const url = `http://localhost:8000/querier/saved-search-parameters`;
        //     const response = await fetch(url, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Token ${token}`
        //         },
        //         body: JSON.stringify({
        //             name: name,
        //             query: encodedQuery 
        //         })
        //     });
        //     if (response.ok) {
        //         onRefresh();
        //     }

        // }

        const handleSaveSearch = () => {
            saveParameters(savedSearchName, query);
        }

        const addCard = () => {
            const newCard: LogicCard = {
                conditions: [
                    {
                        field: fields[0], 
                        operator: 'contains', 
                        value: ''
                    }
                ],
                logic: 'AND'
            };
            setCards(prevCards => [...prevCards, newCard]);
        };
        
    
        const removeCard = (index) => {
            const newCards = [...cards];
            newCards.splice(index, 1);
            setCards(newCards);
        };
    
        const addConditionToCard = (cardIndex) => {
            const newCondition:  Condition = {
                field: fields[0], 
                operator: 'contains', 
                value: ''
            };
            const newCards = [...cards];
            newCards[cardIndex].conditions.push(newCondition);
            setCards(newCards);
        };
    
        const removeConditionFromCard = (cardIndex: number, conditionIndex: number) => {
            const newCards = [...cards];
            newCards[cardIndex].conditions.splice(conditionIndex, 1);
            setCards(newCards);
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
            let cardQueries = cards.map((card, cardIdx) => {
                // Construct the conditions inside each card
                let cardQuery = card.conditions.map((condition, conditionIdx) => {
                    const baseCondition = condition.operator === 'does not contain' 
                        ? `~${condition.field.name}='${condition.value}'`
                        : `${condition.field.name}='${condition.value}'`;
            
                    // If this condition has a subsequent condition, add the logic operator
                    if (conditionIdx < card.conditions.length - 1) {
                        const logicSymbol = condition.logic === 'OR' ? '|' : '&';
                        return baseCondition + ` ${logicSymbol} `;
                    }
                    return baseCondition;
                }).join('');
        
                // Wrap each card's query in parentheses
                return '(' + cardQuery + ')';
            });
        
            // Join card queries using the cardLogic property
            let queryString = cardQueries.reduce((acc, curr, idx) => {
                if (idx === 0) return curr; // If it's the first card, just return its query
                const joinLogic = cards[idx - 1].cardLogic || 'AND'; // Use the previous card's cardLogic
                return acc + (joinLogic === 'AND' ? ' & ' : ' | ') + curr;
            }, '');
        
            // Update the local state and propagate the generated query
            console.log(queryString);
            setQuery(queryString);
            onSearch(queryString);
        };
        
        
        
        
        

        return (
            <div>
                <div className="mt-2">
                    <label>Save Search As: </label>
                    <input 
                        type="text" 
                        value={savedSearchName} 
                        onChange={(e) => setSavedSearchName(e.target.value)} 
                        placeholder="Name your search" 
                    />
                    <button className='ml-2 mr-2 bg-gray-500' onClick={handleSaveSearch}>Save</button>
                </div>
                {cards.map((card, cardIndex) => (
                    <div key={cardIndex} className="border p-4 m-2">
                        {card.conditions.map((condition, conditionIndex) => (
                            <div key={conditionIndex}>
                                <div className="flex items-center mb-2">
                                    <select 
                                        className="mr-2" 
                                        value={condition.field.name}  // Using 'name' for the value makes more sense
                                        onChange={(e) => {
                                            const selectedField = fields.find(f => f.name === e.target.value);
                                            if (selectedField) {
                                                const newCards = [...cards];
                                                newCards[cardIndex].conditions[conditionIndex].field = selectedField;
                                                setCards(newCards);
                                            }
                                        }}                                        
                                    >
                                        {fields.map(f => (
                                            <option key={f.name} value={f.name}>{f.label}</option>
                                        ))}
                                    </select>

                                    <select 
                                        className="mr-2"
                                        value={condition.operator}
                                        onChange={(e) => {
                                            const newCards = [...cards];
                                            newCards[cardIndex].conditions[conditionIndex].operator = e.target.value as 'contains' | 'does not contain';
                                            setCards(newCards);
                                        }}
                                    >
                                        <option value="contains">contains</option>
                                        <option value="does not contain">does not contain</option>
                                    </select>
                                    <input 
                                        type="text" 
                                        className="mr-2" 
                                        placeholder="Value" 
                                        value={condition.value}
                                        onChange={(e) => {
                                            const newCards = [...cards];
                                            newCards[cardIndex].conditions[conditionIndex].value = e.target.value;
                                            setCards(newCards);
                                        }}
                                    />
                                    <button onClick={() => addConditionToCard(cardIndex)}>+</button>
                                    {conditionIndex !== 0 && <button onClick={() => removeConditionFromCard(cardIndex, conditionIndex)}>-</button>}
                                </div>
                                {conditionIndex !== card.conditions.length - 1 && (
                                    <div className="flex justify-between my-2">
                                        <button 
                                            style={{backgroundColor: condition.logic === 'AND' ? 'green' : 'initial'}}
                                            onClick={() => {
                                                const newCards = [...cards];
                                                newCards[cardIndex].conditions[conditionIndex].logic = 'AND';
                                                setCards(newCards);
                                            }}
                                        >
                                            AND
                                        </button>
                                        <button 
                                            style={{backgroundColor: condition.logic === 'OR' ? 'green' : 'initial'}}
                                            onClick={() => {
                                                const newCards = [...cards];
                                                newCards[cardIndex].conditions[conditionIndex].logic = 'OR';
                                                setCards(newCards);
                                            }}
                                        >
                                            OR
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button className='ml-2 mr-2 bg-gray-500' onClick={() => removeCard(cardIndex)}>Remove Card</button>
                        <select 
                            value={card.cardLogic || 'AND'}
                            onChange={(e) => {
                                const newCards = [...cards];
                                newCards[cardIndex].cardLogic = e.target.value as 'AND' | 'OR';
                                setCards(newCards);
                            }}
                        >
                            <option value="AND">AND</option>
                            <option value="OR">OR</option>
                        </select>
                        {/* Implement logic to select from saved parameters */}
                        <select 
                            value={selectedSavedParameter}
                            onChange={(e) => setSelectedSavedParameter(e.target.value)}
                        >
                            <option value="" disabled>Select a saved parameter</option>
                            {savedParameters.map((param) => (
                                <option key={param.id} value={param.query}>
                                    {param.name}
                                </option>
                            ))}
                        </select>

                        

                    </div>
                ))}
                <button onClick={addCard}>+ Add Card</button>
                <div className='mt-2'>
                    Commands:
                    <button className='ml-2 mr-2 bg-gray-500' onClick={generateQuery}>Search</button>
                    <button className='ml-2 mr-2 bg-gray-500' onClick={undoLastAction}>Undo</button>
                    <button className='ml-2 mr-2 bg-gray-500' onClick={clearAll}>Clear</button>
                </div>
            </div>
        );
        

}




const SearchForm = ({ onSearch, onRefresh, refreshKey }: SearchFormProps & { onRefresh: () => void }) => {
    const [savedParameters, setSavedParameters] = useState<SavedSearchParameters[]>([]);
    const token = useToken();
    const handleSearch = (query: string) => {
        const encodedQuery = customEncodeURIComponent(query);
        const url = `${BASE_URL}?q=${encodedQuery}`;
        onSearch(url);
    };

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

    return (
        <div>
            <CustomQueryBuilder onSearch={handleSearch} onRefresh={onRefresh} savedParameters={savedParameters} />
            <SavedParameters onSearch={handleSearch} refreshKey={refreshKey} savedParameters={savedParameters} />
        </div>
    );
}




export default SearchForm;
