const API_URL = "http://localhost:5000/api";
let currentBookPage = 1;
const booksPerPage = 7;

async function getAvailableBooks(page = 1) {
  try {
    const res = await fetch(
      `${API_URL}/books/available?page=${page}&limit=${booksPerPage}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res.ok) throw new Error("Books not found");

    const data = await res.json();
    const books = data.books || [];
    const totalBooks = data.totalBooks || 0;
    const totalPages = Math.ceil(totalBooks / booksPerPage);

    const tbody = document.querySelector("#bookTable tbody");
    tbody.innerHTML = "";

    if (!books.length) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td colspan="5" style="text-align:center; padding:100px; font-family:'Poppins'">
          No Books Available
        </td>
      `;
      tbody.appendChild(tr);
    } else {
      books.forEach((book) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${book.bookId}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.createdAt}</td>
          <td><button onclick="borrowBook(${book.bookId})">Borrow</button></td>
        `;
        tbody.appendChild(tr);
      });
    }

    const paginationContainer = document.getElementById("booksPagination");
    paginationContainer.innerHTML = "";

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Previous";
    prevBtn.disabled = page === 1;
    prevBtn.addEventListener("click", () => {
      if (currentBookPage > 1) {
        currentBookPage--;
        getAvailableBooks(currentBookPage);
      }
    });
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.disabled = i === page;
      btn.addEventListener("click", () => {
        currentBookPage = i;
        getAvailableBooks(i);
      });
      paginationContainer.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = page === totalPages;
    nextBtn.addEventListener("click", () => {
      if (currentBookPage < totalPages) {
        currentBookPage++;
        getAvailableBooks(currentBookPage);
      }
    });
    paginationContainer.appendChild(nextBtn);
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
      getAvailableBooks(currentBookPage);
    } else {
      alert(data.message || "Failed to borrow book");
    }
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  getAvailableBooks(currentBookPage);
});
