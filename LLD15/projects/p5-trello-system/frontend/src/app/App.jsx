import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import { AuthProvider } from "../context/AuthContext";
import "../styles/global.css";
import DragPlay5x5 from "../pages/DragPlay";

function App() {
  // return <DragPlay5x5 />
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;