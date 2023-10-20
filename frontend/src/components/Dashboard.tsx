import React, { useEffect, useState } from 'react';
import { SavedSearchParameters } from '../types/types';
import { useToken } from '../hooks/useToken';

const Dashboard: React.FC = () => {
    const [savedParameters, setSavedParameters] = useState<SavedSearchParameters[]>([]);
    const token = useToken();
    console.log(token)

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

    async function deleteParameter(id: number) {
      const url = `http://localhost:8000/querier/saved-search-parameters/${id}`;
      const response = await fetch(url, {
          method: "DELETE",
          headers: {
              "Authorization": `Token ${token}`
          },
      });

      if (response.ok) {
          setSavedParameters(prevParams => prevParams.filter(param => param.id !== id));
          getParametersFromUser();
      } else {
          console.error('Failed to delete the parameter');
      }
  }

    useEffect(() => {
        getParametersFromUser();   
    }, []); 

    return (
      <div>
          <h1>Saved Searches</h1>
          <table>
              <thead>
                  <tr>
                      <th className='text-left'>Name</th>
                      <th className='text-left'>Query</th>
                  </tr>
              </thead>
              <tbody>
                  {savedParameters.map((param) => (
                      <tr key={param.id}>
                          <td className='text-left'>{param.name}</td>
                          <td className='text-left'>{param.query}</td>
                          <td className='text-center'>
                                <button onClick={() => deleteParameter(param.id)}>Delete</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );
  
}

export default Dashboard;
