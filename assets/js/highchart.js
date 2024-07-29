const HOUR = "1D";
const DAY = "7D";

const ONE_HOUR = 1000 * 60 * 60;
const TEN_MINUTES = 1000 * 60 * 10;
const tickInterval = ONE_HOUR;

let priceData = {};
let period = "1D";

const createChartData = () => {
  const {
    week_price_chart: weekPriceChart,
    ai_price_chart: aiPriceChart,
    timecode_datetime: timecodeDatetime,
    is_same_timecode: isSameTimecode,
  } = priceData;
  const timeCode = timecodeDatetime?.split(" ").join("T");
  const now = new Date(timeCode);
  const baseTime = new Date(timeCode).setHours(
    period === HOUR
      ? now.getHours() - 24
      : now.getHours() - weekPriceChart.length + 1
  );
  const calcWeepPrice =
    period === HOUR ? weekPriceChart.slice(-24) : weekPriceChart;
  const calcAiPrice = period === HOUR ? aiPriceChart.slice(-25) : aiPriceChart;
  const lastAiPricePoint = aiPriceChart[aiPriceChart.length - 1];
  return {
    is_same_timecode: isSameTimecode,
    last_ai_price_point: [
      period === HOUR
        ? (parseInt(baseTime / tickInterval, 10) + (24 + 1)) * tickInterval +
          parseInt((baseTime % tickInterval) / TEN_MINUTES, 10) * TEN_MINUTES
        : (parseInt(baseTime / tickInterval, 10) + 170) * tickInterval +
          parseInt((baseTime % tickInterval) / TEN_MINUTES, 10) * TEN_MINUTES,
      lastAiPricePoint,
    ],
    week_price_chart: calcWeepPrice.map((price, idx) => {
      return [
        period === HOUR
          ? (parseInt(baseTime / tickInterval, 10) + (idx + 1)) * tickInterval +
            parseInt((baseTime % tickInterval) / TEN_MINUTES, 10) * TEN_MINUTES
          : (parseInt(baseTime / tickInterval, 10) + idx) * tickInterval +
            parseInt((baseTime % tickInterval) / TEN_MINUTES, 10) * TEN_MINUTES,
        price,
      ];
    }),

    ai_price_chart: calcAiPrice.map((price, idx) => {
      return [
        period === HOUR
          ? (parseInt(baseTime / tickInterval, 10) + (idx + 1)) * tickInterval +
            parseInt((baseTime % tickInterval) / TEN_MINUTES, 10) * TEN_MINUTES
          : (parseInt(baseTime / tickInterval, 10) + idx) * tickInterval +
            parseInt((baseTime % tickInterval) / TEN_MINUTES, 10) * TEN_MINUTES,
        price,
      ];
    }),
  };
};

const findMinValue = (...dataArrays) => {
  return Math.min(...dataArrays.flat().map((point) => point[1]));
};

