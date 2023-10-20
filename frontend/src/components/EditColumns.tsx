import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Columns } from '../types/types';
import { useToken } from '../hooks/useToken';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getCards, getColumns, deleteColumn, createColumn, checkForAssociatedCards, saveColumnOrder } from '../utils/api.tsx';

const ConfirmationModal = ({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void; }) => {
    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
            <div className="relative p-4 mx-auto my-auto max-w-md w-full">
                <div className="bg-white rounded-xl shadow-lg p-5">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
                    <p className="mb-4 text-gray-500">Are you sure you want to delete this column and its associated jobs?</p>
                    <div className="flex justify-end">
                        <button className="py-2 px-4 rounded-md text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 mr-2" onClick={onCancel}>Cancel</button>
                        <button className="py-2 px-4 rounded-md text-white bg-red-500 hover:bg-red-600" onClick={onConfirm}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};




const EditColumns = () => {
    const token = useToken();
    const [cards, setCards] = useState<Card[]>([]);
    const [columns, setColumns] = useState<Columns[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [columnToDelete, setColumnToDelete] = useState<number | null>(null);
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const navigate = useNavigate();

    const handleDeleteClick = async (id: number) => {
        if (!token) {
            console.error('Token is null');
            return;
        }
        const result = await checkForAssociatedCards(id, token);
        console.log(result)
        
        if (result.error) {
            console.error('Error checking for associated cards:', result.error);
        } else if (result.hasCards) {
            alert('This column cannot be deleted because there are cards associated with it. Please remove cards before deleting the column.');
        } else {
            setColumnToDelete(id);
            setIsModalOpen(true);
        }
    };

    const handleNewColumnNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewColumnName(e.target.value);
    };

    // Function to handle the confirmation of deletion
    const handleConfirmDelete = async () => {
        if (columnToDelete !== null) {
            if (!token) {
                console.error('Token is null');
                return;
            }
            const result = await deleteColumn(columnToDelete, token);
            if (result.success) {
                setColumns(prevColumns => prevColumns.filter(column => column.id !== columnToDelete));
            } else {
                console.error('Error deleting column:', result.error);
            }
            setIsModalOpen(false);
            setColumnToDelete(null);
        }
    };

    // Function to handle saving the order of columns
    const handleSaveOrder = async () => {
        if (!token) {
            console.error('Token is null');
            return;
        }
        const updatedColumns = columns.map((column, index) => ({
            id: column.id,
            order: index
        }));
        const result = await saveColumnOrder(updatedColumns, token);
        if (result.success) {
            navigate('/jobnotebook');
            
        } else {
            console.error('Error saving order:', result.error);
        }
    };
    

    //Function to handle adding a column
    const handleAddColumnSubmit = async () => {
        if (!token) {
            console.error('Token is null');
            return;
        }
        const order = columns.length;  // Determine the order based on the number of existing columns
        // Now call createColumn with the new column name and the order
        const result = await createColumn(newColumnName, order.toString(), token);
        if (result.success) {
            // Fetch the updated list of columns to ensure the state reflects the latest data
            const columnsResult = await getColumns(token);
            if (columnsResult.error) {
                console.error('Error fetching columns:', columnsResult.error);
            } else {
                setColumns(columnsResult.data);
            }
            setIsAddingColumn(false);
            setNewColumnName('');
        } else {
            console.error('Error adding column:', result.error);
        }
    };
    

    //Function to handle the drag and drop of columns
    const onDragEnd = async (result: { destination: any; source: any; draggableId: any; }) => {
        const { destination, source } = result;

        if (!destination) {
        return;
        }

        if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
        ) {
        return;
        }

        const start = source.droppableId;
        const finish = destination.droppableId;

        if (start === finish) {
            const newColumnOrder = Array.from(columns);
            const [movedColumn] = newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, movedColumn);
            setColumns(newColumnOrder);
        }
    };

    const countCardsForColumn = (column: Columns) => {
        return cards.filter((card: Card) => card.column === column.id).length;
    };

    const getCardLabel = (count: number) => count === 1 ? 'job' : 'jobs';
    
    useEffect(() => {
        const fetchColumns = async () => {
            if (!token) {
                console.error('Token is null');
                return;
            }
            const result = await getColumns(token);
            if (result.error) {
                console.error('Error fetching columns:', result.error);
            } else {
                setColumns(result.data);
            }
        };
        const fetchCards = async () => {
            if (!token) {
                console.error('Token is null');
                return;
            }
            const { data, error } = await getCards(token);
            if (error) {
                console.error('Error fetching cards:', error);
            } else {
                setCards(data);
            }
        };
        fetchColumns();
        fetchCards();
    }, [token]);

  return (
    <div>
      {isModalOpen && 
      <ConfirmationModal
        onCancel={() => {
            setIsModalOpen(false);
            setColumnToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />}

      
      <button className="m-1 py-2 px-3 rounded-md border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 transition-all text-sm" onClick={handleSaveOrder}>Save Order</button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppableId" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              className='flex'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columns.map((column, index) => (
                <Draggable key={column.id} draggableId={String(column.id)} index={index}>
                  {(provided) => (
                    <div
                        className="bg-black-200 p-4 rounded-lg border-2 md:min-w-80 md:w-80 md:min-h-[700px]"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <h1 className="text-xl font-bold mb-4 text-center border-b">
                            {column.name} ({countCardsForColumn(column)} {getCardLabel(countCardsForColumn(column))})
                        </h1>
                        <button onClick={() => handleDeleteClick(column.id)} className="m-1 py-1 px-3 rounded-md border border-red-400 font-medium bg-white text-red-700 align-middle hover:bg-gray-50 transition-all text-sm">Delete column</button>
                    </div>
                  )}
                </Draggable>
              ))}
                {/* Adding column form */}
                <form 
                    className="bg-black-200 p-4 rounded-lg border-2 md:min-w-80 md:w-80 md:min-h-[700px]  items-center"
                    onSubmit={handleAddColumnSubmit}
                >
                    <div className='flex'>
                        <input 
                            type="text" 
                            value={newColumnName} 
                            onChange={handleNewColumnNameChange}
                            placeholder="New Column Name"
                            className="m-1 p-1 border rounded"
                            required
                        />
                        <button type="submit" className='p-1 m-1 w-8 bg-green-500 rounded-xl'>
                            +
                        </button>
                    </div>
                </form>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
  
};

export default EditColumns;
