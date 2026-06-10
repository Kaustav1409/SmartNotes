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