google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const actualPrices = data.week_price_chart;
      const predictedPrices = data.ai_price_chart;
      const errorBars = data.price_mape_list;
      const dates = Array.from({ length: actualPrices.length }, (_, i) => {
        const d = new Date();
        d.setHours(d.getHours() - (actualPrices.length - i));
        return d;
      });

      const chartData = [
        ["Date", "Actual Price", "Predicted Price", { role: "interval" }],
      ];
      for (let i = 0; i < actualPrices.length; i++) {
        chartData.push([
          dates[i],
          actualPrices[i],
          predictedPrices[i],
          errorBars[Math.floor(i / 7)],
        ]);
      }

      const dataTable = google.visualization.arrayToDataTable(chartData);

      const options = {
        curveType: "function",
        legend: { position: "top" },
        series: {
          0: { color: "#0000FF" },
          1: { color: "#FF0000", lineDashStyle: [4, 4] },
        },
        intervals: { style: "line" },
      };

      const chart = new google.visualization.LineChart(
        document.getElementById("chart_div")
      );
      chart.draw(dataTable, options);
    })
    .catch((error) => console.error("Error fetching data:", error));
}
