const videoPlayer = document.getElementById("videoPlayer");

document.getElementById('backButton').addEventListener('click', function() {
    window.history.back();
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
