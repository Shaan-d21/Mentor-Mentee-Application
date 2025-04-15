import toast from 'react-hot-toast';

let currentToastId: string | undefined;

export const showToast = (message: string, type: 'error' | 'success' = 'error') => {
  // Dismiss the current toast if it exists
  if (currentToastId) {
    toast.dismiss(currentToastId);
  }

  // Show the new toast and store its ID
  if (type === 'error') {
    currentToastId = toast.error(message, {
      duration: 5000,
      style: {
        background: '#fff',
        color: '#333',
        border: '1px solid #e5e7eb',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    });
  } else {
    currentToastId = toast.success(message, {
      duration: 3000,
      style: {
        background: '#fff',
        color: '#333',
        border: '1px solid #e5e7eb',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    });
  }
}; 