let currentPage = 0;
const itemsPerPage = 3;
const initPage = 6;
const footer = document.querySelector(".footer");
const footerTitle = document.querySelector(".footer > .footer-title");
const listContainer = document.getElementById("price-list");

function addComma(price) {
  price = price.toFixed(3);
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function loadListData() {
  const start = (currentPage !== 0 ? initPage : 0) + currentPage * itemsPerPage;
  const end = (currentPage === 0 ? initPage : 0) + start + itemsPerPage;
  const currentData = priceData.mape_ai_price_chat.slice(start, end);

  if (currentPage === 0) {
    listContainer.innerHTML = "";
  }

  const voidDataLength =
    priceData.mape_ai_price_chat.length - priceData.mape_week_price_chat.length;

  const { format } = dateFns;

  currentData.forEach((item, index) => {
    const globalIndex = start + index;
    const row = document.createElement("div");
    row.className = "time-list-row";

    const notVoidData = globalIndex - voidDataLength >= 0;

    // const timeDiv = document.createElement("div");
    // const timeSpan = document.createElement("span");
    // timeSpan.textContent = `${globalIndex}0 minutes ago`;
    // timeDiv.appendChild(timeSpan);

    const timeRangeDiv = document.createElement("div");
    const timeRangeSpan = document.createElement("span");

    let endTime = new Date(priceData.timecode_datetime);
    endTime.setMinutes(
      Math.floor(endTime.getMinutes() / 10) * 10 - globalIndex * 10
    );
    endTime.setHours(endTime.getHours() + 1);

    let startTime = new Date(endTime);
    startTime.setHours(startTime.getHours() - 1);
    // startTime.setMinutes(startTime.getMinutes() - 10);

    //at 05/07 14:20, predicted the price for 05/07 15:20
    timeRangeSpan.innerHTML = `predicted the price for <span style="font-weight: 700;">${format(
      endTime,
      "MM/dd HH:mm"
    )}</span> at ${format(startTime, "MM/dd HH:mm")}`;
    timeRangeDiv.appendChild(timeRangeSpan);

    //actualPrice
    const actualPriceDiv = document.createElement("div");
    const actualPriceSpan = document.createElement("span");

    actualPriceSpan.innerHTML = notVoidData
      ? `Rp ${numberWithCommas(
          dropDecimalPoint(priceData.mape_week_price_chat[globalIndex - 6], 3)
        )}`
      : "<span style='color: #999999'>to be determined</span>";
    actualPriceDiv.appendChild(actualPriceSpan);

    //predictedPrice
    const predictedPriceDiv = document.createElement("div");
    const predictedPriceSpan = document.createElement("span");

    predictedPriceSpan.className = "bold";
    predictedPriceSpan.textContent = `Rp ${numberWithCommas(
      dropDecimalPoint(priceData.mape_ai_price_chat[globalIndex], 3)
    )}`;
    predictedPriceDiv.appendChild(predictedPriceSpan);

    //AccuracyDiv
    const AccuracyDiv = document.createElement("div");
    const AccuracySpan = document.createElement("span");
    AccuracySpan.innerHTML = notVoidData
      ? `${priceData.price_mape_list[globalIndex - 6].toFixed(2)}%`
      : "<span style='color: #999999'>to be determined</span>";
    AccuracyDiv.appendChild(AccuracySpan);

    // const aveMapeDiv = document.createElement("div");
    // const aveMapeSpan = document.createElement("span");
    // aveMapeSpan.textContent = `${item.toFixed(3)}%`;
    // aveMapeDiv.appendChild(aveMapeSpan);

    // row.appendChild(timeDiv);
    row.appendChild(timeRangeDiv);
    row.appendChild(actualPriceDiv);
    row.appendChild(predictedPriceDiv);
    row.appendChild(AccuracyDiv);
    // row.appendChild(aveMapeDiv);

    listContainer.appendChild(row);
  });

  currentPage++;

  const nextData = priceData.mape_ai_price_chat.slice(end, end + itemsPerPage);
  console.log("nextData", nextData);
  console.log("nextData", nextData);
  if (nextData.length === 0) {
    if (footerTitle.classList.contains("down")) {
      // footer.style.display = "none";
      footerTitle.classList.remove("down");
      footerTitle.classList.add("up");
      footerTitle.innerHTML = "reset";
      currentPage = 0;
    }
  } else if (footerTitle.classList.contains("up")) {
    footerTitle.classList.remove("up");
    footerTitle.classList.add("down");
    footerTitle.innerHTML = "see more";
  }
}

function formatDateTime(date) {
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
}
