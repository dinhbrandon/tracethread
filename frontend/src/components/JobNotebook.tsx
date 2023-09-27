import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './redux/store';
import { removeJobFromNotebook } from './redux/jobSlice';  // Update the path accordingly

const JobNotebook: React.FC = () => {
    const dispatch = useDispatch();
    const selectedJobs = useSelector((state: RootState) => state.job.selectedJobs);

    const handleRemove = (id: number) => {
      dispatch(removeJobFromNotebook(id));
    };

    if (!selectedJobs || selectedJobs.length === 0) {
        return <div>No jobs selected</div>;
    }

    return (
      <div>
        {selectedJobs.map(job => (
          <div
          className='rounded-xl border-2 border-gray-300 p-4 m-4'
          key={job.id}>
            Job Title: {job.job_title} Company: {job.company_name} Location: {job.location} Description: {job.description}
            <button
              className="ml-4 bg-red-500 px-2 py-1 rounded"
              onClick={() => handleRemove(job.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    );
}

export default JobNotebook;
