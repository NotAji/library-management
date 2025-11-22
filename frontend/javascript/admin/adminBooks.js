const API_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  addBook();
  getBooks();
});

function addBook() {
  const addBookModal = document.getElementById("addBookModal");
  const openAddBtn = document.getElementById("addBook"); // button to open modal
  const closeAdd = document.getElementById("closeAdd");
  const cancelAdd = document.getElementById("cancelAdd");

  openAddBtn.addEventListener("click", () => {
    addBookModal.style.display = "flex";
  });

  closeAdd.addEventListener("click", () => {
    addBookModal.style.display = "none";
  });
  cancelAdd.addEventListener("click", () => {
    addBookModal.style.display = "none";
  });
  addBookModal.addEventListener("click", (e) => {
    if (e.target === addBookModal) addBookModal.style.display = "none";
  });

  // SUBMIT FORM (connect to your backend)
  document
    .getElementById("addBookForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById("title").value;
      const author = document.getElementById("author").value;

      try {
        const res = await fetch(`${API_URL}/books/createBook`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title, author }),
        });

        const data = await res.json();

        console.log(data);

        if (res.ok) {
          alert("Book added successfully!");
          addBookModal.style.display = "none";
          document.getElementById("addBookForm").reset();
          getBooks(); // Reload book list if you have it
        } else {
          alert(data.error || "Failed to add book");
        }
      } catch (error) {
        console.error(error);
      }
    });
}

async function getBooks() {
  const res = await fetch(`${API_URL}/books/getBooks`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const books = await res.json();

  console.log(books);

  const tbody = document.querySelector("#booksTable tbody");
  tbody.innerHTML = "";

  books.forEach((book) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
          <td>${book.bookId}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.createdAt}</td>
          <td>${book.isBorrowed}</td>
          <td>${book.borrowedBy}</td>
          <td class="actions">
    <button class="edit-btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 3.487a2.127 2.127 0 113.01 3.01L7.5 18.87l-4 1 1-4L16.862 3.487z" />
      </svg>
    </button>

    <button class="delete-btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12M9 7V4h6v3m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
      </svg>
    </button>
  </td>
          `;

    const editBtn = tr.querySelector(".edit-btn");
    const deleteBtn = tr.querySelector(".delete-btn");

    editBtn.addEventListener("click", () => openEditModal(book));

    deleteBtn.addEventListener("click", () => deleteBook(book.bookId));

    tbody.appendChild(tr);
  });
}

function editBook(id) {
  console.log("Edit book:", id);
  // open modal, fill form, etc.
}

async function deleteBook(id) {
  const confirmDelete = confirm("Are you sure you want to delete this book?");
  if (!confirmDelete) return;

  const res = await fetch(`${API_URL}/books/deleteBook/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  alert(data.message);
  getBooks(); // refresh table
}

function openEditModal(book) {
  document.getElementById("editBookId").value = book.bookId;
  document.getElementById("editTitle").value = book.title;
  document.getElementById("editAuthor").value = book.author;
  document.getElementById("editCreatedAt").value = new Date(
    book.createdAt
  ).toLocaleString();
  document.getElementById("editIsBorrowed").value = book.isBorrowed;
  document.getElementById("editBorrowedBy").value = book.borrowedBy || "None";

  document.getElementById("editModal").style.display = "flex";
}

document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("editModal").style.display = "none";
});

async function submitEditBookForm() {
  const updatedBook = {
    title: document.getElementById("editTitle").value,
    author: document.getElementById("editAuthor").value,
  };

  const bookId = document.getElementById("editBookId").value;

  try {
    const res = await fetch(`${API_URL}/books/updateBook/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedBook),
    });

    const data = await res.json();
    alert(data.message);

    document.getElementById("editModal").style.display = "none";
    getBooks(); // reload table
  } catch (error) {
    console.error("Error updating book:", error);
    alert("Failed to update the book. Please try again.");
  }
}

// Attach the function to the form submit
document.getElementById("editBookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  submitEditBookForm();
});
