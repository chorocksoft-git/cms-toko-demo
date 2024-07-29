document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".toggle-buttons button");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      if (this.id === "1h-button") {
        period = "1D";
        const chartData = createChartData("1D");
        chartDraw(chartData);
      } else if (this.id === "24h-button") {
        period = "7D";
        const chartData = createChartData("7D");
        chartDraw(chartData);
      }
    });
  });
});
