//column api calls

//function to get columns
export async function getColumns(token: string) {
    const url = `http://localhost:8000/jobnotebook/columns`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok ${response.statusText}`);
      }
      const fetchedData = await response.json();
      return { data: fetchedData, error: null };
    } catch (error: any) {
        console.error(error);
        return { data: null, error: error.message };
    }
}

//function to add new columns
export async function createColumn(name: string, order: string, token: string): Promise<{ success: boolean, error: string | null }> {
  const url = `http://localhost:8000/jobnotebook/columns`;
  try {
      const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${token}`
          },
          body: JSON.stringify({ name, order })
      });
      if (!response.ok) {
          throw new Error(`Failed to create column: ${response.statusText}`);
      }
      return { success: true, error: null };
  } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message || String(error) };
  }
}



//function to delete columns
export async function deleteColumn(id: number, token: string): Promise<{ success: boolean, error: string | null }> {
    const url = `http://localhost:8000/jobnotebook/columns/${id}`;
    try {
      const response = await fetch(url, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${token}`
          },
      });
      if (!response.ok) {
          throw new Error(`Failed to delete column: ${response.statusText}`);
      }
      return { success: true, error: null };
    } catch (error: any) {
      console.error(error);
      return { success: false, error: error.message || String(error) };
    }
  }

//function to check for associated cards
export async function checkForAssociatedCards(columnId: number, token: string): Promise<{ hasCards: boolean | null, error: string | null }> {
    const url = `http://localhost:8000/jobnotebook/cards?column_id=${columnId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to check for associated cards: ${response.statusText}`);
      }
      const data = await response.json();
      return { hasCards: data.length > 0, error: null };
    } catch (error: any) {
      console.error(error);
      return { hasCards: null, error: error.message || String(error) };
    }
  }

//function to save column order when editing columns
export async function saveColumnOrder(columns: Array<{ id: number; order: number }>, token: string): Promise<{ success: boolean, error: string | null }> {
    const updatedColumns = columns.map((column, index) => ({
      id: column.id,
      order: index
    }));

    const url = `http://localhost:8000/jobnotebook/columns/batch_update`;
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`
            },
            body: JSON.stringify(updatedColumns)
        });

        if (!response.ok) {
            throw new Error(`Failed to save order: ${response.statusText}`);
        }

        return { success: true, error: null };
    } catch (error: any) {
        console.error('Error saving order:', error);
        return { success: false, error: error.message || String(error) };
    }
}

//card api calls

//function to get cards
export async function getCards(token: string, columnId?: number) {
    // Adjust the URL based on whether columnId is provided
    const url = columnId 
      ? `http://localhost:8000/jobnotebook/cards?column_id=${columnId}`
      : `http://localhost:8000/jobnotebook/cards`;
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch cards: ${response.statusText}`);
      }
      const fetchedData = await response.json();
      return { data: fetchedData, error: null };
    } catch (error: any) {
        console.error(error);
        return { data: null, error: error.message };
    }
  }
  
  