import { Feedback, Comment } from "../types/types";

const baseUrlApi = import.meta.env.VITE_API_BASE_URL;

export async function getColumns(token: string) {
    const url = `${baseUrlApi}/jobnotebook/columns`;
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
  const url = `${baseUrlApi}/jobnotebook/columns`;

  const orderInt = parseInt(order);
  const newOrder = orderInt + 1;
  order = newOrder.toString();

 

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
    const url = `${baseUrlApi}/jobnotebook/columns/${id}`;
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
export async function checkForAssociatedCards(columnId: number, token: string) {
    const url = `${baseUrlApi}/jobnotebook/cards`;
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
      
      // iterate through each card in data and check if the column_id matches the columnId passed in
      // if it does, return true
      // if it doesn't, return false
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].column === columnId) {
            return { hasCards: true, error: null };
          }
        }
        return { hasCards: false, error: null };
      }

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

  const url = `${baseUrlApi}/jobnotebook/columns/batch_update`;
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

      const responseBody = await response.text();
      if (!responseBody) {
          console.warn('Empty response body');
          return { success: false, error: 'Empty response body' };
      }

      // const data = JSON.parse(responseBody);
      // console.log(data);
      
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
      ? `${baseUrlApi}/jobnotebook/cards?column_id=${columnId}`
      : `${baseUrlApi}/jobnotebook/cards`;
  
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
  
  //function to create cards
  export async function createCard(token: string, cardData: object) {
    const url = `${baseUrlApi}/jobnotebook/cards`;
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify(cardData)
      });
      if (!response.ok) {
        throw new Error(`Failed to create card: ${response.statusText}`);
      }
      const createdData = await response.json();
      return { data: createdData, error: null };
    } catch (error: any) {
        console.error(error);
        return { data: null, error: error.message };
    }
}

//Feedback api calls

//Get feedback
export async function getFeedback(token: string) {
  const url = `${baseUrlApi}/api/list-feedback`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch feedback: ${response.statusText}`);
    }
    const fetchedData = await response.json();
    return { data: fetchedData, error: null };
  } catch (error: any) {
    console.error(error);
    return { data: null, error: error.message };
  }
}

//Upvote feedback
export async function upvoteFeedback(token: string, feedback: Feedback) {
  const url = `${baseUrlApi}/api/upvote-feedback/${feedback.id}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify(feedback)
    });
    if (!response.ok) {
      throw new Error(`Failed to upvote feedback: ${response.statusText}`);
    }
    const createdData = await response.json();
    return { data: createdData, error: null };
  } catch (error: any) {
      console.error(error);
      return { data: null, error: error.message };
  }
}

//Get comments
export async function getComments(token: string) {
  const url = `${baseUrlApi}/api/list-comments`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch feedback: ${response.statusText}`);
    }
    const fetchedData = await response.json();
    return { data: fetchedData, error: null };
  } catch (error: any) {
    console.error(error);
    return { data: null, error: error.message };
  }
}

//Upvote comment
export async function upvoteComment(token: string, comment: Comment) {
  const url = `${baseUrlApi}/api/upvote-comment/${comment.id}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify(comment)
    });
    if (!response.ok) {
      throw new Error(`Failed to upvote comment: ${response.statusText}`);
    }
    const createdData = await response.json();
    return { data: createdData, error: null };
  } catch (error: any) {
      console.error(error);
      return { data: null, error: error.message };
  }
}

//Submit comment
export async function submitComment(token: string, comment: Comment) {
  const url = `${baseUrlApi}/api/submit-comment/${comment.id}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify(comment)
    });
    if (!response.ok) {
      throw new Error(`Failed to upvote comment: ${response.statusText}`);
    }
    const createdData = await response.json();
    return { data: createdData, error: null };
  } catch (error: any) {
      console.error(error);
      return { data: null, error: error.message };
  }
}