document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".toggle-buttons button");
  const predictionTitle = document.getElementById("prediction-title");
  const toggleAIPrediction =
    document.getElementsByClassName("highcharts-figure");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      console.log("button.addEventListener", this.id);
      buttons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      if (this.id === "1h-button") {
        predictionTitle.textContent = "(1h)";
        console.log("1h-button");
        // toggleAIPrediction = true;
        const chartData = createChartData("1D");
        chartDraw(chartData);
      } else if (this.id === "24h-button") {
        predictionTitle.textContent = "(24h)";
        console.log("24h-button");
        // toggleAIPrediction = false;
        const chartData = createChartData("7D");
        chartDraw(chartData);
      }
    });
  });
});
