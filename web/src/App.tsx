import ReactRouter from "./routes/ReactRouter";
import { Toaster } from "react-hot-toast";

export default () => {
  return (
    <div className="min-h-screen">
      <ReactRouter />
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};
