import React from 'react';

interface TimeSinceProps {
    date: string;
}

const TimeSince: React.FC<TimeSinceProps> = ({ date }) => {
    const parseDate = (dateString: string): Date => {
        // Check if the string is in ISO 8601 format
        if (dateString.includes('T')) {
            return new Date(dateString);
        }
    
        // Otherwise, handle the "MM/DD/YYYY HH:MM AM/PM" format
        const [datePart, timePart, period] = dateString.split(' ');
        const [month, day, year] = datePart.split('/').map(str => parseInt(str, 10));
        let [hours, minutes] = timePart.split(':').map(str => parseInt(str, 10));
    
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
    
        return new Date(year, month - 1, day, hours, minutes);
    }
    

    const timeSince = (dateString: string): string => {
        const jobDate = parseDate(dateString);
        const now = new Date();
        
        const seconds = Math.floor((now.getTime() - jobDate.getTime()) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 1) return `${years} years ago`;
        if (years === 1) return '1 year ago';
        if (months > 1) return `${months} months ago`;
        if (months === 1) return '1 month ago';
        if (weeks > 1) return `${weeks} weeks ago`;
        if (weeks === 1) return '1 week ago';
        if (days > 1) return `${days} days ago`;
        if (days === 1) return '1 day ago';
        if (hours > 1) return `${hours} hours ago`;
        if (hours === 1) return '1 hour ago';
        if (minutes > 1) return `${minutes} minutes ago`;
        if (minutes === 1) return '1 minute ago';

        return 'Just now';
    }

    return <span>{timeSince(date)}</span>;
}

export default TimeSince;
