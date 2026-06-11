import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Personal");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

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
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/notes/${editId}`,
          {
            title,
            description,
            category,
          }
        );

        setEditId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/notes",
          {
            title,
            description,
            category,
          }
        );
      }

      setTitle("");
      setDescription("");
      setCategory("Personal");

      fetchNotes();
    } catch (error) {
      console.error("Error:", error);
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

  const editNote = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setCategory(note.category || "Personal");
    setEditId(note._id);
  };

  const filteredNotes = notes.filter((note) =>
    note.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>SmartNotes</h1>

      <input
        type="text"
        placeholder="Search Notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br />
      <br />

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

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Study">Study</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Ideas">Ideas</option>
      </select>

      <br />
      <br />

      <button onClick={addNote}>
        {editId ? "Update Note" : "Add Note"}
      </button>

      <hr />

      <h2>Total Notes: {notes.length}</h2>

      {filteredNotes.length === 0 && (
        <p>No Notes Found</p>
      )}

      {filteredNotes.map((note) => (
        <div className="note-card" key={note._id}>
          <h3>{note.title}</h3>

          <p>
            <strong>Category:</strong>{" "}
            {note.category || "Personal"}
          </p>

          <p>{note.description}</p>

          <small>
            Created:{" "}
            {new Date(
              note.createdAt
            ).toLocaleDateString()}
          </small>

          <br />
          <br />

          <button onClick={() => editNote(note)}>
            Edit
          </button>

          <button
            onClick={() => deleteNote(note._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;