import { useState, useEffect } from 'react';
import { QueryComponent, CustomQueryBuilderProps, SearchFormProps, Condition, LogicCard } from '../types/types';
import { useToken } from '../hooks/useToken';
import SavedParameters from './SavedParameters';
import { SavedSearchParameters } from '../types/types';


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
        const [showOptionalField, setShowOptionalField] = useState<boolean[][]>([]);
        const token = useToken();

        const handleToggleOptionalField = (cardIndex: number) => {
            const newShowOptionalField = [...showOptionalField];
            newShowOptionalField[cardIndex] = newShowOptionalField[cardIndex] || [];
            newShowOptionalField[cardIndex].push(true);
            setShowOptionalField(newShowOptionalField);
        };

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
                        field: { name: '', label: '' }, // Setting field to an empty object
                        operator: 'contains', 
                        value: ''
                    }
                ],
                logic: 'AND',
                selectedSavedParameter: ''
            }
        ]);
        
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

        const addCard = () => {
            const newCard: LogicCard = {
                conditions: [
                    {
                        field: fields[0], 
                        operator: 'contains', 
                        value: ''
                    }
                ],
                logic: 'AND',
                selectedSavedParameters: []
            };
            setCards(prevCards => [...prevCards, newCard]);
        };

        const handleAddSavedSearch = (cardIndex: number) => {
            const newCards = [...cards];
            if (!newCards[cardIndex].selectedSavedParameters) {
                newCards[cardIndex].selectedSavedParameters = [];
            }
            newCards[cardIndex].selectedSavedParameters.push('');
            setCards(newCards);
        };

        const handleRemoveSavedSearch = (cardIndex: number, paramIndex: number) => {
            const newCards = [...cards];
            newCards[cardIndex].selectedSavedParameters.splice(paramIndex, 1);
            setCards(newCards);
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

                
                if (card.selectedSavedParameters) {
                    card.selectedSavedParameters.forEach((selectedParamId) => {
                        const selectedParam = savedParameters.find(p => p.id.toString() === selectedParamId);
                        if (selectedParam) {
                            cardQuery = `${cardQuery} & (${selectedParam.query})`;
                        }
                    });
                }
                
                // If a saved parameter is selected, incorporate its logic within each card
                if (selectedSavedParameter) {
                    const selectedParam = savedParameters.find(p => p.id.toString() === selectedSavedParameter);
                    if (selectedParam) {
                        cardQuery = `${cardQuery} & (${selectedParam.query})`;
                    }
                }
                
                // Wrap each modified card's query in parentheses
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
                                <button onClick={() => addConditionToCard(cardIndex)}>+</button>
                                {conditionIndex !== 0 && 
                                <button onClick={() => removeConditionFromCard(cardIndex, conditionIndex)}>-</button>
                                }
                                <select 
                                    className="ml-2 mr-2" 
                                    value={condition.field.name} 
                                    onChange={(e) => {
                                        const selectedField = fields.find(f => f.name === e.target.value);
                                        if (selectedField) {
                                            const newCards = [...cards];
                                            newCards[cardIndex].conditions[conditionIndex].field = selectedField;
                                            setCards(newCards);
                                        }
                                    }}                                        
                                >
                                    <option value="" disabled>Select Field</option>
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
                                </div>
                                {conditionIndex !== card.conditions.length - 1 && (
                                    <div className="flex justify-between my-2">
                                        <select 
                                            value={condition.logic}
                                            onChange={(e) => {
                                                const newCards = [...cards];
                                                newCards[cardIndex].conditions[conditionIndex].logic = e.target.value as 'AND' | 'OR';
                                                setCards(newCards);
                                            }}
                                        >
                                            <option value="AND">AND</option>
                                            <option value="OR">OR</option>
                                        </select>

                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {cards[cardIndex].selectedSavedParameters?.map((selectedParameter, index) => ( // Change here
                            <div className='ml-5' key={index}>
                            <button className='mr-2' onClick={() => handleRemoveSavedSearch(cardIndex, index)}>-</button>
                            <select 
                                value={selectedParameter}
                                onChange={(e) => {
                                    const newCards = [...cards];
                                    newCards[cardIndex].selectedSavedParameters[index] = e.target.value;
                                    setCards(newCards);
                                }}
                                >
                                <option value="">Your saved searches...</option>
                                {savedParameters.map((param) => (
                                    <option key={param.id} value={param.id}>
                                        {param.name}
                                    </option>
                                ))}
                                </select>
                            </div>
                        
                    ))}
                        <div>
                            <button onClick={() => handleAddSavedSearch(cardIndex)}>+ Add saved search</button>
                        </div>
                        <div className='mt-5'>
                            <button className='ml-2 mr-2 bg-gray-500' onClick={() => removeCard(cardIndex)}>Remove Card</button>
                        </div>
                        

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
