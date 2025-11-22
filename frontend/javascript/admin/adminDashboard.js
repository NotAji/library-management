async function loadAdminHeader() {
  const navbarContainer = document.getElementById("header");
  const html = await fetch("/frontend/components/admin/adminHeader.html").then(
    (res) => res.text()
  );
  navbarContainer.innerHTML = html;

  const logoutBtn = document.querySelector("#logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", loadAdminHeader);

async function getDashboardData() {}
