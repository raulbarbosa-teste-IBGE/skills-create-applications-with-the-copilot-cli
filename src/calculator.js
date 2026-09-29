#!/usr/bin/env node

// Operações suportadas: adição, subtração, multiplicação e divisão.
const operations = {
  addition: (left, right) => left + right,
  subtraction: (left, right) => left - right,
  multiplication: (left, right) => left * right,
  division: (left, right) => left / right,
};

function calculate(left, operation, right) {
  if (!Object.hasOwn(operations, operation)) {
    throw new Error(
      `Operação inválida: "${operation}". Use addition, subtraction, multiplication ou division.`,
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
  if (args.length !== 3) {
    throw new Error(
      "Uso: node src/calculator.js <número1> <operação> <número2>\n" +
        "Operações: addition, subtraction, multiplication, division",
    );
  }

  const [leftInput, operation, rightInput] = args;
  const left = Number(leftInput);
  const right = Number(rightInput);

  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("Erro: os dois operandos devem ser números válidos.");
  }

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

module.exports = { calculate };
