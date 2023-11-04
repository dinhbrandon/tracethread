import { useState, useEffect } from 'react';
import { getFeedback, getUpvotesFeedback, getComments, submitComment, upvoteFeedback } from '../utils/api';
import { useToken } from '../hooks/useToken';
import { Feedback, Comment } from '../types/types';

const FeedbackPage = () => {
    const token = useToken();
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Record<number, Comment[]>>({});
    const [upvoteCounts, setUpvoteCounts] = useState<Record<number, number>>({});
    const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
    const [userUpvotes, setUserUpvotes] = useState<Record<number, boolean>>({});

    async function handleUpvote(feedbackId: number) {
        if (!token) {
            console.error('Token is null');
            return;
        }
        if (userUpvotes[feedbackId]) {
            console.error('User has already upvoted this feedback');
            return; 
        }
        try {
            await upvoteFeedback(token, feedbackId);
            fetchFeedbackUpvotes(token, feedbackId);
            setUserUpvotes(prevUpvotes => ({
                ...prevUpvotes,
                [feedbackId]: true
            }));
        } catch (error: any) {
            setError(error.message);
        }
    }
    

    async function fetchFeedback() {
        if (!token) {
            console.error('Token is null');
            return;
        }
        try {
            const result = await getFeedback(token);
            setFeedback(result.data);
    
            // Create a record of which feedback items the user has upvoted
            const upvotes = {};
            for (const item of result.data) {
                upvotes[item.id] = item.has_upvoted;
            }
            setUserUpvotes(upvotes);
    
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

    async function fetchComments(token: any, feedbackId: any) {
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

    const handleCommentChange = (feedbackId: number, text: string) => {
        setCommentInputs(prevComments => ({
            ...prevComments,
            [feedbackId]: text,
        }));
    };

    const handleSubmitComment = async (feedbackId: number) => {
        try {
            const comment = commentInputs[feedbackId];
            if (!comment) return; // maybe handle empty comment situation

            await submitComment(token, comment, feedbackId);
            fetchComments(token, feedbackId);
            setCommentInputs(prev => ({
                ...prev,
                [feedbackId]: '', // Clear input after submission
            }));
        } catch (error: any) {
            setError(error.message);
        }
    };

    

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
                            <button
                                type="button"
                                onClick={() => handleUpvote(feedbackItem.id)}
                                className={`flex items-center justify-center`}
                                disabled={userUpvotes[feedbackItem.id]}
                            >
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0,0,256,256">
                                <g fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none">
                                    <g transform="scale(10.66667,10.66667)">
                                        <path 
                                            d="M23.86133,16.15277l-11.5,-12.00476c-0.18945,-0.19734 -0.5332,-0.19734 -0.72266,0l-11.5,12.00476c-0.1875,0.19637 -0.18457,0.50704 0.00781,0.6995l3,3.00119c0.09473,0.09476 0.21387,0.14068 0.36035,0.14654c0.13574,-0.00195 0.26367,-0.05862 0.35645,-0.15631l8.13672,-8.61865l8.13672,8.61865c0.09277,0.0977 0.2207,0.15436 0.35645,0.15631c0.00195,0 0.00488,0 0.00684,0c0.13281,0 0.25977,-0.05276 0.35352,-0.14654l3,-3.00119c0.19238,-0.19246 0.19531,-0.50313 0.00781,-0.6995z"
                                            fill={userUpvotes[feedbackItem.id] ? "#86dcaa" : "#9f9f9f"}
                                        ></path>
                                    </g>
                                </g>
                            </svg>
                            </button>
                            <p className='font-semibold text-lg text-green-400'>{upvoteCounts[feedbackItem.id]}</p>
                        </div>

                        <h2 className=" font-semibold underline">Issue #{feedbackItem.id} at {feedbackItem.url}</h2>
                        <p className="text-xs mb-4">
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
                            <p className='text font-semibold'>Comments</p>
                            {comments[feedbackItem.id]?.map(comment => (
                                <div key={comment.id} className="mb-4">
                                    <div>
                                    <p>
                                        <strong className='text-sm'>User {comment.user}: </strong> 
                                        <span className='text-sm text-gray-600'>{comment.comment}</span>
                                    </p>
                                    <p className="text-xs">
                                    {new Date(comment.date).toLocaleDateString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    </p>
                                    </div>

                                </div>
                            ))}
                        </div>

    

                        <form 
  onSubmit={(e) => {
      e.preventDefault();
      handleSubmitComment(feedbackItem.id);
  }}
  className="relative flex items-center"
>
  <input 
    type="text" 
    value={commentInputs[feedbackItem.id] || ''}
    onChange={(e) => {handleCommentChange(feedbackItem.id, e.target.value)}}
    className="border rounded p-2 w-full" 
    placeholder="Write a comment..." 
  />
  <button 
    type="submit" 
    className="absolute inset-y-0 right-0 px-3 flex items-center rounded p-2 rounded-r-lg flex items-center justify-center"
    aria-label="Send comment"
  >
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0,0,256,256"><g fill="#9f9f9f" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none"><g transform="scale(10.66667,10.66667)"><path d="M3,3c-0.55228,0 -1,0.44772 -1,1v5.5957c0,0.514 0.38939,0.94314 0.90039,0.99414l14.09961,1.41016l-14.09961,1.41016c-0.511,0.051 -0.90039,0.48014 -0.90039,0.99414v5.5957c0,0.55228 0.44772,1 1,1c0.19092,0.00044 0.37797,-0.05378 0.53906,-0.15625c0.00065,-0.00065 0.0013,-0.0013 0.00195,-0.00195l17.79883,-7.89844l-0.00195,-0.00391c0.39659,-0.14238 0.66138,-0.51808 0.66211,-0.93945c-0.00073,-0.42137 -0.26552,-0.79708 -0.66211,-0.93945l0.00195,-0.00391l-17.8125,-7.9043c-0.15813,-0.09898 -0.34079,-0.15174 -0.52734,-0.15234z"></path></g></g></svg>
  </button>
</form>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeedbackPage
