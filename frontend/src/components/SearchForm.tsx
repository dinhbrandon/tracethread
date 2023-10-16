import { useState, useEffect } from 'react';
import { CustomQueryBuilderProps, SearchFormProps, Condition, LogicCard } from '../types/types';
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
        const [query, setQuery] = useState<string>('');
        const [savedSearchName, setSavedSearchName] = useState<string>('');
        const [selectedSavedParameter, setSelectedSavedParameter] = useState('');
        const token = useToken();
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
                        field: { name: '', label: '' },
                        operator: 'contains',
                        value: '',
                    },
                ],
                logic: 'AND',
                cardLogic: 'AND',
                selectedSavedParameter: '',
                showSavedSearch: false, // Add this property to fix the error
            },
        ]);

        // THE FOLLOWING ARE FOR ADDING AND REMOVING CARDS, WHICH ARE GROUPINGS OF LOGIC LINES
        const addCard = () => {
            const newCard: LogicCard = {
                conditions: [
                    {
                        field: { name: '', label: '' }, // Setting field to an empty object to ensure the placeholder is selected
                        operator: 'contains', 
                        value: ''
                    }
                ],
                logic: 'AND',
                showSavedSearch: false
            };
            setCards(prevCards => [...prevCards, newCard]);
        };        
    
        const removeCard = (index) => {
            const newCards = [...cards];
            newCards.splice(index, 1);
            setCards(newCards);
        };

    
        // THE FOLLOWING ARE FOR ADDING AND REMOVING LINES OF LOGIC WITHIN EACH CARD
        const addConditionToCard = (cardIndex) => {
            const newCondition:  Condition = {
                field: null, 
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


        // THE FOLLOWING FUNCTION TOGGLES THE DISPLAY OF SAVED SEARCHES
        const handleToggleSavedSearch = (cardIndex: number) => {
            const newCards = [...cards];
            newCards[cardIndex].showSavedSearch = !newCards[cardIndex].showSavedSearch;
        
            if (!newCards[cardIndex].showSavedSearch) {
                // Reset the selected saved parameter and the logical operator to their initial states
                newCards[cardIndex].selectedSavedParameter = '';
                newCards[cardIndex].savedSearch = '';
                newCards[cardIndex].logicBeforeSavedParam = 'AND'; // or whatever your initial value is
            }
        
            setCards(newCards);
        };
        

        // THE FOLLOWING ARE FOR GENERATING THE SEARCH QUERY BASED ON THE CARDS AND LINES OF LOGIC
        const generateQuery = () => {
            let cardQueries = cards.map((card, cardIdx) => {
                
                let cardQuery = card.conditions
                .filter(condition => condition.field && condition.field.name) // Filter out conditions without a field selected
                .map((condition, conditionIdx) => {
                    // Ensure that the field is present before accessing its name
                    const fieldName = condition.field ? condition.field.name : '';
                    
                    const baseCondition = condition.operator === 'does not contain' 
                        ? `~${fieldName}='${condition.value}'` 
                        : `${fieldName}='${condition.value}'`;
                    
                    // Add logic symbols between conditions
                    if (conditionIdx < card.conditions.length - 1) {
                        const logicSymbol = condition.logic === 'OR' ? '|' : '&';
                        return baseCondition + ` ${logicSymbol} `;
                    }
                    return baseCondition;
                })
                .join(''); // Join all conditions to form the query for the card
            

                
                // Check if the card has a saved search
                if (card.savedSearch) {
                    const selectedParam = savedParameters.find(p => p.id.toString() === card.savedSearch);
                    if (selectedParam) {
                        // Define logic symbols based on logicBeforeSavedParam
                        const logicSymbol = card.logicBeforeSavedParam === 'OR' ? '|' 
                                            : card.logicBeforeSavedParam === 'AND' ? '&' 
                                            : card.logicBeforeSavedParam === 'ORNOT' ? '| ~'
                                            : card.logicBeforeSavedParam === 'ANDNOT' ? '& ~' 
                                            : '&'; // Default to 'AND' if something goes wrong
                                            
                        // Only prepend the logic symbol if there is a preceding condition or logic
                        const prefix = cardQuery ? ` ${logicSymbol} ` : '';
                        cardQuery = `${cardQuery}${prefix}(${selectedParam.query})`;
                    }
                }


                if (selectedSavedParameter) {
                    const selectedParam = savedParameters.find(p => p.id.toString() === selectedSavedParameter);
                    if (selectedParam) {
                        cardQuery = `${cardQuery} & (${selectedParam.query})`;
                    }
                }
                
                if (cardQuery){
                    return '(' + cardQuery + ')';
                }
                else {
                    return '';
                }
            });
        

            let queryString = cardQueries.reduce((acc, curr, idx) => {
                if (idx === 0) return curr;
                const joinLogic = cards[idx].cardLogic || 'AND';
                let logicSymbol = '';
                switch (joinLogic) {
                    case 'AND':
                        logicSymbol = ' & ';
                        break;
                    case 'OR':
                        logicSymbol = ' | ';
                        break;
                    case 'ANDNOT':
                        logicSymbol = ' & ~ ';
                        break;
                    case 'ORNOT':
                        logicSymbol = ' | ~ ';
                        break;
                    default:
                        logicSymbol = ' & ';
                        break;
                }
                return acc + logicSymbol + curr;
            }, '');
            
            

            console.log(queryString);
            setQuery(queryString);
            onSearch(queryString);
        };



        // FUNCTION FOR SAVING SEARCH QUERIES
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

        // BELOW IS THE JSX (UI DISPLAY) FOR THE CUSTOM QUERY BUILDER
        
        return (
            <div>
                <div className="mt-2">
                    <label>Save search: </label>
                    <input 
                        type="text" 
                        value={savedSearchName} 
                        onChange={(e) => setSavedSearchName(e.target.value)} 
                        placeholder="Name your search" 
                    />
                    <button className='ml-2 mr-2 bg-gray-500' onClick={handleSaveSearch}>Save</button>
                </div>
                <div className='mt-4'>
                    <button className='bg-gray-500'>
                        <a href="http://localhost:3000/saved">View all saved searches</a>
                    </button>
                </div>
                {cards.map((card, cardIndex) => (
                    <div key={cardIndex} className="border p-4 m-2">

                {cardIndex !== 0 && (
                            <div className="mb-3">
                                <label>Logical Operator: </label>
                                <select 
                                    value={card.cardLogic} 
                                    onChange={(e) => {
                                        const newCards = [...cards];
                                        newCards[cardIndex].cardLogic = e.target.value as 'AND' | 'OR' | 'ANDNOT' | 'ORNOT';
                                        setCards(newCards);
                                    }}
                                >
                                    <option value="AND">AND</option>
                                    <option value="OR">OR</option>
                                    <option value="ANDNOT">AND NOT</option>
                                    <option value="ORNOT">OR NOT</option>
                                </select>
                            </div>
                        )}


                        {card.conditions.map((condition, conditionIndex) => (
                            <div key={conditionIndex}>
                                <div className="flex items-center mb-2">
                                <button onClick={() => addConditionToCard(cardIndex)}>+</button>
                                {conditionIndex !== 0 && 
                                <button onClick={() => removeConditionFromCard(cardIndex, conditionIndex)}>-</button>
                                }
                                <select 
                                    className="ml-2 mr-2" 
                                    value={condition.field ? condition.field.name : ''} 
                                    onChange={(e) => {
                                        const selectedField = fields.find(f => f.name === e.target.value);
                                        const newCards = [...cards];
                                        if (selectedField) {
                                            newCards[cardIndex].conditions[conditionIndex].field = selectedField;
                                            setCards(newCards);
                                        } else {
                                            newCards[cardIndex].conditions[conditionIndex].field = { name: '', label: ''}
                                        }
                                        setCards(newCards);
                                    }}                                        
                                >
                                    <option value="">Select Field</option>
                                    {fields.map(f => (
                                        <option key={f.name} value={f.name}>{f.label}</option>
                                    ))}
                                </select>

                                {condition?.field?.name && (
                                    <div>
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
                                )
                                }

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
                        
                        <div>
                            <button onClick={() => handleToggleSavedSearch(cardIndex)}>
                                {card.showSavedSearch ? "- Remove Saved Search" : "+ Add Saved Search"}
                            </button>
                        </div>
                        {card.showSavedSearch && (
                            <div>
                            {cards[cardIndex].conditions[0]?.field?.name && (
                                <select 
                                    value={card.logicBeforeSavedParam} 
                                    onChange={(e) => {
                                        const newCards = [...cards];
                                        newCards[cardIndex].logicBeforeSavedParam = e.target.value as 'AND' | 'OR' | 'ANDNOT' | 'ORNOT';
                                        setCards(newCards);
                                    }}
                                >
                                    <option value="AND">AND</option>
                                    <option value="OR">OR</option>
                                    <option value="ANDNOT">AND NOT</option>
                                    <option value="ORNOT">OR NOT</option>
                                </select>
                            )}

                                <select 
                                    value={card.savedSearch}
                                    onChange={(e) => {
                                        const newCards = [...cards];
                                        newCards[cardIndex].savedSearch = e.target.value;
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
                        )}

                        <div className='mt-5'>
                            <button className='ml-2 mr-2 bg-gray-500' onClick={() => removeCard(cardIndex)}>Remove Group</button>
                        </div>
                        

                    </div>
                    
                    
                ))}
                <button onClick={addCard}>+ Add Group</button>
                <div className='mt-2'>
                    <button className='ml-2 mr-2 bg-gray-500' onClick={generateQuery}>Search</button>
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
            <SavedParameters isVisible={false} onSearch={handleSearch} refreshKey={refreshKey} savedParameters={savedParameters} />
        </div>
    );
}


export default SearchForm;
