const API_URL = "https://ajinlib.onrender.com";

async function apiRequest(path, method = "GET", body = null, auth = false) {
  const headers = { content_type: "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");

    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${path}`, options);
  return res.json();
}
