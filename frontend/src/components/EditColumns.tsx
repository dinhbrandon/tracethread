import { useState, useEffect } from 'react';
import { Columns } from '../types/types';
import { useToken } from '../hooks/useToken';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const EditColumns = () => {
  const token = useToken();
  const [columns, setColumns] = useState<Columns[]>([]);

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

  const onDragEnd = async result => {
    const { destination, source, draggableId } = result;

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

      // Update backend for each column with new order
      for (let i = 0; i < newColumnOrder.length; i++) {
        const column = newColumnOrder[i];
        const url = `http://localhost:8000/jobnotebook/columns/${column.id}`;
        await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
          body: JSON.stringify({ order: i })  // Assuming 'order' is the correct field name
        });
      }
    }
  };


  useEffect(() => {
    getColumns();
  }, []); 

  return (
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
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
  
}

export default EditColumns;
