const API_URL = "https://ajinlib.onrender.com/api";

document.addEventListener("DOMContentLoaded", loadBorrowedBooks);

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
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Status:", res.status);

    const data = await res.json();

    console.log("API Response:", data);

    if (!data.borrowedBooks) {
      document.getElementById("borrowedList").innerHTML =
        "<p>No borrowed books.</p>";
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
  container.style.justifyContent = "center";

  container.innerHTML = books
    .map(
      (book) => `
    <div class="book-card">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">Author: ${book.author}</p>
      <p class="book-info">Date Borrowed: ${new Date(
        book.dateBorrowed
      ).toLocaleDateString()}</p>
    </div>
  `
    )
    .join("");

  const numBooks = books.length;
  const columns = Math.min(numBooks, 3);
  container.style.gridTemplateColumns = `repeat(${columns}, auto)`;
  container.style.gap = "20px";

  let cardWidth, padding, fontSize;
  if (numBooks === 1) {
    cardWidth = 400;
    padding = 30;
    fontSize = "1.8rem";
  } else if (numBooks === 2) {
    cardWidth = 350;
    padding = 25;
    fontSize = "1.6rem";
  } else if (numBooks === 3) {
    cardWidth = 300;
    padding = 18;
    fontSize = "1.2rem";
  }

  document.querySelectorAll(".book-card").forEach((card) => {
    card.style.width = `${cardWidth}px`;
    card.style.padding = `${padding}px`;
    card
      .querySelectorAll("h3, p")
      .forEach((el) => (el.style.fontSize = fontSize));
  });
}
