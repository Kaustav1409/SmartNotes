import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notes"
      );

      console.log("DATA RECEIVED:", response.data);

      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  return (
    <div>
      <h1>SmartNotes</h1>

      <h2>Total Notes: {notes.length}</h2>

      {notes.map((note) => (
        <div key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.description}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;