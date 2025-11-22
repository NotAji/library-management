const API_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  getDashboardData();
  getUsers();
  getBorrowedBooks();
});

async function getDashboardData() {
  document.getElementById("loadingDashboard").style.display = "block";

  const res_users = await fetch(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const res_books = await fetch(`${API_URL}/books/getBooks`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const res_borrowed = await fetch(`${API_URL}/admin/borrowedBooks`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const totalUsers = await res_users.json();
  const totalBooks = await res_books.json();
  const totalBorrowed = await res_borrowed.json();

  const dataUsers = document.querySelector("#dataUsers");
  const dataBooks = document.querySelector("#dataBooks");
  const dataBorrowed = document.querySelector("#dataBorrowed");

  dataUsers.innerHTML = totalUsers.length;
  dataBooks.innerHTML = totalBooks.length;
  dataBorrowed.innerHTML = totalBorrowed.length;
}

async function getUsers() {
  const res = await fetch(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const users = await res.json();

  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  users.forEach((user) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.borrowedBooks.length}</td>`;

    tbody.appendChild(tr);
  });

  document.getElementById("loadingDashboard").style.display = "none";
  document.getElementById("dashboardContainer").style.display = "block";
  document.getElementById("tableContainer").style.display = "flex";
}

async function getBorrowedBooks() {
  const res = await fetch(`${API_URL}/admin/borrowedBooks`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const books = await res.json();

  const tbody = document.querySelector("#bookTable tbody");
  tbody.innerHTML = "";

  books.forEach((book) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
          <td>${book.title}</td>
          <td>${book.borrowedBy}</td>
          <td>${book.borrowedAt}</td>
          <td><button>Returned</button></td>`;

    tbody.appendChild(tr);
  });
}
