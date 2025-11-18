

async function loadCard() {
  const navbarContainer = document.getElementById("bookGrid");
  if (!navbarContainer) return console.error("Element #book-card not found");

  try {
    const res = await fetch("/frontend/components/card.html"); // relative path to HTML page
    if (!res.ok) throw new Error("Failed to fetch card.html");
    const html = await res.text();
    navbarContainer.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadCard);