function chartDraw({
  week_price_chart: weekPriceData,
  ai_price_chart: aiPriceData,
  last_ai_price_point: lastAiPricePoint,
}) {
  const minValue = findMinValue(weekPriceData, aiPriceData);
  const { format } = dateFns;
  const ccName = priceData.cc_code;

  Highcharts.chart("container", {
    chart: {
      backgroundColor: "rgba(255, 255, 255, 0)",
      type: "areaspline",
      height: 600,
      spacingRight: 0,
      spacingLeft: 0,
      style: {
        fontSize: "13px",
      },
    },
    stockTools: {
      gui: {
        enabled: false,
      },
    },
    title: {
      text: "",
    },
    subtitle: {
      text: "",
    },
    rangeSelector: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      labels: {
        formatter() {
          return format(new Date(this.value), "MM-dd HH:mm");
        },
      },
      allowDecimals: false,
      endOnTick: false,
      ordinal: false,
      startOnTick: false,
    },
    yAxis: [
      {
        tickAmount: 10,
        labels: {
          formatter() {
            return numberWithCommas(this.value);
          },
        },
        title: {
          text: "",
          margin: 0,
        },
        zIndex: 0,
        gridLineWidth: 1,
        offset: 30,
        opposite: true,
        min: minValue - 300,
        startOnTick: false,
      },
    ],

    legend: {
      layout: "horizontal",
      align: "left",
      verticalAlign: "top",
      itemStyle: {
        fontWeight: 400,
        fontSize: "13px",
        textShadow: "none",
      },
      itemHoverStyle: {
        textShadow: "0 4px 4px rgba(0, 0, 0, 0.3)",
      },
      symbolHeight: 10,
      symbolWidth: 10,

      labelFormatter: function () {
        return `<span style="color:${this.color}">${this.name}</span>`;
      },
    },

    tooltip: {
      crosshairs: true,
      split: true,
      formatter: function (tooltip) {
        const { x, points, color } = this;
        console.log("color", color);
        console.log("points", points);
        const formatHtml = tooltip.defaultFormatter.call(this, tooltip);
        return formatHtml.map((html, idx, arr) => {
          if (html === "") return "";

          if (idx === 0)
            return `<span style="font-size: 10px">${format(
              x,
              "yyyy-MM-dd HH:mm"
            )}</span><br/>`;
          return `<span style="color:${color}">●</span>
          <b style="font-weight: 400; font-size: 11px;">${ccName}: </b> 
           <b style="font-weight: 700">Rp ${numberWithCommas(
             dropDecimalPoint(points[idx - 1].y)
           )}</b><br/>`;
        });
      },
      shared: true,
      borderWidth: 1,
      borderColor: this.color,
      borderRadius: 4,
      useHTML: true,
      style: {
        fontSize: "12px",
      },
    },
    plotOptions: {
      areaspline: {
        marker: {
          radius: 3,
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 4,
          },
        },
        threshold: null,
      },

      line: {
        dataLabels: {
          enabled: true,
          formatter: function () {
            return `   <div style="width:80px; hegint:40px; padding: 8px; border-radius: 3px; background-color: white; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <span style="color:${this.color}">●</span>
            <b style="font-weight: 400; font-size: 11px;">${ccName}: </b> 
            <b style="font-weight: 700">Rp ${numberWithCommas(
              dropDecimalPoint(this.y)
            )}</b>
            </div>
            `;
          },
          style: {
            color: "black",
            fontSize: "12px",
          },
        },
      },
    },
    series: [
      {
        name: "Price Trend",
        data: weekPriceData,
        color: "#40A942",
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, "rgba(69, 179, 65, 0.2)"],
            [1, "rgba(69, 179, 65, 0.1)"],
          ],
        },
      },

      {
        name: "Prediction Trend",
        data: aiPriceData,

        color: "#A6CBDE",
        fillColor: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, "rgba(175, 209, 227, 0.5)"],
            [1, "rgba(175, 209, 227, 0.1)"],
          ],
        },
      },
      {
        name: "1h Prediction",
        type: "line",
        data: [lastAiPricePoint],
        color: "#007EC8",
        marker: {
          symbol: "circle",
          radius: 20,
          fillColor: {
            radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
            stops: [
              [0, "rgba(0, 126, 200, 1)"],
              [0.3, "rgba(101, 193, 247, 0.7)"],
              [0.7, "rgba(101, 193, 247, 0.3)"],
              [1, "rgba(255, 255, 255, 0.3)"],
            ],
          },
          filter: "url(#blur)",
        },
      },
    ],
  });
}

async function init() {
  const activeTab = document.querySelector("header .tab.active");
  const activeData = activeTab.getAttribute("data-value");

  const response = await fetch(
    `https://api.coinmarketscore.io/api/v2/toko-demo/${activeData}`
  );
  const data = await response.json();
  console.log(data);

  //수집된 데이터를 전역에서 관리
  priceData = data;

  currentPage = 0;
  loadListData();
  metricsData();

  const chartData = createChartData();
  chartDraw(chartData);
}

init();
