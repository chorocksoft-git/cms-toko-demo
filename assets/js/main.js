document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".toggle-buttons button");
  const predictionTitle = document.getElementById("prediction-title");
  const toggleAIPrediction =
    document.getElementsByClassName("highcharts-figure");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      if (this.id === "1h-button") {
        predictionTitle.textContent = "(1h)";
        toggleAIPrediction = true;
      } else if (this.id === "24h-button") {
        predictionTitle.textContent = "(24h)";
        oggleAIPrediction = false;
      }
    });
  });
});
