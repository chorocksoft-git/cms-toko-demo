Highcharts.wrap(
  Highcharts.Axis.prototype,
  "getLinePath",
  function (proceed, lineWidth) {
    const axis = this,
      brokenAxis = axis.brokenAxis,
      path = proceed.call(this, lineWidth),
      start = path[0];

    let x = start[1],
      y = start[2];

    (brokenAxis.breakArray || []).forEach(function (brk) {
      if (axis.horiz) {
        x = axis.toPixels(brk.from);
        path.splice(
          1,
          0,
          ["L", x - 4, y], // stop
          ["M", x - 9, y + 5],
          ["L", x + 1, y - 5], // left slanted line
          ["M", x - 1, y + 5],
          ["L", x + 9, y - 5], // higher slanted line
          ["M", x + 4, y]
        );
      } else {
        y = axis.toPixels(brk.from);
        path.splice(
          1,
          0,
          ["L", x, y - 4], // stop
          ["M", x + 5, y - 9],
          ["L", x - 5, y + 1], // lower slanted line
          ["M", x + 5, y - 1],
          ["L", x - 5, y + 9], // higher slanted line
          ["M", x, y + 4]
        );
      }
    });
    return path;
  }
);

/**
 * On top of each line, draw a zigzag line where the axis break is.
 */
function pointBreakLine(e) {
  const point = e.point,
    brk = e.brk,
    plotX = point.plotX,
    plotY = point.plotY,
    series = point.series,
    key = ["brk", brk.from, brk.to],
    path = [
      "M",
      plotX,
      plotY,
      "L",
      plotX + 4,
      plotY + 4,
      "L",
      plotX - 4,
      plotY - 4,
      "L",
      plotX,
      plotY,
    ];

  if (!point[key]) {
    point[key] = this.chart.renderer
      .path(path)
      .attr({
        "stroke-width": 2,
        stroke: series.options.color,
      })
      .add(series.group);
  } else {
    point[key].attr({
      d: path,
    });
  }
}

/**
 * Remove the zigzag line after the point is no longer on the break.
 */
function pointOutsideOfBreak(e) {
  const point = e.point,
    brk = e.brk,
    key = ["brk", brk.from, brk.to];

  if (point[key]) {
    point[key].destroy();
    delete point[key];
  }
}

Highcharts.chart("aiContainer", {
  chart: {
    type: "line", // 'line' 타입 설정
    zooming: {
      type: "xy",
    },
  },
  title: {
    text: "Visualized axis break on X-axis with Line Chart",
  },
  xAxis: {
    /*   categories: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
          'Oct', 'Nov', 'Dec'
      ], */
    breaks: [
      {
        from: 3.5,
        to: 8.5,
        breakSize: 1, // 단절의 크기를 정의 (optional)
      },
    ],
    events: {
      pointBreak: pointBreakLine,
      pointOutsideOfBreak: pointOutsideOfBreak,
    },
  },
  yAxis: {
    lineColor: "black",
    lineWidth: 2,
    title: false,
    tickInterval: 100,
  },
  series: [
    {
      name: "Attraction 1",
      data: [44, 128, 180, 345, 3050, 3590, 3840, 3630, 3120, 420, 240, 80],
    },
    {
      name: "Attraction 2",
      data: [64, 138, 164, 408, 3120, 3540, 3875, 3420, 720, 320, 160, 20],
    },
  ],
});
