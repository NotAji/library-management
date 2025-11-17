

async function loadHeader() {
  const navbarContainer = document.getElementById("header");
  const html = await fetch("/frontend/components/header.html").then(res => res.text());
  navbarContainer.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", loadHeader);