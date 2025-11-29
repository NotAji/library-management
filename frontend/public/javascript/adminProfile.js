const API_URL = "https://ajinlib.onrender.com/api";

const editProfileBtn = document.getElementById("editProfileBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");

const editProfileModal = document.getElementById("editProfileModal");
const changePasswordModal = document.getElementById("changePasswordModal");

const closeEditProfile = document.getElementById("closeProfileModal");
const closePasswordModal = document.getElementById("closePasswordModal");

const saveProfileBtn = document.getElementById("saveProfileBtn");
const savePasswordBtn = document.getElementById("savePasswordBtn");

const nameField = document.getElementById("profileName");
const emailField = document.getElementById("profileEmail");
const roleField = document.getElementById("profileRole");
const sinceField = document.getElementById("profileCreated");
const borrowedField = document.getElementById("borrowedCount");

const editNameInput = document.getElementById("editName");
const editEmailInput = document.getElementById("editEmail");

const oldPassInput = document.getElementById("oldPassword");
const newPassInput = document.getElementById("newPassword");

async function loadProfile() {
  try {
    const res = await fetch(`${API_URL}/admin/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const user = await res.json();

    nameField.textContent = user.name;
    emailField.textContent = user.email;
    roleField.textContent = user.role || "User";
    sinceField.textContent = user.createdAt?.split("T")[0];
    borrowedField.textContent = `${user.borrowedBooks?.length || 0} / 6`;
  } catch (err) {
    console.error("Error loading profile:", err);
  }
}

loadProfile();

editProfileBtn.onclick = () => {
  editProfileModal.classList.add("open");
};

changePasswordBtn.onclick = () => {
  changePasswordModal.classList.add("open");
};

closeEditProfile.onclick = () => {
  editProfileModal.classList.remove("open");
};

closePasswordModal.onclick = () => {
  changePasswordModal.classList.remove("open");
};

saveProfileBtn.onclick = async () => {
  const newName = editNameInput.value.trim();
  const newEmail = editEmailInput.value.trim();

  if (!newName || !newEmail) {
    alert("All fields are required.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/user/updateProfile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: newName, email: newEmail }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Profile updated successfully!");
    editProfileModal.classList.remove("open");
    loadProfile();
  } catch (err) {
    console.error("Profile update error:", err);
  }
};

savePasswordBtn.onclick = async () => {
  const oldPass = oldPassInput.value.trim();
  const newPass = newPassInput.value.trim();

  if (!oldPass || !newPass) {
    alert("Both fields are required.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/user/changePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    if (res.ok) {
      alert("Password changed successfully!");
      changePasswordModal.classList.remove("open");
      oldPassInput.value = "";
      newPassInput.value = "";
      window.location.href = "/frontend/src/pages/login.html";
    }
  } catch (err) {
    console.error("Password change error:", err);
  }
};
