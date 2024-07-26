const now = new Date();
let currentPage = 0;
const itemsPerPage = 3;
const footer = document.querySelector(".footer");

function loadListData() {
  const listContainer = document.getElementById("price-list");

  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const currentData = priceData.price_mape_list.slice(start, end);

  currentData.forEach((item, index) => {
    const globalIndex = start + index;
    if (!priceData.is_same_timecode && index === 0) {
      return;
    }
    const time = priceData.is_same_timecode ? globalIndex + 1 : globalIndex;
    const row = document.createElement("div");
    row.className = "time-list-row";

    const timeDiv = document.createElement("div");
    const timeSpan = document.createElement("span");
    timeSpan.textContent = `${time}0 분 전`;
    timeDiv.appendChild(timeSpan);

    const timeRangeDiv = document.createElement("div");
    const timeRangeSpan = document.createElement("span");

    let endTime = new Date(now);
    endTime.setMinutes(Math.floor(endTime.getMinutes() / 10) * 10 - time * 10);

    let startTime = new Date(endTime);
    startTime.setMinutes(startTime.getMinutes() - 10);

    timeRangeSpan.textContent = `${formatDateTime(
      startTime
    )} ~ ${formatDateTime(endTime)}`;
    timeRangeDiv.appendChild(timeRangeSpan);

    const actualPriceDiv = document.createElement("div");
    const actualPriceSpan = document.createElement("span");
    actualPriceSpan.textContent = `Rp${priceData.mape_week_price_chat[index]}`;
    actualPriceDiv.appendChild(actualPriceSpan);

    const predictedPriceDiv = document.createElement("div");
    const predictedPriceSpan = document.createElement("span");
    // predictedPriceDiv.className = "text-start";
    predictedPriceSpan.className = "bold";
    predictedPriceSpan.textContent = `Rp${priceData.mape_ai_price_chat[index]}`;
    predictedPriceDiv.appendChild(predictedPriceSpan);

    const aveMapeDiv = document.createElement("div");
    const aveMapeSpan = document.createElement("span");
    aveMapeSpan.textContent = `${item.toFixed(3)}%`;
    aveMapeDiv.appendChild(aveMapeSpan);

    row.appendChild(timeDiv);
    row.appendChild(timeRangeDiv);
    row.appendChild(actualPriceDiv);
    row.appendChild(predictedPriceDiv);
    row.appendChild(aveMapeDiv);

    listContainer.appendChild(row);
  });

  currentPage++;

  const nextData = priceData.price_mape_list.slice(end, end + itemsPerPage);
  if (nextData.length === 0) {
    if (footer) {
      footer.remove();
    }
  }
}

function formatDateTime(date) {
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
}