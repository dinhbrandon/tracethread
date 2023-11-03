import { getFeedback, getComments, upvoteComment,upvoteFeedback, submitComment } from '../utils/api.tsx';
import { useState, useEffect } from 'react';
import { useToken } from '../hooks/useToken.tsx';
import { Feedback, Comment } from '../types/types.tsx';

const FeedbackPage = () => {
    const token = useToken();

    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [_, setComments] = useState<Comment[]>([]);
    const [comment, setComment] = useState('');
    const [error, setError] = useState<string | null>(null);

    async function fetchFeedback() {
        if (!token) {
            console.error('Token is null');
            return;
        }
        const result = await getFeedback(token);
        if (result.error) {
            setError(result.error);
        } else {
            setFeedback(result.data);
        }
    }
    async function fetchComments() {
        if (!token) {
            console.error('Token is null');
            return;
        }
        const result = await getComments(token);
        if (result.error) {
            setError(result.error);
        } else {
            setComments(result.data);
        }
    }
    const handleUpvoteComment = async (comment: Comment) => {
        if (!token) {
            console.error('Token is null');
            return;
        }
        const result = await upvoteComment(token, comment);
        if (result.error) {
            setError(result.error);
        } else {
            // Assuming result.data contains the updated comment
            setComments(prevComments => 
                prevComments.map(cmt => cmt.id === comment.id ? result.data : cmt)
            );
        }
    };
    
    const handleUpvoteFeedback = async (feedbackItem: Feedback) => {
        const result = await upvoteFeedback(token!, feedbackItem);
        if (result.error) {
            setError(result.error);
        } else {
            setFeedback(prevFeedback => 
                prevFeedback.map(item => item.id === feedbackItem.id ? result.data : item) as Feedback[]
            );
        }
    };
    
    const handleSubmitComment = async (feedbackId: number, commentContent: string) => {
        const newComment = {
            comment: commentContent,
            date_submitted: new Date().toISOString(),
            upvotes: 0,
            id: feedbackId
        };
        if (!token) {
            console.error('Token is null');
            return;
        }
        const result = await submitComment(token, newComment);
        if (result.error) {
            setError(result.error);
        } else {
            setComments(prevComments => [...prevComments, result.data]);
            setFeedback(prevFeedback => 
                prevFeedback.map(item => {
                    if (item.id === feedbackId) {
                        return {
                            ...item,
                            comments: item.comments ? [...item.comments, result.data] : [result.data]
                        };
                    }
                    return item;
                })
            );
        }
    };
    

    useEffect(() => {
        fetchFeedback();
        fetchComments();
    },[token]);
    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <h1 className="text-center text-3xl font-semibold mb-6">Feedback Page</h1>
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className="max-w-screen-md mx-auto space-y-6">
                {feedback.map(feedbackItem => (
                    <div key={feedbackItem.id} className="bg-white shadow-lg p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">{feedbackItem.feedback}</h2>

                        {feedbackItem.comments?.map(commentItem => (
                            <div key={commentItem.id} className="border-b border-gray-200 py-4">
                                <button 
                                    onClick={() => handleUpvoteComment(commentItem)}
                                    className="text-blue-500"
                                >
                                    Upvote Comment
                                </button>
                                <p className="text-gray-600">{commentItem.comment}</p>
                                <p className="text-gray-400">{commentItem.date_submitted}</p>
                            </div>
                        ))}
                        <button 
                            onClick={() => handleUpvoteFeedback(feedbackItem)}
                            className="text-blue-500"
                        >
                            Upvote Feedback
                        </button>
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
