import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { calculate } from "./tools/calculate";
import { repoLookup } from "./tools/repoLookup";

export class UtilityMCP extends McpAgent {
  server = new McpServer({
    name: "utility-tools",
    version: "1.0.0",
  });

  async init() {
    this.server.tool(
      "calculate",
      "Evaluate a basic arithmetic expression (+, -, *, /, parentheses).",
      { expression: z.string().describe("e.g. '(3 + 4) * 2'") },
      async ({ expression }) => ({
        content: [{ type: "text", text: String(calculate(expression)) }],
      })
    );

    this.server.tool(
      "repo_lookup",
      "Fetch public metadata for a GitHub repository.",
      { ownerRepo: z.string().describe("format: owner/repo, e.g. 'anthropics/anthropic-sdk-python'") },
      async ({ ownerRepo }) => {
        const data = await repoLookup(ownerRepo);
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    );

    this.server.tool(
      "echo",
      "Echo back the provided text. Used for connectivity smoke-testing.",
      { text: z.string() },
      async ({ text }) => ({ content: [{ type: "text", text }] })
    );
  }
}

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      // @ts-expect-error - mount() typing from the agents SDK
      return UtilityMCP.mount("/sse").fetch(request, env, ctx);
    }
    return new Response("MCP server is running. Connect via /sse", { status: 200 });
  },
};
