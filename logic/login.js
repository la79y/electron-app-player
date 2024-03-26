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

  fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data && data.error) {
        throw new Error(data.error);
      } else {
        localStorage.setItem("authToken", data.token);
        window.location.href = "../pages/list.html";
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      alert(error);
    });
});

// Add event listener for "Forgot Password" link to display modal
document
  .getElementById("forgot-password-link")
  .addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("forgotPasswordModal").style.display = "block";
  });

// Add event listener for closing the modal
document
  .getElementsByClassName("close")[0]
  .addEventListener("click", function () {
    document.getElementById("forgotPasswordModal").style.display = "none";
  });

// Add event listener for submitting the "Forgot Password" form
document
  .getElementById("forgot-password-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;

    // Send request to reset password
    fetch("http://localhost:8080/reset-password-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data && data.error) {
          throw new Error(data.error);
        } else {
          alert(data.message);
          document.getElementById("forgotPasswordModal").style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error during password reset request:", error);
        alert(error);
      });
  });
