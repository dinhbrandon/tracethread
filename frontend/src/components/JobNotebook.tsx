import { useState, useEffect } from 'react';
import { useToken } from '../hooks/useToken';

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
    const reponse = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
    });
    const fetchedData = await reponse.json();
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
    console.log(url)
    if (response.ok) {
      console.log("deleted")
      getCards();
    }
  };

  useEffect(() => {
    getColumns();
    getCards();
  }, [])

  return (
    <div className="flex gap-4">
      {columns.map((column) => (
        <div className="bg-black-200 p-4 rounded-lg border-2" key={column.id}>
          <h2 className="text-xl font-bold mb-4">{column.name}</h2>
          <div className="flex flex-col gap-2">
            {cards
              .filter((card) => card.column === column.id)
              .map((filteredCard) => (
                <div className="bg-black p-4 rounded-lg border border-gray-300" key={filteredCard.id}>
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
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobNotebook;
