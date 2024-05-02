const populateStreamList = async () => {
  const loadingIndicator = document.getElementById("loading");
  try {
    loadingIndicator.style.display = "block";
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      throw new Error("No authentication token found");
    }

    const response = await fetch("https://la79y.com/stream", {
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
  link.textContent = stream.name;
  if (stream?.isStreaming) {
    link.href = `../pages/player.html?id=${
      stream.name
    }&srtUrl=${encodeURIComponent(stream.playerUrl)}`;
    listItem.appendChild(link);
  }

  return listItem;
}

const button = document.getElementById("refresh-button");
button.addEventListener("click", function () {
  window.location.reload();
});

window.addEventListener("load", populateStreamList);
