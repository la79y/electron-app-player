document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (username.trim() === "" || password.trim() === "") {
    alert("Username and password are required.");
    return;
  }

  const requestBody = {
    username: username,
    password: password,
  };

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("authToken", data.token);
      window.location.href = "../pages/list.html";
    })
    .catch((error) => {
      console.error("Error during login:", error);
      alert("Something went wrong, check your input and try again");
    });
});
