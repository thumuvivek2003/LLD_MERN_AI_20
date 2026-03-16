import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import { AuthProvider } from "../context/AuthContext";
import "../styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;