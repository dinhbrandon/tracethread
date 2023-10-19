import { JobNotebookSearchProps } from '../types/types';

const JobNotebookSearch: React.FC<JobNotebookSearchProps> = ({ searchTerm, onSearchTermChange }) => {
    return (
        <div className='m-4'>
            <input 
                type="search"
                value={searchTerm}
                onChange={e => onSearchTermChange(e.target.value)}
                className='rounded-xl p-2 border'
                placeholder='Search for a job...'
            />
        </div>
    )
}

export default JobNotebookSearch;
