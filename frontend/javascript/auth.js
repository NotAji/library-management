const API_URL = "http://localhost:5000/api/user";

// REGISTER
if (document.querySelector(".register-form")) {
  document.querySelector(".register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    document.getElementById("msg").textContent = data.message || data.error;

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    }
  });
}

// LOGIN
if (document.querySelector(".loginForm")) {
  document.querySelector(".loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    document.getElementById("msg").textContent = data.message || data.error;

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    }
  });
}
