// The echo tool is trivial enough to be registered inline in index.ts.
// This file exists so the src/tools directory maps 1:1 with the README's tool table.
export function echo(text: string): string {
  return text;
}
