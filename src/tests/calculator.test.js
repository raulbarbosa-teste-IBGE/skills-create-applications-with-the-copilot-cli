const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");

const calculatorPath = path.join(__dirname, "..", "calculator.js");
const { calculate, modulo, power, squareRoot } = require(calculatorPath);

test("addition adds the image example and supports negative and decimal values", () => {
  assert.equal(calculate(2, "addition", 3), 5);
  assert.equal(calculate(-2, "addition", 3), 1);
  assert.equal(calculate(0.1, "addition", 0.2), 0.30000000000000004);
});

test("subtraction subtracts the image example and supports negative values", () => {
  assert.equal(calculate(10, "subtraction", 4), 6);
  assert.equal(calculate(4, "subtraction", 10), -6);
  assert.equal(calculate(-4, "subtraction", -10), 6);
});

test("multiplication multiplies the image example and supports zero and negatives", () => {
  assert.equal(calculate(45, "multiplication", 2), 90);
  assert.equal(calculate(-3, "multiplication", 4), -12);
  assert.equal(calculate(0, "multiplication", 9), 0);
});

test("division divides the image example and supports fractions and negative values", () => {
  assert.equal(calculate(20, "division", 5), 4);
  assert.equal(calculate(1, "division", 2), 0.5);
  assert.equal(calculate(-12, "division", 3), -4);
});

test("division by positive or negative zero throws a clear error", () => {
  assert.throws(
    () => calculate(8, "division", 0),
    { message: "Erro: não é possível dividir por zero." },
  );
  assert.throws(
    () => calculate(8, "division", -0),
    { message: "Erro: não é possível dividir por zero." },
  );
});

test("modulo returns the remainder for the image example and edge cases", () => {
  assert.equal(modulo(5, 2), 1);
  assert.equal(calculate(5, "modulo", 2), 1);
  assert.equal(modulo(-10, 3), -1);
  assert.equal(modulo(0, 3), 0);
  assert.throws(() => modulo(1, 0), /módulo por zero/);
  assert.throws(() => modulo(1, Number.POSITIVE_INFINITY), /números válidos/);
});

test("power raises a base to an exponent for the image example and edge cases", () => {
  assert.equal(power(2, 3), 8);
  assert.equal(power(9, 0.5), 3);
  assert.equal(calculate(2, "power", 3), 8);
  assert.equal(power(5, 0), 1);
  assert.equal(power(2, -2), 0.25);
  assert.throws(() => power(2, Number.NaN), /números válidos/);
});

test("squareRoot returns the image example and rejects negative or invalid numbers", () => {
  assert.equal(squareRoot(16), 4);
  assert.equal(calculate(16, "squareRoot"), 4);
  assert.equal(squareRoot(9), 3);
  assert.equal(calculate(0, "squareRoot"), 0);
  assert.throws(() => squareRoot(-1), /número negativo/);
  assert.throws(() => calculate(-16, "squareRoot"), /número negativo/);
  assert.throws(() => squareRoot(Number.NaN), /número válido/);
});

test("unsupported operations throw an error listing the supported operations", () => {
  assert.throws(
    () => calculate(1, "unknown", 2),
    /Operação inválida: "unknown".*addition, subtraction, multiplication, division, modulo, power ou squareRoot/,
  );
});

test("non-finite operands are rejected", () => {
  assert.throws(() => calculate(Number.NaN, "addition", 1), /números válidos/);
  assert.throws(() => calculate(1, "addition", Number.POSITIVE_INFINITY), /números válidos/);
  assert.throws(() => calculate(Number.NEGATIVE_INFINITY, "subtraction", 1), /números válidos/);
});

test("CLI prints results for valid input", () => {
  const result = spawnSync(process.execPath, [calculatorPath, "2", "addition", "3"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "5\n");
  assert.equal(result.stderr, "");
});

test("CLI rejects a missing operand", () => {
  const result = spawnSync(process.execPath, [calculatorPath, "2", "addition"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Uso: node src\/calculator\.js/);
});

test("CLI rejects non-numeric operands", () => {
  const result = spawnSync(process.execPath, [calculatorPath, "abc", "addition", "3"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /números válidos/);
});

test("CLI reports division by zero as an error", () => {
  const result = spawnSync(process.execPath, [calculatorPath, "8", "division", "0"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /não é possível dividir por zero/);
});

test("CLI prints results for modulo, power, and squareRoot", () => {
  for (const [args, expected] of [
    [["5", "modulo", "2"], "1\n"],
    [["2", "power", "3"], "8\n"],
    [["16", "squareRoot"], "4\n"],
  ]) {
    const result = spawnSync(process.execPath, [calculatorPath, ...args], {
      encoding: "utf8",
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout, expected);
    assert.equal(result.stderr, "");
  }
});

test("CLI reports negative square roots as errors", () => {
  const result = spawnSync(process.execPath, [calculatorPath, "-1", "squareRoot"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /número negativo/);
});
