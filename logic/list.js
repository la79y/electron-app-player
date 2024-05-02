const populateStreamList = async () => {
  const loadingIndicator = document.getElementById("loading");
  try {
    loadingIndicator.style.display = "block";
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      throw new Error("No authentication token found");
    }

    const response = await fetch("http://161.35.240.211:80/stream", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const liveStreams = result.data;

    const streamList = document.getElementById("stream-list");
    streamList.innerHTML = "";
    liveStreams.forEach((stream) => {
      const listItem = createStreamListItem(stream);
      streamList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Failed to load streams:", error);
  } finally {
    loadingIndicator.style.display = "none";
  }
};

// Function to create a list item for each live stream
function createStreamListItem(stream) {
  const listItem = document.createElement("li");
  const link = document.createElement("a");
  const message = document.createElement("span");
  message.className = "message";
  link.textContent = stream.name;
  if (stream?.isStreaming) {
    link.href = `../pages/player.html?id=${
      stream.name
    }&srtUrl=${encodeURIComponent(stream.playerUrl)}`;
  } else {
    message.textContent = "The stream has not started yet";
    link.href = "#";
    link.classList.add("disabled");
    link.onclick = function (event) {
      event.preventDefault();
      message.style.display = "inline";
    };
  }

  listItem.appendChild(link);
  listItem.appendChild(message);
  return listItem;
}

const button = document.getElementById("refresh-button");
button.addEventListener("click", function () {
  window.location.reload();
});

window.addEventListener("load", populateStreamList);
