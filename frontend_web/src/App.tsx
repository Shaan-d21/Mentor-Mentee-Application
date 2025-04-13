import ReactRouter from "./routes/ReactRouter";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import { useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const location = useLocation();
  
  // Check if the current path is a dashboard path to avoid double navigation components
  const isDashboardPath = 
    location.pathname.startsWith('/mentor/dashboard') || 
    location.pathname.startsWith('/mentee/dashboard');
  
  return (
    <QueryClientProvider client={queryClient}>
      {location.pathname === '/' && !localStorage.getItem('accessToken') ? (
        <Navigate to="/auth/login" replace />
      ) : (
        <>
          <div className="min-h-screen">
            {!isDashboardPath && <Navbar />}
            <div className={!isDashboardPath ? "pt-0" : ""}>
              <ReactRouter />
            </div>
          </div>
          <Toaster position="top-center" reverseOrder={false} />
        </>
      )}
    </QueryClientProvider>
  );
}

export default App;