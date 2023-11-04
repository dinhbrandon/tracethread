import { useState, useEffect } from 'react';
import { getFeedback, getUpvotesFeedback, getComments, submitComment } from '../utils/api';
import { useToken } from '../hooks/useToken';
import { Feedback, Comment } from '../types/types';

const FeedbackPage = () => {
    const token = useToken();
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Record<number, Comment[]>>({});
    const [comment, setComment] = useState<string>('');
    const [upvoteCounts, setUpvoteCounts] = useState<Record<number, number>>({});


    async function fetchFeedback() {
        if (!token) {
            console.error('Token is null');
            return;
        }
        try {
            const result = await getFeedback(token);
            setFeedback(result.data);
            // After setting feedback, fetch upvotes for all of them
            result.data.forEach((item: Feedback) => {
                fetchFeedbackUpvotes(token, item.id);
                fetchComments(token, item.id);
            });
        } catch (error: any) {
            setError(error.message);
        }
    }

    async function fetchFeedbackUpvotes(token: string, feedbackId: number) {
        try {
            const result = await getUpvotesFeedback(token, feedbackId);

            setUpvoteCounts(prevCounts => ({
                ...prevCounts,
                [feedbackId]: result.data.upvote_count,
            }));
        } catch (error: any) {
            setError(error.message);
        }
    }

    async function fetchComments(token: string, feedbackId: number) {
        try {
            const result = await getComments(token, feedbackId);
            setComments(prevComments => ({
                ...prevComments,
                [feedbackId]: result.data,
            }));
            
        } catch (error: any) {
            setError(error.message);
        }
    }

    async function handleSubmitComment(feedbackId: number, comment: string) {
        try {
            await submitComment(token, comment, feedbackId);
            fetchComments(token, feedbackId);
            setComment('');
        } catch (error: any) {
            setError(error.message);
        }
    }

    

    useEffect(() => {
        fetchFeedback();
    }, [token]);


    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <h1 className="text-center text-3xl font-semibold mb-6">Feedback Page</h1>
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="max-w-screen-md mx-auto space-y-6">
                {feedback.map(feedbackItem => (
                    <div key={feedbackItem.id} className="bg-white shadow-lg p-6 rounded-lg relative">
                        <div className='absolute top-5 right-4 flex flex-col items-center'>
                            <button>
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0,0,256,256"><g fill="#9f9f9f" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none"><g transform="scale(10.66667,10.66667)"><path d="M23.86133,16.15277l-11.5,-12.00476c-0.18945,-0.19734 -0.5332,-0.19734 -0.72266,0l-11.5,12.00476c-0.1875,0.19637 -0.18457,0.50704 0.00781,0.6995l3,3.00119c0.09473,0.09476 0.21387,0.14068 0.36035,0.14654c0.13574,-0.00195 0.26367,-0.05862 0.35645,-0.15631l8.13672,-8.61865l8.13672,8.61865c0.09277,0.0977 0.2207,0.15436 0.35645,0.15631c0.00195,0 0.00488,0 0.00684,0c0.13281,0 0.25977,-0.05276 0.35352,-0.14654l3,-3.00119c0.19238,-0.19246 0.19531,-0.50313 0.00781,-0.6995z"></path></g></g></svg>
                            </button>
                            <p className='font-semibold text-lg text-green-400'>{upvoteCounts[feedbackItem.id]}</p>
                        </div>

                        <h2 className=" font-semibold underline">Issue #{feedbackItem.id} at {feedbackItem.url}</h2>
                        <p className="text-sm mb-4">
                        {new Date(feedbackItem.date).toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        </p>


                        {feedbackItem.screenshot ? (
                        <div>
                            <p className='font-semibold'>Screenshot</p>
                            <img src={feedbackItem.screenshot} alt="Screenshot related to feedback" className="max-w-xs max-h-xs mb-4" />
                        </div>
                        ) : (
                        <div>
                            <p className='text-sm text-gray-500 font-semibold italic mb-5'>No screenshot available</p>
                        </div>
                        )}

                        <div>
                            <p className='text font-semibold'>Feedback</p>
                            <p className="text-gray-600 mb-5">{feedbackItem.feedback}</p>
                        </div>
                        
                        <div>
                            <p className='text font-semibold mb-5'>Comments</p>
                            {comments[feedbackItem.id]?.map(comment => (
                                <div key={comment.id} className="mb-4">
                                    <p className='text-gray-500 font-semibold'>{comment.date}</p>
                                    <p>User {comment.user}</p>
                                    <p className='text-gray-600'>{comment.comment}</p>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmitComment(feedbackItem.id, comment);
                        }}>
                            <input 
                                type="text" 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="border rounded p-2 w-full" 
                                placeholder="Add a comment..." 
                            />
                            <button type="submit" className="bg-blue-500 text-white mt-4 py-2 px-4 rounded">Submit</button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeedbackPage
