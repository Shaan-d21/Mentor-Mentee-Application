import ReactRouter from "./routes/ReactRouter";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

export default () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-0">
        <ReactRouter />
      </div>
      {/* Configure Toaster to show messages at the top-center */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};
