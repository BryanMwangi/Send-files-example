import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import { FileUploadScreen } from "./Components/Upload";
import FileComponent from "./Components/File";

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    const response = await axios.get("http://localhost:5000/ping");
    console.log(response);

    setCount((count) => count + 1);
    setMessage(response.data.message);
  };

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h2 className="title">React app for simple file upload</h2>

      <div className="main-container">
        <FileUploadScreen />
        <FileComponent />
      </div>

      <div className="card">
        <button onClick={handleClick}>Test connection to server</button>
        <p>If connection is ok, you will see the message: {message}</p>
      </div>
    </>
  );
}

export default App;
