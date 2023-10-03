import { useState, useEffect } from 'react';
import { useToken } from '../hooks/useToken';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Card {
  id: number;
  job_saved: JobSaved;
  notes: string;
  column: number;
}

interface Columns {
  id: number;
  name: string;
  owner: Card[];
  order: number;
}

interface JobListing {
  company_name: string;
  description: string;
  job_title: string;
  location: string;
  url: string;

}

interface JobSaved {
  id: number;
  job_listing: JobListing;
  date_saved: string;
}

const JobNotebook: React.FC = () => {
  const token = useToken();
  const [columns, setColumns] = useState<Columns[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);
  const [currentNotes, setCurrentNotes] = useState<string>("");

//to test if the correct card is being selected
  function handleMouseDown(e: React.MouseEvent, card: Card) {
    console.log('Card clicked:', card);
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const sourceColumnId = Number(result.source.droppableId);
    const destinationColumnId = Number(result.destination.droppableId);

    // Create a copy of the cards array to avoid mutating the state directly
    const updatedCards = Array.from(cards);

    // Find the moved card based on its index in the cards array, not its order in a particular column
    const movedCard = updatedCards[result.source.index];

    if (!movedCard) {
      console.error('Card not found');
      return;
    }

    // Remove the moved card from the cards array
    updatedCards.splice(result.source.index, 1);

    // Update the column property of the moved card to the destination column id
    movedCard.column = destinationColumnId;

    // Insert the moved card into the cards array at the new index
    updatedCards.splice(result.destination.index, 0, movedCard);

    // Update the state with the new cards array
    setCards(updatedCards);

    const cardId = movedCard.id;
    const newColumnId = destinationColumnId;
    const newOrder = result.destination.index;

    const response = await fetch(`http://localhost:8000/jobnotebook/cards/${cardId}/change-column`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
            new_column_id: newColumnId,
            order: newOrder
        })
    });

    if (response.ok) {
        const updatedCard = await response.json();
        // console.log('Card updated successfully:', updatedCard);
    } else {
        console.error('Error updating card:', await response.text());
    }
    console.log('Moved Card:', movedCard);

}




  function openModal(cardId: number, notes: string) {
    setCurrentCardId(cardId);
    setCurrentNotes(notes);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
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
        closeModal();
        getCards();
      } else {
        console.error('Failed to update notes.');
      }
    }
  }

  useEffect(() => {
    getColumns();
    getCards();
  }, [])

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4">
        {columns.map((column) => (
          <Droppable droppableId={column.id.toString()} key={column.id}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="bg-black-200 p-4 rounded-lg border-2">
                <h2 className="text-xl font-bold mb-4">{column.name}</h2>
                <div className="flex flex-col gap-2">
                  {cards.filter((card) => card.column === column.id).map((filteredCard, index) => (
                    <Draggable key={filteredCard.id} draggableId={filteredCard.id.toString()} index={index}>
                      {(provided) => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} onMouseDown={(e) => handleMouseDown(e, filteredCard)} className="bg-black p-4 rounded-lg border border-gray-300">
                          <div className="mb-2">
                            <strong>Job Title:</strong> {filteredCard.job_saved.job_listing.job_title}
                            <button 
                            className="rounded-xl bg-red-600 w-6" 
                            onClick={(e) => deleteCard(e, filteredCard.job_saved.id)}>X</button>
                          </div>
                          <div className="mb-2">
                            <strong>Company:</strong> {filteredCard.job_saved.job_listing.company_name}
                          </div>
                          <div className="mb-2">
                            <strong>Location:</strong> {filteredCard.job_saved.job_listing.location}
                          </div>
                          <div className="mb-2">
                            <strong>Description:</strong> {filteredCard.job_saved.job_listing.description}
                          </div>
                          <div className="mb-2">
                            <strong>Notes:</strong> {filteredCard.notes}
                          </div>
                          <button className="rounded-xl p-2 bg-green-500" onClick={() => openModal(filteredCard.id, filteredCard.notes)}>Edit Notes</button>
                          <div>
                            <a
                              href={filteredCard.job_saved.job_listing.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              Application Link
                            </a>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
  
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Edit Notes</h3>
              <input type="text" value={currentNotes} onChange={handleNotesChange} className="border p-2 rounded-lg w-full mb-4" />
              <button onClick={saveNotes} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2">Save</button>
              <button onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
  
}

export default JobNotebook;
