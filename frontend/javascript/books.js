const API_URL = "http://localhost:5000/api/user";

async function getAvailableBooks() {
  try {
    const books = await fetch(`${API_URL}/available`);
  } catch (error) {}
}
