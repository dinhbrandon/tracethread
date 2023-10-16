import { useState, useEffect, useRef } from 'react';
import { useToken } from '../hooks/useToken';
import { Card, Columns} from '../types/types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import JobNotebookSearch from './JobNotebookSearch';
import TimeSince from './TimeSince';
import { createCard } from '../utils/api.tsx';

const JobNotebook: React.FC = () => {
  const token = useToken();
  const [columns, setColumns] = useState<Columns[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);
  const [currentNotes, setCurrentNotes] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState<boolean>(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState<boolean>(false);
  const [newCardData, setNewCardData] = useState<Card | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // This function is called when a card is dragged and dropped
  // It updates the column and order of the card
  const onDragEnd = async (result, columnsArray, setColumns) => {
    // This condition prevents the app from crashing if the card is dropped outside of a droppable area
    if (!result.destination) return;
    // source is the original location of the card
    // destination is the new location of the card
    const { source, destination } = result;
    // This column is different from the 'columns' state variable
    // because it contains the 'items' array, which is the array of cards
    // while the 'columns' state variable does not contain the 'items' array and is just an array of columns
    const columns = columnsArray.reduce((acc, column) => {
        acc[column.id] = {
            ...column,
            items: cards.filter(card => card.column === column.id)
        };
        return acc;
    }, {});
    // sourceColumn is the original column of the card
    const sourceColumn = columns[source.droppableId];
    // destColumn is the new column of the card
    const destColumn = columns[destination.droppableId];
    // This condition checks if the card is being moved to a new column
    // If it is, then it removes the card from the original column and adds it to the new column
    // If it is not, then it just moves the card to a new position in the same column
    if (!sourceColumn || !sourceColumn.items || !destColumn || !destColumn.items) {
        console.error("Invalid column structure or missing items array");
        return;
    }
    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceColumn.items.splice(source.index, 1);
      removed.timestamp = new Date().toISOString(); // update the timestamp
      destColumn.items.splice(destination.index, 0, removed);
      await editCardColumn(removed.id, parseInt(destination.droppableId), destination.index, removed.timestamp);
  } else {
      const [removed] = sourceColumn.items.splice(source.index, 1);
      sourceColumn.items.splice(destination.index, 0, removed);
      await editCardColumn(removed.id, parseInt(source.droppableId), destination.index, removed.timestamp);
  }
  

    // Convert back to array
    const updatedColumnsArray = Object.values(columns).map(column => {
        const { items, ...rest } = column;  // Remove the 'items' since they're not part of the original structure
        return rest;
    });

    setColumns(updatedColumnsArray);
  };

  function openCardModal(card: Card) {
    setSelectedCard(card);
    setIsModalOpen(true);
  }

  function closeCardModal() {
    setIsModalOpen(false);
    setSelectedCard(null);
  }

  function openEditModal(cardId: number, notes: string) {
    setCurrentCardId(cardId);
    setCurrentNotes(notes);
    setIsNotesModalOpen(true);
  }

  function closeEditModal() {
    setIsNotesModalOpen(false);
    setCurrentCardId(null);
    setCurrentNotes("");
  }

  function handleNotesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentNotes(e.target.value);
  }

  async function getColumns() {
    const url = `http://localhost:8000/jobnotebook/columns`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
    });
    const fetchedData = await response.json();
    setColumns(fetchedData);
  }

  async function getCards() {
    const url = `http://localhost:8000/jobnotebook/cards`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
    });
    const fetchedData = await response.json();
    setCards(fetchedData);
  }

  async function deleteCard(e: React.FormEvent, jobId: number) {
    e.preventDefault();
    const url = `http://localhost:8000/querier/delete-jobsaved/${jobId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
    });
    if (response.ok) {
      closeCardModal();
      getCards();
    }
  };

  async function saveNotes() {
    if (currentCardId !== null) {
      const url = `http://localhost:8000/jobnotebook/cards/${currentCardId}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify({ notes: currentNotes })  // <-- Send the updated notes
      });
      if(response.ok) {
        closeEditModal();

        //update the selectedCard state to show the new notes
        setSelectedCard(prevState => {
          if (prevState) {
            return {
              ...prevState,
              notes: currentNotes
            };
          }
          return prevState;
        });

        getCards();
      } else {
        console.error('Failed to update notes.');
      }
    }
  }

  async function editCardColumn(cardId: number, newColumnId: number, newOrder: number, timestamp: Date) {
    const response = await fetch(`http://localhost:8000/jobnotebook/cards/${cardId}/change-column`, {
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
    const requestBody = {
        new_column_id: newColumnId,
        order: newOrder,
        timestamp: timestamp
    };
    if (response.ok) {
        getCards();
    } else {
        console.error('Failed to update column.');
    }
}

  function isSearchTermPresent(card: Card) {

    //create an array of fields to search
    const fieldsToSearch = [
      card.job_saved?.job_listing?.job_title,
      card.job_saved?.job_listing?.company_name,
      card.job_saved?.job_listing?.location,
      card.job_saved?.job_listing?.description,
      card.notes,
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
      notes: newCardData?.notes || '',
      column: newCardData?.column,
      order: newCardData?.order,
      timestamp: newCardData?.timestamp || new Date().toISOString(),
      job_title: newCardData?.job_title,
      company_name: newCardData?.company_name,
      company_logo: newCardData?.company_logo,  // Add the company_logo property to the Card type
      listing_details: newCardData?.listing_details || '',
      description: newCardData?.description || '',
      location: newCardData?.location,
      url: newCardData?.url
    };

    if (token) {
        const result = await createCard(token, cardData);
        if (result.data) {
            setCards(prevCards => [...prevCards, result.data]);
            setIsAddCardModalOpen(false);
        } else {
            console.error('Failed to create card:', result.error);
        }
    } else {
        console.error('Token is null');
    }
    console.log('Submitting card data:', cardData);
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
    getColumns();
    getCards();
  }, [])

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

  return (
    <div className="flex gap-4 flex-col">
      <div className='flex justify-between'>
        <JobNotebookSearch searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
        <button className='rounded-xl bg-orange-500 m-4 p-2'><a href='http://localhost:3000/editcolumns'>Edit Columns</a></button>
      </div>
      {/* justify center to make card modal center*/}
      <div className='flex justify-center'>
        <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>

          {/* Map through each column */}
          {columns.map((column) => (
            <Droppable droppableId={String(column.id)} key={column.id}>
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-black-200 p-4 rounded-lg border-2 md:min-w-80 md:w-80 md:min-h-[700px]"
                >
                  <h2 className="text-xl font-bold mb-4 text-center border-b">{column.name}</h2>
                  <button onClick={() => openNewCardModal(column.id)} className='p-2 bg-green-500 rounded-xl'>
                      + Add Card
                  </button>


                  <div className="flex flex-col gap-2">
                
                {/* Filter cards by search term */}
                  {cards
                    .filter(card => isSearchTermPresent(card))
                    .filter(card => card.column === column.id)
                    .map((filteredCard, index) => {
                      return(
                        <Draggable key={filteredCard.id} draggableId={String(filteredCard.id)} index={index}>
                        {(provided) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-black p-4 rounded-lg border border-gray-300"
                          >
                            <div>
                              {/* job_listing.company_logo rounded */}
                              <img src={filteredCard.job_saved?.job_listing?.company_logo} alt="Company Logo" />
                            </div>
                            <div className="mb-2">
                              <strong>Job Title:</strong> {filteredCard.job_saved?.job_listing?.job_title}
                            </div>
                            <div className="mb-2">
                              <strong>Company:</strong> {filteredCard.job_saved?.job_listing?.company_name}
                            </div>
                            <div>
                              <strong>Time in this column: </strong>
                              <TimeSince date={filteredCard.timestamp} />
                            </div>
                            {/* New See More button */}
                            <button
                              className="rounded-xl p-2 bg-blue-500"
                              onClick={() => openCardModal(filteredCard)}
                            >
                              See More
                            </button>
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
          ))}

          {/* Modal for editing notes on a card */}
          {isModalOpen && selectedCard && (
            <div ref={modalRef} className="fixed flex items-center justify-center">
              <div className="md: max-w-[800px] md:max-h-[600px] overflow-auto bg-black p-4 flex flex-col rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">{selectedCard.job_saved?.job_listing?.job_title}</h3>
                <div><strong>Company:</strong> {selectedCard.job_saved?.job_listing?.company_name}</div>
                <div><strong>Location:</strong> {selectedCard.job_saved?.job_listing?.location}</div>
                <div><strong>Description:</strong> {selectedCard.job_saved?.job_listing?.description}</div>
                <div><strong>Notes:</strong> {selectedCard.notes}</div>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
                  onClick={() => openEditModal(selectedCard.id, selectedCard.notes)}
                >
                  Edit Notes
                </button>
                <a
                  href={selectedCard.job_saved?.job_listing?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                    className="text-blue-500 hover:underline block mt-2"
                  >
                    Application Link
                  </a>
                  <button onClick={closeCardModal} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4">
                    Close
                  </button>
                  <button
                    onClick={(e) => deleteCard(e, selectedCard.job_saved?.id || 0)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </DragDropContext>
        {/* Modal for editing notes on a card */}
        {isNotesModalOpen && currentCardId && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Edit Notes</h3>
              <input
                type="text"
                value={currentNotes}
                onChange={handleNotesChange}
                className="border p-2 rounded-lg w-full mb-4"
              />
              <button onClick={saveNotes} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">
                Save
              </button>
              <button onClick={closeEditModal} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        )}

{isAddCardModalOpen && (
    <div className="fixed flex items-center justify-center">
        <div className="md:max-w-[800px] md:max-h-[600px] overflow-auto bg-black p-4 flex flex-col rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Add New Card</h3>
            <form onSubmit={handleAddCardSubmit}>
              <div>
                  {/* Existing Fields */}
                  <input
                      type="text"
                      placeholder="Job Title"
                      value={newCardData?.job_title || ''}
                      onChange={(e) => setNewCardData({...newCardData, id: newCardData?.id || 0, job_title: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                      required
                  />
                  <input
                      type="text"
                      placeholder="Company"
                      value={newCardData?.company_name || ''}
                      onChange={(e) => setNewCardData({...newCardData, company_name: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                      required
                  />
                  <input
                      type="url"
                      placeholder="URL"
                      value={newCardData?.url || ''}
                      onChange={(e) => setNewCardData({...newCardData, url: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                      required
                  />

                  {/* New Fields */}
                  <input
                      type="text"
                      placeholder="Location"
                      value={newCardData?.location || ''}
                      onChange={(e) => setNewCardData({...newCardData, location: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                  />
                  <textarea
                      placeholder="Description"
                      value={newCardData?.description || ''}
                      onChange={(e) => setNewCardData({...newCardData, description: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                  />
                  <input
                      type="url"
                      placeholder="Company Logo URL (optional)"
                      value={newCardData?.company_logo || ''}
                      onChange={(e) => setNewCardData({...newCardData, company_logo: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                  />

                  {/* Existing Textareas */}
                  <textarea
                      placeholder="Listing Details"
                      value={newCardData?.listing_details || ''}
                      onChange={(e) => setNewCardData({...newCardData, listing_details: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                  />
                  <textarea
                      placeholder="Notes"
                      value={newCardData?.notes || ''}
                      onChange={(e) => setNewCardData({...newCardData, notes: e.target.value})}
                      className="border p-2 rounded-lg w-full mb-4"
                  />
              </div>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4">
                  Save
              </button>
              <button onClick={() => setIsAddCardModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4">
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

