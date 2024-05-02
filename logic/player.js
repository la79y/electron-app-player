const videoPlayer = document.getElementById("videoPlayer");

const populateStreamList = async () => {
  try {
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
    // Handle error (e.g., redirect to login page or show a message)
  }
};

document.getElementById("backButton").addEventListener("click", function () {
  window.history.back();
  populateStreamList();
});

function getQueryParams() {
  const queryParams = new URLSearchParams(window.location.search);
  return {
    id: queryParams.get("id"),
    srtUrl: queryParams.get("srtUrl"),
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const { id, srtUrl } = getQueryParams();

  if (!id || !srtUrl) {
    console.error("Missing stream ID or URL");
    return;
  }

  window.electronAPI
    .startStream(srtUrl)
    .then((streamUrl) => {
      videoPlayer.src = streamUrl;
    })
    .catch((err) => {
      console.error("Failed to start stream:", err);
    });
});
