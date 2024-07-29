const price = document.querySelector("#price > .content");
const prediction = document.querySelector("#prediction > .content");
const predictionPercent = document.querySelector("#prediction > #percent");
const aveMape = document.querySelector("#ave-mape > .content");

function metricsData() {
  const now = priceData.week_price_chart[priceData.week_price_chart.length - 1];
  const next = priceData.ai_price_chart[priceData.ai_price_chart.length - 1];
  price.innerText = `Rp ${numberWithCommas(dropDecimalPoint(now, 3))}`;
  prediction.innerText = `Rp ${numberWithCommas(dropDecimalPoint(next, 3))}`;
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
    predictionPercent.classList.add("positive");
  } else {
    symbol = "▼";
    predictionPercent.classList.add("negative");
  }

  const formattedChange = Math.abs(percentageChange).toFixed(3);
  return `${symbol} ${formattedChange}%`;
}
