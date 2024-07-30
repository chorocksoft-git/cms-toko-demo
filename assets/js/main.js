document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".toggle-buttons button");
  const periodMap = {
    "1h-button": "1D",
    "24h-button": "7D",
  };

  const updateChart = (period) => {
    const scrollPosition = window.scrollY; // 스크롤 위치 저장
    const chartData = createChartData(period);
    chartDraw(chartData);
    window.scrollTo(0, scrollPosition); // 스크롤 위치 복원
  };

  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      buttons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      const period = periodMap[this.id];
      if (period) updateChart(period);
    });
  });
});
