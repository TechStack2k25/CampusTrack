export function dateFormat(messageDate) {
    const now = new Date();
    const messageDateObj = new Date(messageDate);
    const isToday = now.toDateString() === messageDateObj.toDateString();
  
    if (isToday) {
      // If the message is from today, returning the time in local format (hh:mm a)
      return messageDateObj.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      // returning the date in local format (MM/dd/yyyy)
      return messageDateObj.toLocaleDateString('en-US');
    }
  }
  