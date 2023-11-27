/* eslint-disable */
// tslint:disable

import { useState, useEffect, useRef } from 'react';
import { useToken } from '../hooks/useToken';
import { Card, Columns} from '../types/types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import JobNotebookSearch from './JobNotebookSearch';
import TimeSince from './TimeSince';
import { createCard } from '../utils/api.tsx';
import { useNavigate } from 'react-router-dom';
import { getColumns,getCards } from '../utils/api.tsx';

const baseUrlApi = import.meta.env.VITE_API_BASE_URL;

const JobNotebook: React.FC = () => {
  const token = useToken();
  const navigate = useNavigate();
  const [columns, setColumns] = useState<Columns[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState<boolean>(false);
  const [newCardData, setNewCardData] = useState<Card | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);


  // const [isNotesModalOpen, setIsNotesModalOpen] = useState<boolean>(false);
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [currentNotes, setCurrentNotes] = useState<string>("");
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);

  function handleNotesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCurrentNotes(e.target.value);
  }

  function startEditingNotes(cardId: number, notes: string) {
  setCurrentCardId(cardId);
  setCurrentNotes(cardId ? notes : '');
  setIsEditingNotes(true);
  }

  async function saveEditedNotes() {
    setIsEditingNotes(false);
    await saveNotes();
  }

  function cancelEditingNotes() {
    setIsEditingNotes(false);
    setCurrentCardId(null);
    setCurrentNotes('');
  }
  

  const onDragEnd = async (result: any, columnsArray: Columns[], setColumns: React.Dispatch<React.SetStateAction<Columns[]>>) => {

    if (!result.destination) return;
    const { source, destination } = result;
    const columns = columnsArray.reduce((acc: any, column: any) => {
        acc[column.id] = {
            ...column,
            items: cards.filter(card => card.column === column.id)
        };
        return acc;
    }, {});

    const sourceColumn = columns[source.droppableId];

    const destColumn = columns[destination.droppableId];
    if (!sourceColumn || !sourceColumn.items || !destColumn || !destColumn.items) {
        console.error("Invalid column structure or missing items array");
        return;
    }
    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceColumn.items.splice(source.index, 1);
      removed.timestamp = new Date().toISOString();
      destColumn.items.splice(destination.index, 0, removed);
      await editCardColumn(removed.id, parseInt(destination.droppableId), destination.index, removed.timestamp);
  } else {
      const [removed] = sourceColumn.items.splice(source.index, 1);
      sourceColumn.items.splice(destination.index, 0, removed);
      await editCardColumn(removed.id, parseInt(source.droppableId), destination.index, removed.timestamp);
  }
  


    const updatedColumnsArray = Object.values(columns).map((column: any) => {
      const { items, ...rest } = column;
      return rest;
    }) as Columns[];

    setColumns(updatedColumnsArray);
    handleColumns();
  };

  function openCardModal(card: Card) {
    setSelectedCard(card);
    setIsModalOpen(true);
  }

  function closeCardModal() {
    setIsModalOpen(false);
    setSelectedCard(null);
  }

  async function handleColumns() {
    const result = await getColumns(token || '');
    setColumns(result.data);
  }

  async function handleCards() {
    const result = await getCards(token || '');
    setCards(result.data);
  }

  async function deleteCard(e: React.FormEvent, cardId: number, jobId?: number) {
    e.preventDefault();
  
    // URL to delete the card
    const cardUrl = `${baseUrlApi}/jobnotebook/delete-card/${cardId}`;
  
    // Deleting the card
    let response = await fetch(cardUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
    });
  
    // If card deletion is successful and jobId exists, proceed to delete the job
    if (response.ok && jobId) {
      // URL to delete the job
      const jobUrl = `${baseUrlApi}/querier/delete-jobsaved/${jobId}`;
  
      // Deleting the job
      response = await fetch(jobUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
      });
    }
  
    // If the final response is successful, refresh the UI
    if (response.ok) {
      closeCardModal();
      handleCards();
    } else {
      // Handle errors as needed
      console.error('An error occurred while deleting the card or job.');
    }
  }
  

  async function saveNotes() {
    if (currentCardId !== null) {
      const url = `${baseUrlApi}/jobnotebook/cards/${currentCardId}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify({ notes: currentNotes })
      });
      if(response.ok) {
        // closeEditModal();
        setSelectedCard(prevState => {
          if (prevState) {
            return {
              ...prevState,
              notes: currentNotes
            };
          }
          return prevState;
        });

        handleCards();
      } else {
        console.error('Failed to update notes.');
      }
    }
  }

  async function editCardColumn(cardId: number, newColumnId: number, newOrder: number, timestamp: Date) {
    const response = await fetch(`${baseUrlApi}/jobnotebook/cards/${cardId}/change-column`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
            new_column_id: newColumnId,
            order: newOrder,
            timestamp: timestamp
        })
    });
    // const requestBody = {
    //     new_column_id: newColumnId,
    //     order: newOrder,
    //     timestamp: timestamp
    // };
    if (response.ok) {
        handleCards();
    } else {
        console.error('Failed to update column.');
    }
}

  function isSearchTermPresent(card: Card) {

    //create an array of fields to search
    const fieldsToSearch = [
      card.job_title,
      card.company_name,
      card.location,
      card.description,
      card.notes,
      card.job_saved?.job_listing?.job_title,
      card.job_saved?.job_listing?.company_name,
      card.job_saved?.job_listing?.location,
      card.job_saved?.job_listing?.description,
    ];

    //use .some to check if any of the fields contain the search term
    return fieldsToSearch.some(field => 
      field && field.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const handleAddCardSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cardData = {
      job_saved: null,  // Set to null as per the working JSON
      notes: newCardData?.notes ?? '',
      column: newCardData?.column,
      order: newCardData?.order,
      timestamp: newCardData?.timestamp || new Date().toISOString(),
      job_title: newCardData?.job_title,
      company_name: newCardData?.company_name,
      company_logo: newCardData?.company_logo,  // Add the company_logo property to the Card type
      listing_details: newCardData?.listing_details ?? '',
      description: newCardData?.description ?? '',
      location: newCardData?.location,
      url: newCardData?.url ?? '',
    };

    if (token) {
        const result = await createCard(token, cardData);
        if (result.data) {
            setCards(prevCards => [...prevCards, result.data]);
            setIsAddCardModalOpen(false);
            setNewCardData(null);
        } else {
            console.error('Failed to create card:', result.error);
        }
    } else {
        console.error('Token is null');
    }
    // console.log('Submitting card data:', cardData);
};

function openNewCardModal(columnId: number) {
  setIsAddCardModalOpen(true);
  setNewCardData(prevState => ({
    ...prevState,
    id: prevState?.id || 0,  // Assuming 0 is a safe default value
    job_saved: undefined,  // Set to undefined to match Card type
    notes: prevState?.notes || '',
    column: columnId,
    order: prevState?.order || 0,  // Assuming 0 is a safe default value
    timestamp: prevState?.timestamp || new Date().toISOString(),
    job_title: prevState?.job_title,
    company_name: prevState?.company_name,
    company_logo: prevState?.company_logo,  // Assuming this is a part of prevState
    listing_details: prevState?.listing_details,
    description: prevState?.description,
    location: prevState?.location,
    url: prevState?.url
  }));
}




//runs when you update notes
useEffect(() => {
  setSelectedCard(prevState => {
    if (prevState) {
      return {
        ...prevState,
        id: prevState.id ?? 0, // set a default value of 0 if id is undefined
        notes: currentNotes
      };
    }
    return prevState;
  });
}, [currentNotes]);  // Runs whenever currentNotes changes



  useEffect(() => {
    handleColumns();
    handleCards();
  }, [])

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  //useEffect for closing the modal when clicked outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (isModalOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => {
      document.removeEventListener('mousedown', clickOutside);
    };
  }, [isModalOpen]);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  return (
    <div className="flex flex-col overflow-x-auto">
      <div className='flex justify-between'>
        <JobNotebookSearch searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        <button>
          <a className="m-1 py-2 px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm" href={`${baseUrl}/editcolumns`}>
          Edit Columns
          </a>
          </button>
      </div>
      {/* justify center to make card modal center*/}
      <div className='flex justify-center'>
        <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>

          {columns.map((column) => {
            //get number of cards in each column
            const cardsInColumn = cards.filter(card => card.column === column.id);
            // console.log(cardsInColumn)
            
            return(
            
            <Droppable droppableId={String(column.id)} key={column.id}>
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-black-200 p-4 rounded-lg border-2 md:min-w-80 md:w-80 md:min-h-[700px]"
                >
                  <div className="border-b">
                  <h2 className="text-xl font-bold text-center">{column.name}</h2>
                  <p className='text-center text-gray-700 text-sm'>{cardsInColumn.length} job{cardsInColumn.length === 1 ? '' : 's'} </p>
                  </div>
                  
                  <button className="m-1 py-2 px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm" onClick={() => openNewCardModal(column.id)}>
                      + Add Card
                  </button>


                  <div className="flex flex-col gap-1">
                
                {/* Filter cards by search term */}
                  {cardsInColumn
                    .filter(card => {
                      const isPresent = isSearchTermPresent(card);
                      // console.log(card);
                      return isPresent;
                    })
                    .map((filteredCard, index) => {
                      return (
                        
                        <Draggable key={filteredCard.id} draggableId={String(filteredCard.id)} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="relative bg-white p-2 rounded-lg border border-gray-300"
                            >
                              <button
                                  onClick={(e) => deleteCard(e, filteredCard.id, filteredCard.job_saved?.id)}
                                  className="absolute top-1 right-1 rounded-full text-white"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
                                      <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                                  </svg>
                              </button>
                              <div className='mt-2 flex flex-row items-center'> 
                                <div>
                                  <img className={ filteredCard.job_saved && filteredCard.job_saved.job_listing.company_logo ? 'inline-block min-h-[2.875rem] min-w-[2.875rem] w-[2.875rem] h-[2.875rem] rounded-full' : 'inline-block min-h-[2.875rem] min-w-[2.875rem] w-[2.875rem] h-[2.875rem] rounded-full bg-gray-400'}
                                  src={filteredCard.job_saved && filteredCard.job_saved.job_listing.company_logo ? filteredCard.job_saved.job_listing.company_logo : "https://img.icons8.com/?size=128&id=6LvtpL48Lmmx&format=png&color=FFFFFF"} alt="Company Logo" />
                                </div>
                                <div className='ml-2'>
                                  <p className='font-semibold truncate w-full max-w-[10rem]'>{filteredCard.job_saved ? filteredCard.job_saved.job_listing.job_title : filteredCard.job_title}</p>
                                  <p className="text-gray-600 truncate w-full max-w-[10rem]">{filteredCard.job_saved ? filteredCard.job_saved.job_listing.company_name : filteredCard.company_name}</p>
                                </div>
                              </div>
                      
                              <div className='mt-3'>
                                <p className="text-xs text-gray-600">Added to this column <TimeSince date={filteredCard.timestamp} /></p>               
                              </div>
                              <div className="absolute bottom-2 right-2">
                                <button onClick={() => openCardModal(filteredCard)} className="bg-gray-300 text-white w-4 h-4 rounded-full flex items-center justify-center">
                                  +
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
            )
})}

          {/* Modal for editing notes on a card */}
          {isModalOpen && selectedCard && (
  <div ref={modalRef} className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-50 flex items-center justify-center">
    <div className="relative md:max-w-[1000px] md:max-h-[800px] overflow-auto bg-white p-4 flex flex-col rounded-lg shadow-md">
      
      <div className='mb-4'>
      <button onClick={closeCardModal} className="absolute top-0 right-0 m-4 py-1 px-3 rounded-md border text-gray-700 font-medium bg-white align-middle hover:bg-gray-50 transition-all text-sm">
        Close
      </button>
      </div>
      
      <div className='flex flex-row items-center p-5 mb-5'>
      <img className={ selectedCard.job_saved && selectedCard.job_saved.job_listing.company_logo ? 'inline-block min-h-[2.875rem] min-w-[2.875rem] w-[2.875rem] h-[2.875rem] rounded-full' : 'inline-block min-h-[2.875rem] min-w-[2.875rem] w-[2.875rem] h-[2.875rem] rounded-full bg-gray-400'}
        src={selectedCard.job_saved && selectedCard.job_saved.job_listing.company_logo ? selectedCard.job_saved.job_listing.company_logo : "https://img.icons8.com/?size=128&id=6LvtpL48Lmmx&format=png&color=FFFFFF"} alt="Company Logo" />
        <div className='ml-4'>
          <h3 className="text-xl font-bold">{selectedCard.job_saved?.job_listing?.job_title || selectedCard.job_title}</h3>
          <div className='text-gray-600'>{selectedCard.job_saved?.job_listing?.company_name || selectedCard.company_name}</div>
        </div>
      </div>
      
      <div><strong>Location:</strong> {selectedCard.job_saved?.job_listing?.location || selectedCard.location}</div>
      <div><strong>Description:</strong> {selectedCard.job_saved?.job_listing?.description || selectedCard.description}</div>
      
      <div className='mt-5'>
  <strong>Notes:</strong>
  {isEditingNotes ? (
    <div>
      <textarea
        value={currentNotes}
        onChange={handleNotesChange}
        className="w-full h-20 p-2 mt-2 border rounded-md"
      ></textarea>
      <div className="flex flex-col mt-2">
        <button
          className="mb-2 py-2 px-3 rounded-md border font-medium text-gray-700 bg-white align-middle hover:bg-gray-50 transition-all text-sm"
          onClick={saveEditedNotes}
        >
          Save
        </button>
        <button
          className="mb-2 py-2 px-3 rounded-md border font-medium text-gray-700 bg-white align-middle hover:bg-gray-50 transition-all text-sm"
          onClick={cancelEditingNotes}
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div>
      {selectedCard.notes}
      <div className="flex flex-col mt-2">
        <button
          className="mb-2 py-2 px-3 w-full rounded-md border font-medium text-gray-700 bg-white align-middle hover:bg-gray-50 transition-all text-sm"
          onClick={() => startEditingNotes(selectedCard.id, selectedCard.notes)}
        >
          Edit Notes
        </button>
        <button className="mb-2 py-2 px-3 w-full rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm">
          <a
            href={selectedCard.job_saved?.job_listing?.url}
            target="_blank"
            rel="noopener noreferrer">
            Visit site
          </a>
        </button>
        <button
  onClick={(e) => deleteCard(e, selectedCard.id, selectedCard.job_saved?.id)}
  className="mb-2 py-2 px-3 w-full rounded-md border border-red-400 font-medium bg-white text-red-700 align-middle hover:bg-gray-50 transition-all text-sm"
>
  Delete
</button>

      </div>
    </div>
  )}
</div>


      
      {/* <button
        onClick={(e) => deleteCard(e, selectedCard.job_saved?.id || 0)}
        className="m-2 py-2 px-3 rounded-md border border-red-400 font-medium bg-white text-red-700 align-middle hover:bg-gray-50 transition-all text-sm"
      >
        Delete
      </button> */}
      
    </div>
  </div>
)}


        </DragDropContext>


{isAddCardModalOpen && (
    <div className="fixed flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50"></div>
        <div className="md:max-w-[800px] md:max-h-[600px] overflow-auto bg-white p-4 flex flex-col rounded-lg shadow-md z-10">
            <div className='flex justify-between'>
              <h3 className="text-xl font-bold mb-4">Add New Card</h3>
              <button onClick={() => {setIsAddCardModalOpen(false); setNewCardData(null);}} className="mb-2 py-2 px-3 rounded-md border font-medium text-gray-700 bg-white align-middle hover:bg-gray-50 transition-all text-sm">
                  Close
              </button>
            </div>
            <form onSubmit={handleAddCardSubmit}>
              <div>
                  {/* Existing Fields */}
                  <input
                      type="text"
                      placeholder="Job Title"
                      value={newCardData?.job_title || ''}
                      // @ts-ignore
                      onChange={(e) => setNewCardData({...newCardData, id: newCardData?.id || 0, job_title: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                      required
                  />
                  <input
                      type="text"
                      placeholder="Company"
                      value={newCardData?.company_name || ''}
                      // @ts-ignore
                      onChange={(e) => setNewCardData({...newCardData, company_name: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                      required
                  />
                  <input
                      type="url"
                      placeholder="URL"
                      value={newCardData?.url || ''}
                      // @ts-ignore
                      onChange={(e) => setNewCardData({...newCardData, url: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                      
                  />

                  {/* New Fields */}
                  <input
                      type="text"
                      placeholder="Location"
                      value={newCardData?.location || ''}
                      // @ts-ignore
                      onChange={(e) => setNewCardData({...newCardData, location: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                  />
                  <textarea
                      placeholder="Description"
                      value={newCardData?.description || ''}
                      // @ts-ignore
                      onChange={(e) => setNewCardData({...newCardData, description: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                  />
                  <input
                      type="url"
                      placeholder="Company Logo URL (optional)"
                      value={newCardData?.company_logo || ''}
                      // @ts-ignore
                      onChange={(e) => setNewCardData({...newCardData, company_logo: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                  />

                  {/* Existing Textareas */}
                  <textarea
                      placeholder="Listing Details"
                      value={newCardData?.listing_details || ''}
                      // @ts-ignore
                      onChange={(e) => setNewCardData({...newCardData, listing_details: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                  />
                  <textarea
                      placeholder="Notes"
                      value={newCardData?.notes || ''}
                      // @ts-ignore
                      onChange={(e) => setNewCardData({...newCardData, notes: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                  />
              </div>
              <button type="submit" className="mb-2 mr-2 py-2 px-3 rounded-md border font-medium text-gray-700 bg-white align-middle hover:bg-gray-50 transition-all text-sm">
                  Save
              </button>
              <button onClick={() => {setIsAddCardModalOpen(false); setNewCardData(null);}} className="mb-2 py-2 px-3 rounded-md border font-medium text-gray-700 bg-white align-middle hover:bg-gray-50 transition-all text-sm">
                  Cancel
              </button>

            </form>
        </div>
    </div>

)}




      </div>
    </div>
  );
  
  
}


export default JobNotebook;

