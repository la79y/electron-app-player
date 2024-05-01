const populateStreamList = async () => {
  try {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      throw new Error("No authentication token found");
    }

    const response = await fetch("http://localhost:8080/stream", {
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
    // Handle error (e.g., redirect to login page or show a message)
  }
};

// Function to create a list item for each live stream
function createStreamListItem(stream) {
  const listItem = document.createElement("li");
  const link = document.createElement("a");
  link.textContent = stream.name;
  link.href = `../pages/player.html?id=${
    stream.name
  }&srtUrl=${encodeURIComponent(stream.playerUrl)}`;
  listItem.appendChild(link);
  return listItem;
}

window.addEventListener("load", populateStreamList);
