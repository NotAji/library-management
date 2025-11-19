const API_URL = "http://localhost:5000/api"

async function loadBorrowedBooks() {
    console.log("🚀 loadBorrowedBooks() triggered");
  const token = localStorage.getItem("token");
   console.log("Token:", token);
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/user/userBooks`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    console.log("Status:", res.status);

    const data = await res.json();

    console.log("API Response:", data);

    if (!data.borrowedBooks) {
      document.getElementById("borrowedList").innerHTML = "<p>No borrowed books.</p>";
      return;
    }

    displayBorrowedBooks(data.borrowedBooks);

  } catch (err) {
    console.error(err);
  }
}

window.onload = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in first");
    window.location.href = "login.html";
  }
};

function displayBorrowedBooks(books) {
  const container = document.getElementById("borrowedList");

  if (!books || books.length === 0) {
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.innerHTML = `<p class="noBorrowed">No borrowed books.</p>`;
    return;
  }

  container.style.display = "grid";
  container.innerHTML = books.map(book => `
    <div class="book-card">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">Author: ${book.author}</p>
      <p class="book-info">Date Borrowed: ${new Date(book.dateBorrowed).toLocaleDateString()}</p>
    </div>
  `).join("");

  const numBooks = books.length;

  // Dynamically calculate columns and card width
  let columns = Math.min(numBooks, 3);        // max 3 columns
  let cardWidth = Math.max(150, 400 - numBooks * 30); // shrink as more books added

  container.style.gridTemplateColumns = `repeat(${columns}, ${cardWidth}px)`;

  // Optional: adjust card widths
  document.querySelectorAll(".book-card").forEach(card => {
    card.style.width = `${cardWidth}px`;
  });
}



document.addEventListener("DOMContentLoaded", loadBorrowedBooks);