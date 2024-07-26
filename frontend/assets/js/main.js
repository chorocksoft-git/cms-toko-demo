document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".toggle-buttons button");
  const predictionTitle = document.getElementById("prediction-title");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      if (this.id === "1h-button") {
        predictionTitle.textContent = "(1h)";
        console.log("1h button clicked");
      } else if (this.id === "24h-button") {
        predictionTitle.textContent = "(24h)";
        console.log("24h button clicked");
      }
    });
  });
});
