const API_URL = "http://localhost:5000/api"

async function loadBorrowedBooks() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return alert("User not logged in");

        const res = await fetch("/user/userBooks", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        displayBooks(data.borrowedBooks)
    } catch (error) {
        console.error("Error fetching books: ", error);
    }
}

window.onload = loadBorrowedBooks;

window.onload = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in first");
    window.location.href = "login.html";
  }
};

function displayBooks() {
    const grid = document.getElementById("bookGrid");
    grid.innerHTML = "";

    books.forEach(book => {
        const card = document.createElement("div");
        card.classList.add("book-card");

        card.innerHTML = `
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</P>
            <P>Date Borrowed: ${new Date(book.dateBorrowed).toLocaleDateString()}</p>
        `;

        grid.appendChild(card);
    });
}
