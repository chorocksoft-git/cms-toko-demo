const price = document.querySelector("#price > .content");
const prediction = document.querySelector("#prediction > .content");
const predictionPercent = document.querySelector("#prediction > #percent");
const aveMape = document.querySelector("#ave-mape > .content");

function metricsData() {
  const now = priceData.week_price_chart[priceData.week_price_chart.length - 1];
  const next = priceData.ai_price_chart[priceData.ai_price_chart.length - 1];
  price.innerText = `Rp${addComma(now)}`;
  prediction.innerText = `Rp${addComma(next)}`;
  aveMape.innerText = `${priceData.price_mape_avg.toFixed(3)}%`;

  predictionPercent.innerText = formatPercentageChange(
    calculatePercentage(now, next)
  );
}

function calculatePercentage(now, next) {
  return ((next - now) / next) * 100;
}

function formatPercentageChange(percentageChange) {
  let symbol = "-";
  if (percentageChange >= 0) {
    symbol = "▲";
    predictionPercent.className = "";
    predictionPercent.classList.add("positive");
  } else {
    symbol = "▼";
    predictionPercent.className = "";
    predictionPercent.classList.add("negative");
  }

  const formattedChange = Math.abs(percentageChange).toFixed(3);
  return `${symbol} ${formattedChange}%`;
}
