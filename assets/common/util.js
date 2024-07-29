function getIntegerDecimal(number) {
  const [integer, decimal] = number.toString().split(".");
  return [integer, decimal || "0"];
}

function numberWithCommas(x) {
  if (!(x === undefined || x === null)) {
    // 소숫점은 콤마 안찍기위해서 분리
    const [integer, decimal] = x.toString().split(".");
    const addedCommasIntegar = integer
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // 소숫점이 존재하는경우
    if (decimal) {
      return `${addedCommasIntegar}.${decimal}`;
    }
    // 존재하지 않는경우
    return addedCommasIntegar;
  }
  return null;
}

function dropDecimalPoint(number, n = 2) {
  let resultDecimal;
  if (!number) return 0;
  // number값 type이 number가 아니라면 number로 type변환
  if (typeof number !== "number") number = Number(number);
  if (n === 0) return parseFloat(number, 10);

  // exponential notation 처리
  if (number.toString().includes("e")) {
    return parseFloat(number).toFixed(10);
  }

  const [integer = "0", decimal = "0"] = getIntegerDecimal(number);

  // 정수가 존재하지 않고 소수만 존재하는경우
  if (integer === "0" || integer === "-0") {
    // 소수에서 0이 아닌 숫자가 시작하는 소수 자리수
    // 숫자가 시작하는 소수 자리수 + n만큼을 제외한 나머지 소수자리를 버림
    const x = decimal.split("0").findIndex((ele) => ele !== "");
    resultDecimal = decimal.slice(0, n + x);
  } else {
    resultDecimal = decimal.slice(0, n);
  }

  // 남아있는 0제거
  return parseFloat(`${integer}.${resultDecimal}`);
}
