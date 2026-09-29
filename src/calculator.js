#!/usr/bin/env node

function modulo(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error("Erro: os dois operandos devem ser números válidos.");
  }
  if (b === 0) {
    throw new Error("Erro: não é possível calcular módulo por zero.");
  }
  return a % b;
}

function power(base, exponent) {
  if (!Number.isFinite(base) || !Number.isFinite(exponent)) {
    throw new Error("Erro: os dois operandos devem ser números válidos.");
  }
  return base ** exponent;
}

function squareRoot(n) {
  if (!Number.isFinite(n)) {
    throw new Error("Erro: o operando deve ser um número válido.");
  }
  if (n < 0) {
    throw new Error("Erro: não é possível calcular a raiz quadrada de um número negativo.");
  }
  return Math.sqrt(n);
}

// Operações suportadas: adição, subtração, multiplicação, divisão, módulo e potência.
const operations = {
  addition: (left, right) => left + right,
  subtraction: (left, right) => left - right,
  multiplication: (left, right) => left * right,
  division: (left, right) => left / right,
  modulo,
  power,
};

function calculate(left, operation, right) {
  if (operation === "squareRoot") {
    return squareRoot(left);
  }

  if (!Object.hasOwn(operations, operation)) {
    throw new Error(
      `Operação inválida: "${operation}". Use addition, subtraction, multiplication, division, modulo, power ou squareRoot.`,
    );
  }

  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("Erro: os dois operandos devem ser números válidos.");
  }

  if (operation === "division" && right === 0) {
    throw new Error("Erro: não é possível dividir por zero.");
  }

  return operations[operation](left, right);
}

function main(args) {
  const [leftInput, operation, rightInput] = args;
  const isUnaryOperation = operation === "squareRoot";
  if (args.length !== (isUnaryOperation ? 2 : 3)) {
    throw new Error(
      "Uso: node src/calculator.js <número1> <operação> [número2]\n" +
        "Operações: addition, subtraction, multiplication, division, modulo, power, squareRoot",
    );
  }

  const left = Number(leftInput);
  if (isUnaryOperation) {
    console.log(calculate(left, operation));
    return;
  }

  const right = Number(rightInput);
  console.log(calculate(left, operation, right));
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { calculate, modulo, power, squareRoot };
