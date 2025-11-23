const API_URL = "http://localhost:5000/api";

getAvailableBooks();

async function getAvailableBooks() {
  try {
    const res = await fetch(`${API_URL}/books/available`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) return res.status(404).json({ message: "Books not found" });

    const books = await res.json();

    const tbody = document.querySelector("#bookTable tbody");
    tbody.innerHTML = "";

    books.forEach((book) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${book.bookId}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.createdAt}</td>
          <td><button onclick="borrowBook(${book.bookId})">Borrow</button></td>`;

      tbody.appendChild(tr);
    });

    return books;
  } catch (error) {
    console.error("Error fetching available books", error);
  }
}

window.borrowBook = async function (bookId) {
  try {
    const res = await fetch(`${API_URL}/user/borrowBook/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Successfully borrowed "${data.title}"`);
      window.location.reload();
    } else {
      alert(data.message || "Failed to borrow book");
    }
  } catch (error) {
    console.error(error);
  }
};
