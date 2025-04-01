import ReactRouter from "./routes/ReactRouter";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-0">
          <ReactRouter />
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </QueryClientProvider>
  );
}

export default App;
