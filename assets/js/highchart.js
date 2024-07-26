const TEN_MINUTES = 10 * 60 * 1000;
const tickInterval = TEN_MINUTES;

const createChartData = (data) => {
  const {
    week_price_chart: weekPriceChart,
    week_volume_chart: weekVolumeChart,
    ai_price_chart: aiPriceChart,
    ai_volume_chart: aiVolumeChart,
    timecode_datetime: timecodeDatetime,
    is_same_timecode: isSameTimecode,
  } = data;
  const baseTime = new Date(timecodeDatetime).getTime();
  console.log("baseTime", baseTime);

  const generateTimestamps = (count) => {
    return Array.from({ length: count }, (_, i) => baseTime + i * TEN_MINUTES);
  };

  const timestamps = generateTimestamps(12);

  const calcWeepPrice = weekPriceChart.slice(-24);
  const calcWeepVolume = weekVolumeChart.slice(-24);

  const calcAiPrice = aiPriceChart.slice(-24);
  const lastAiPricePoint = aiPriceChart[aiPriceChart.length - 1];

  return {
    is_same_timecode: isSameTimecode,
    timestamps,
    week_price_chart: calcWeepPrice.map((price, idx) => [idx, price]),
    week_volume_chart: calcWeepVolume.map((volume, idx) => [idx, volume]),
    ai_price_chart: calcAiPrice.map((price, idx) => [idx, price]),
    last_ai_price_point: [calcAiPrice.length, lastAiPricePoint],
  };
};

(async () => {
  const response = await fetch("data.json");
  const data = await response.json();
  const { format } = dateFns;

  const chartData = createChartData(data);
  const {
    week_price_chart: weekPriceData,
    ai_price_chart: aiPriceData,
    last_ai_price_point: lastAiPricePoint,
    timestamps,
  } = chartData;

  console.log("weekPriceData", weekPriceData);
  console.log("aiPriceData", aiPriceData);
  console.log("lastAiPricePoint", lastAiPricePoint);

  Highcharts.chart("container", {
    chart: {
      backgroundColor: "rgba(255, 255, 255, 0)",
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

    xAxis: {
      type: "datetime",
      labels: {
        formatter() {
          return format(new Date(this.value), "MM-dd HH:mm");
        },
      },
      tickInterval: TEN_MINUTES,
      categories: timestamps,
    },
    yAxis: [
      {
        labels: {
          format: `{value}`,
        },
        title: {
          text: "",
          margin: 0,
        },
        height: "30%",
        top: "70%",
        zIndex: 0,
        gridLineWidth: 0,
        offset: 30,
        opposite: true,
      },
      {
        labels: {
          format: `{value}`,
        },
        title: {
          text: "",
        },
        height: "70%",
        top: "5%",
        offset: 30,
        zIndex: 2,
      },
    ],
    // ㅋㅋ
    legend: {
      layout: "horizontal",
      align: "left",
      verticalAlign: "top",
      itemStyle: {
        fontWeight: 400,
        fontSize: "13px",
      },
      symbolHeight: 10,
      symbolWidth: 10,
      labelFormatter: function () {
        return `<span style="color:${this.color}">${this.name}</span>`;
      },
    },
    plotOptions: {
      areaspline: {
        marker: {
          radius: 2,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 2,
          },
        },
        threshold: null,
      },
      spline: {
        marker: {
          radius: 2,
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
    },
    series: [
      {
        name: "Real Data",
        data: weekPriceData,
        color: "#45B341",
        type: "spline",
      },
      {
        name: "Real Data",
        data: weekPriceData,
        color: "#45B341",
        type: "column",
      },
      {
        name: "Past Predictions",
        data: aiPriceData,
        color: "#AFD1E3",
        type: "spline",
      },
      {
        name: "Past Predictions",
        data: aiPriceData,
        color: "#AFD1E3",
        type: "column",
      },
      {
        name: "1h Prediction",
        data: [lastAiPricePoint],
        type: "column",
        color: "#0000FF",
        marker: {
          symbol: "circle",
        },
        tooltip: {
          pointFormat: "1h Prediction: <b>{point.y}</b>",
        },
      },
    ],
  });
})();
