/**
 * A safe arithmetic evaluator — no `eval`, no `Function` constructor.
 * Supports + - * / and parentheses, following standard operator precedence.
 */
export function calculate(expression: string): number {
  const tokens = expression.match(/\d+(\.\d+)?|[+\-*/()]/g);
  if (!tokens) throw new Error("Invalid expression");

  let pos = 0;

  function parseExpr(): number {
    let value = parseTerm();
    while (tokens![pos] === "+" || tokens![pos] === "-") {
      const op = tokens![pos++];
      const rhs = parseTerm();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  }

  function parseTerm(): number {
    let value = parseFactor();
    while (tokens![pos] === "*" || tokens![pos] === "/") {
      const op = tokens![pos++];
      const rhs = parseFactor();
      value = op === "*" ? value * rhs : value / rhs;
    }
    return value;
  }

  function parseFactor(): number {
    if (tokens![pos] === "(") {
      pos++; // consume '('
      const value = parseExpr();
      if (tokens![pos] !== ")") throw new Error("Mismatched parentheses");
      pos++; // consume ')'
      return value;
    }
    const token = tokens![pos++];
    const value = parseFloat(token);
    if (Number.isNaN(value)) throw new Error(`Unexpected token: ${token}`);
    return value;
  }

  const result = parseExpr();
  if (pos !== tokens.length) throw new Error("Unexpected trailing tokens");
  return result;
}
