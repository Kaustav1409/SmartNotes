import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notes"
      );

      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/notes",
        {
          title,
          description,
        }
      );

      setTitle("");
      setDescription("");

      fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };
  const deleteNote = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/notes/${id}`
    );

    fetchNotes();
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

  return (
    
    <div>
      <h1>SmartNotes</h1>

      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <textarea
        placeholder="Enter Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <button onClick={addNote}>
        Add Note
      </button>

      <hr />

      <h2>Total Notes: {notes.length}</h2>

    {notes.map((note) => (
  <div className="note-card" key={note._id}>
    <h3>{note.title}</h3>
    <p>{note.description}</p>

    <button onClick={() => deleteNote(note._id)}>
  Delete
</button>

    <hr />
  </div>
))}
    </div>
  );
}

export default App;