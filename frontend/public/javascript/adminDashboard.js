const API_URL = "http://localhost:5000/api";

let currentUserPage = 1;
const usersPerPage = 5;

let currentBorrowedPage = 1;
const borrowedPerPage = 5;

async function getDashboardData() {
  document.getElementById("loadingDashboard").style.display = "block";

  const res_users = await fetch(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const res_books = await fetch(`${API_URL}/books/getBooks?page=1&limit=10`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const res_borrowed = await fetch(`${API_URL}/admin/borrowedBooks`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const dataUsers = document.querySelector("#dataUsers");
  const dataBooks = document.querySelector("#dataBooks");
  const dataBorrowed = document.querySelector("#dataBorrowed");

  const totalUsers = await res_users.json();
  const totalBooksData = await res_books.json();
  const totalBorrowed = await res_borrowed.json();

  console.log(totalUsers);

  dataUsers.innerHTML = totalUsers.totalUsers;

  dataBooks.innerHTML = totalBooksData.totalBooks ?? 0;

  dataBorrowed.innerHTML = totalBorrowed.totalBorrowed;

  console.log(totalBorrowed.totalBorrowed);
}

async function getUsers(page = 1) {
  currentUserPage = page;

  const res = await fetch(
    `${API_URL}/admin/users?page=${page}&limit=${usersPerPage}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const data = await res.json();
  const users = data.users || [];
  const totalUsers = data.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  if (!users.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="4" style="text-align: center; padding: 50px; font-family: 'Poppins'">No Users</td>
    `;
    tbody.appendChild(tr);
  } else {
    users.forEach((user) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.borrowedBooks.length}</td>
        <td><button onclick="deleteUser('${user._id}')">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  const paginationContainer = document.getElementById("usersPagination");
  paginationContainer.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Previous";
  prevBtn.disabled = page === 1;
  prevBtn.addEventListener("click", () => {
    if (currentUserPage > 1) getUsers(currentUserPage - 1);
  });
  paginationContainer.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === page;
    btn.addEventListener("click", () => getUsers(i));
    paginationContainer.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = page === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentUserPage < totalPages) getUsers(currentUserPage + 1);
  });
  paginationContainer.appendChild(nextBtn);

  document.getElementById("loadingDashboard").style.display = "none";
  document.getElementById("dashboardContainer").style.display = "block";
  document.getElementById("tableContainer").style.display = "flex";
}

async function deleteUser(userId) {
  try {
    const res = await fetch(`${API_URL}/admin/deleteUser/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error deleting user");
      return;
    }

    alert("User deleted successfully");
    window.location.reload();
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
}

async function getBorrowedBooks(page = 1) {
  try {
    const res = await fetch(
      `${API_URL}/admin/borrowedBooks?page=${page}&limit=${borrowedPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch borrowed books");

    const data = await res.json();
    const books = data.borrowedBooks || [];
    const totalBooks = data.totalBorrowed || 0;
    const totalPages = Math.ceil(totalBooks / borrowedPerPage);

    const tbody = document.querySelector("#bookTable tbody");
    tbody.innerHTML = "";

    if (books.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td colspan="4" style="text-align:center; padding: 50px;">
          No borrowed books
        </td>
      `;
      tbody.appendChild(tr);
    } else {
      books.forEach((book) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${book.title}</td>
          <td>${book.borrowedBy ? book.borrowedBy.name : ""}</td>
          <td>${book.borrowedAt}</td>
          <td><button onclick="returnBook(${
            book.bookId
          })">Returned</button></td>
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
      currentBorrowedPage = page - 1;
      getBorrowedBooks(currentBorrowedPage);
    });
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.disabled = i === page;
      btn.addEventListener("click", () => {
        currentBorrowedPage = i;
        getBorrowedBooks(i);
      });
      paginationContainer.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = page === totalPages;
    nextBtn.addEventListener("click", () => {
      currentBorrowedPage = page + 1;
      getBorrowedBooks(currentBorrowedPage);
    });
    paginationContainer.appendChild(nextBtn);
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
  }
}

async function returnBook(bookId) {
  try {
    const res = await fetch(`${API_URL}/admin/returnBook/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      alert("Book returned!");
      window.location.reload();
    } else {
      alert(data.error || "Failed to return book");
    }
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getDashboardData();
  getUsers();
  getBorrowedBooks();
});
