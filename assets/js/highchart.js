const HOUR = "1h";
const DAY = "24h";

const ONE_HOUR = 1000 * 60 * 60;
const TEN_MINUTES = 1000 * 60 * 10;
const tickInterval = ONE_HOUR;

const createChartData = (data) => {
  const {
    week_price_chart: weekPriceChart,
    ai_price_chart: aiPriceChart,
    timecode_datetime: timecodeDatetime,
    is_same_timecode: isSameTimecode,
  } = data;
  let period = "1h";
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
      (parseInt(baseTime / tickInterval, 10) + 25) * tickInterval +
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

  const minValue = findMinValue(weekPriceData, aiPriceData);
  console.log("Minimum Value:", minValue);

  console.log("weekPriceData", weekPriceData);
  console.log("aiPriceData", aiPriceData);
  console.log("lastAiPricePoint", lastAiPricePoint);

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
          format: `{value}`,
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

    tooltip: {
      shared: true,
      crosshairs: true,
      split: true,
      backgroundColor: "#fff",
      borderWidth: 2,
      borderColor: this.color,
      useHTML: true,
      style: {
        fontSize: "12px",
      },
    },

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
        marker: {
          enabled: true,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
    },
    series: [
      {
        name: "Price Trend",
        data: weekPriceData,
        color: "#45B34180",
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

        color: "#AFD1E3",
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
        color: "rgba(0, 126, 200, 1)",
        marker: {
          symbol: "circle",
          radius: 20,
          states: {
            hover: {
              enabled: true,
            },
          },

          fillColor: {
            radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
            stops: [
              [0, "rgba(0, 126, 200, 1)"],
              [0.3, "rgba(101, 193, 247, 1)"],
              [1, "rgba(255, 255, 255, 1)"],
            ],
          },
          filter: "url(#blur)",
        },
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 360,
          },
          chartOptions: {
            rangeSelector: {
              buttonPosition: {
                align: "left",
              },
            },
          },
        },
      ],
    },

    // responsive: {
    //   rules: [
    //     {
    //       condition: {
    //         maxWidth: 500,
    //       },
    //       chartOptions: {
    //         legend: {
    //           layout: "horizontal",
    //           align: "center",
    //           verticalAlign: "bottom",
    //         },
    //       },
    //     },
    //   ],
    // },
  });
})();
