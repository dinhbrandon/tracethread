import { useState, useEffect } from 'react';
import { CustomQueryBuilderProps, SearchFormProps, Condition, LogicCard } from '../types/types';
import { useToken } from '../hooks/useToken';
import SavedParameters from './SavedParameters';
import { SavedSearchParameters } from '../types/types';

const baseUrl = import.meta.env.VITE_BASE_URL;
const baseUrlApi = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${baseUrlApi}/querier/search-job-listing/`;

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
        const [selectedSavedParameter, _setSelectedSavedParameter] = useState('');
        const [successMessage, setSuccessMessage] = useState('');
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
    
        const removeCard = (index: any) => {
            const newCards = [...cards];
            newCards.splice(index, 1);
            setCards(newCards);
        };

    
        // THE FOLLOWING ARE FOR ADDING AND REMOVING LINES OF LOGIC WITHIN EACH CARD
        const addConditionToCard = (cardIndex: any) => {
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
            let cardQueries = cards.map((card) => {
                
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
            
            

            // console.log(queryString);
            setQuery(queryString);
            onSearch(queryString);
        };



        // FUNCTION FOR SAVING SEARCH QUERIES
        async function saveParameters(name: string, encodedQuery: string) {
            const url = `${baseUrlApi}/querier/saved-search-parameters`;
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
            // Check if a name is provided for the saved search
            if (savedSearchName.trim() === "") {
                console.error("Please enter a name for the saved search.");
                return;
            }
        
            // Save the updated search query with the name
            saveParameters(savedSearchName, query);
        
            setSuccessMessage('Saved successfully!');
            setSavedSearchName('');
        };
        


        // BELOW IS THE JSX (UI DISPLAY) FOR THE CUSTOM QUERY BUILDER
        
        return (
            
            <div>
                {cards.map((card, cardIndex) => (
                    <div key={cardIndex} className="border p-4 m-2">

                {cardIndex !== 0 && (
                            <div className="mb-3">
                                <select
                                    className='text-sm text-gray-600'
                                    value={card.cardLogic} 
                                    onChange={(e) => {
                                        const newCards = [...cards];
                                        newCards[cardIndex].cardLogic = e.target.value as 'AND' | 'OR' | 'ANDNOT' | 'ORNOT';
                                        setCards(newCards);
                                    }}
                                >
                                    <option value="AND">and</option>
                                    <option value="OR">or</option>
                                    <option value="ANDNOT">and not</option>
                                    <option value="ORNOT">or not</option>
                                </select>
                            </div>
                        )}


                        {card.conditions.map((condition, conditionIndex) => (
                            <div key={conditionIndex}>
                                <div className="flex items-center mb-2">
                                <button className="text-sm text-gray-600" onClick={() => addConditionToCard(cardIndex)}>+</button>
                                {conditionIndex !== 0 && 
                                <button className="text-gray-600 ml-1 mr-1" onClick={() => removeConditionFromCard(cardIndex, conditionIndex)}>-</button>
                                }
                                <select 
                                    className="text-sm text-gray-600" 
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
                                    <option value="">Select job field</option>
                                    {fields.map(f => (
                                        <option key={f.name} value={f.name}>{f.label}</option>
                                    ))}
                                </select>

                                {condition?.field?.name && (
                                    <div>
                                    <select 
                                    className="text-sm text-gray-600 m-1"
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
                                    className="w-50 text-sm text-gray-600 text-left border-b border-gray-200" 
                                    placeholder=" value" 
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
                                            className='text-sm text-gray-600' 
                                            value={condition.logic}
                                            onChange={(e) => {
                                                const newCards = [...cards];
                                                newCards[cardIndex].conditions[conditionIndex].logic = e.target.value as 'AND' | 'OR';
                                                setCards(newCards);
                                            }}
                                        >
                                            <option value="AND">and</option>
                                            <option value="OR">or</option>
                                        </select>

                                    </div>
                                )}
                            </div>
                        ))}
                        
                        <div className='mt-5'>
                            <button className="text-sm text-gray-600" onClick={() => handleToggleSavedSearch(cardIndex)}>
                                {card.showSavedSearch ? "- Remove saved filter" : "+ Add saved filter"}
                            </button>
                        </div>
                        {card.showSavedSearch && (
                            <div className='flex items-center space-x-4'>
                            {cards[cardIndex].conditions[0]?.field?.name && (
                                <select
                                    className='text-sm text-gray-600'
                                    value={card.logicBeforeSavedParam} 
                                    onChange={(e) => {
                                        const newCards = [...cards];
                                        newCards[cardIndex].logicBeforeSavedParam = e.target.value as 'AND' | 'OR' | 'ANDNOT' | 'ORNOT';
                                        setCards(newCards);
                                    }}
                                >
                                    <option value="AND">and</option>
                                    <option value="OR">or</option>
                                    <option value="ANDNOT">and not</option>
                                    <option value="ORNOT">or not</option>
                                </select>
                            )}

                                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
                                <select
                                    className="text-sm text-gray-600" 
                                    value={card.savedSearch}
                                    onChange={(e) => {
                                        const newCards = [...cards];
                                        newCards[cardIndex].savedSearch = e.target.value;
                                        setCards(newCards);
                                    }}
                                >
                                    <option value="">Your saved filters...</option>
                                    {savedParameters.map((param) => (
                                        <option key={param.id} value={param.id}>
                                            {param.name}
                                        </option>
                                    ))}
                                </select>
                                </div>
                            </div>
                        )}

                        <div className='mt-5'>
                            <button className="py-1 px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm" onClick={() => removeCard(cardIndex)}>Remove Group</button>
                        </div>
                        

                    </div>
                    
                    
                ))}
                <button className='text-sm text-gray-600' onClick={addCard}>+ Add Group</button>
                <div className='mt-2'>
                    <button className="py-2 px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm" onClick={generateQuery}>Search</button>
                </div>






            
                {
                (query && query.trim() !== "") &&
                <div className="mt-2 text-sm text-gray-600">
                    <input
                        className='border-b border-gray-200 m-1'
                        type="text" 
                        value={savedSearchName} 
                        onChange={(e) => setSavedSearchName(e.target.value)} 
                        placeholder="Name"
                    />

                    <button className=" px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm" 
                            onClick={handleSaveSearch}>
                        Save filter
                    </button>
                    {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
                </div>
            }

                {/* <div className='mt-4'>
                    <button className="py-2 px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm">
                        <a href={`${baseUrl}/saved`}>View all saved searches</a>
                    </button>
                </div> */}
            </div>
        );
        

}




const SearchForm = ({ onSearch, onRefresh, refreshKey }: SearchFormProps & { onRefresh: () => void }) => {
    const [savedParameters, setSavedParameters] = useState<SavedSearchParameters[]>([]);
    const token = useToken();
    const handleSearch = (query: string) => {
        const encodedQuery = customEncodeURIComponent(query);
        
        const url = `${BASE_URL}?q=${encodedQuery}`;
        // console.log(url);
        onSearch(url);
    };

    async function getParametersFromUser() {
        const url = `${baseUrlApi}/querier/saved-search-parameters`;
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
