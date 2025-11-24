const API_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", loadProfile);

async function loadProfile() {
  try {
    const res = await fetch(`${API_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    document.getElementById("profileName").textContent = data.name;
    document.getElementById("profileEmail").textContent = data.email;
    document.getElementById("profileRole").textContent = data.role;
    document.getElementById("profileCreated").textContent =
      data.createdAt.split("T")[0];
    document.getElementById("borrowedCount").textContent =
      data.borrowedBooks.length;
  } catch (err) {
    console.error("Profile fetch error:", err);
  }
}

document.getElementById("editProfileBtn").onclick = () => {
  const newName = prompt("Enter new name:");
  const newEmail = prompt("Enter new email:");

  if (!newName || !newEmail) return;

  updateProfile(newName, newEmail);
};

async function updateProfile(name, email) {
  try {
    const res = await fetch(`${API_URL}/user/updateProfile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Profile updated!");
      loadProfile();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}

document.getElementById("changePasswordBtn").onclick = async () => {
  const current = prompt("Current password:");
  const newPass = prompt("New password:");

  if (!current || !newPass) return;

  try {
    const res = await fetch(`${API_URL}/user/changePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ current, newPass }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password changed!");
      window.location.href = "/frontend/src/pages/login.html";
    } else alert(data.message);
  } catch (err) {
    console.error(err);
  }
};
