const API_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  addBook();
  getBooks();
});

function addBook() {
  const addBookModal = document.getElementById("addBookModal");
  const openAddBtn = document.getElementById("addBook");
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
          getBooks();
        } else {
          alert(data.error || "Failed to add book");
        }
      } catch (error) {
        console.error(error);
      }
    });
}

let currentPage = 1;
let limit = 7;

async function getBooks(page = 1) {
  const table = document.getElementById("booksTable");
  table.style.display = "none";

  const res = await fetch(
    `${API_URL}/books/getBooks?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const data = await res.json();
  const books = data.books;

  const tbody = document.querySelector("#booksTable tbody");
  tbody.innerHTML = "";

  if (!books.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="7" style="text-align:center; padding:100px; font-family: 'Poppins">
        No Books Available
      </td>
    `;
    tbody.appendChild(tr);
    table.style.display = "table";
    return;
  }

  books.forEach((book) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
          <td>${book.bookId}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.createdAt}</td>
          <td>${book.isBorrowed}</td>
          <td>${book.borrowedBy ? book.borrowedBy.name : ""}</td>
          <td class="actions">
    <button class="edit-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 3.487a2.127 2.127 0 113.01 3.01L7.5 18.87l-4 1 1-4L16.862 3.487z" />
      </svg></button>

    <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12M9 7V4h6v3m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
      </svg></button>
  </td>
          `;

    const editBtn = tr.querySelector(".edit-btn");
    const deleteBtn = tr.querySelector(".delete-btn");

    editBtn.addEventListener("click", () => openEditModal(book));

    deleteBtn.addEventListener("click", () => deleteBook(book.bookId));

    tbody.appendChild(tr);
  });
  table.style.display = "table";

  setupPagination(data.currentPage, data.totalPages);
}

function setupPagination(currentPage, totalPages) {
  const pageInfo = document.getElementById("pageNumbers");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  pageInfo.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.add("page-btn");

    if (i === currentPage) {
      btn.disabled = true;
      btn.style.fontWeight = "bold";
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      getBooks(currentPage);
    });

    pageInfo.appendChild(btn);
  }

  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      getBooks(currentPage);
    }
  };

  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      getBooks(currentPage);
    }
  };
}

function editBook(id) {
  console.log("Edit book:", id);
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
  document.getElementById("editIsBorrowed").value = book.isBorrowed
    ? "Yes"
    : "No";
  document.getElementById("editBorrowedBy").value =
    book.borrowedBy?.name || "None";

  document.getElementById("editModal").style.display = "flex";
}

document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("editModal").style.display = "none";
});

async function submitEditBookForm() {
  const bookId = Number(document.getElementById("editBookId").value);
  console.log(bookId);
  const updatedBook = {
    title: document.getElementById("editTitle").value,
    author: document.getElementById("editAuthor").value,
  };

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
    getBooks();
  } catch (error) {
    console.error("Error updating book:", error);
    alert("Failed to update the book. Please try again.");
  }
}

document.getElementById("editBookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  submitEditBookForm();
});
