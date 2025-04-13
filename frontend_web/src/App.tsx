import ReactRouter from "./routes/ReactRouter";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import { useLocation } from 'react-router-dom';


function App() {
  const location = useLocation();
  
  // Check if the current path is a dashboard path to avoid double navigation components
  const isDashboardPath = 
    location.pathname.startsWith('/mentor/dashboard') || 
    location.pathname.startsWith('/mentee/dashboard');
  
  return (
    <>
      <div className="min-h-screen">
        {!isDashboardPath && <Navbar />}
        <div className={!isDashboardPath ? "pt-0" : ""}>
          <ReactRouter />
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;