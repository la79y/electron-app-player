document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("signup-username").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
    alert("Username, email, and password are required.");
    return;
  }

  const requestBody = {
    username: username,
    email: email,
    password: password,
  };

  fetch("http://localhost:8080/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(() => {
      alert("Account created successfully. You can now log in.");
      window.location.href = "../pages/login.html";
    })
    .catch((error) => {
      error.json().then((err) => {
        alert("Error: " + err.error);
      });
    });
});
