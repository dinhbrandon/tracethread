import { useState, useEffect } from 'react';
import { Columns } from '../types/types';
import { useToken } from '../hooks/useToken';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const EditColumns = () => {
    const token = useToken();
    const [columns, setColumns] = useState<Columns[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [columnToDelete, setColumnToDelete] = useState<number | null>(null);

    async function checkForAssociatedCards(columnId: number) {
        const url = `http://localhost:8000/jobnotebook/cards?column_id=${columnId}`;        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
          },
        });
        const data = await response.json();
        return data.length > 0;
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

  async function deleteColumn(id: number) {
    const url = `http://localhost:8000/jobnotebook/columns/${id}`;
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
    });
    if (response.ok) {
        getColumns();
      } else {
        console.error('Error deleting column');
        //a modal to show the error
      }

  }

  const handleDeleteClick = async (id: number) => {
    const hasAssociatedCards = await checkForAssociatedCards(id);
    if (hasAssociatedCards) {
      alert('This column cannot be deleted because there are cards associated with it. Please remove cards before deleting the column.');
      return;
    }
    setColumnToDelete(id);
    setIsModalOpen(true);
  };
  

  const ConfirmationModal = () => {
    const handleCancel = () => {
      setIsModalOpen(false);
      setColumnToDelete(null);
    };

    const handleConfirm = async () => {
      if (columnToDelete !== null) {
        await deleteColumn(columnToDelete);
      }
      setIsModalOpen(false);
      setColumnToDelete(null);
    };

    return (
      <div className="rounded-xl bg-red-800 w-48">
        <div className="modal-content">
          <span className="close" onClick={handleCancel}>&times;</span>
          <p><strong>Are you sure you want to delete this column and its associated jobs?</strong></p>
          <button className='m-4 border-2 p-2 rounded-xl bg-red-600' onClick={handleConfirm}>Confirm</button>
          <button className='m-4 border-2 p-2 rounded-xl bg-green-600' onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    );
  };
  

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

  const saveOrder = async () => {
    const updatedColumns = columns.map((column, index) => ({
      id: column.id,
      order: index
    }));

    const url = `http://localhost:8000/jobnotebook/columns/batch_update`;
    try {
      await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(updatedColumns)
      });
      alert('Order saved successfully!');
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  useEffect(() => {
    getColumns();
  }, []); 

  return (
    <div>
      {isModalOpen && <ConfirmationModal />}
      <button className='m-4 p-1 bg-orange-500 rounded-xl' onClick={saveOrder}>Save Order</button>
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
                      <h1 className="text-xl font-bold mb-4 text-center border-b">{column.name}</h1>
                      <button onClick={() => handleDeleteClick(column.id)} className='m-4 p-1 bg-red-500 rounded-xl'>Delete</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
  
}

export default EditColumns;
