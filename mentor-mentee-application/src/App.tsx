import React from "react";
import MentorDashboard from "./pages/MentorDashboard";

const App: React.FC = () => {

  const app = () =>{
    return(

      <div>
        <MentorDashboard />
      </div>
    );
  }

  return (
    <div>
      {/* <MentorDashboard /> */}
      {app()}
    </div>
  );
};

export default App;
