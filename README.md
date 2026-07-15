# Remote MCP Server (Authless) — Utility Tools Edition

A remote [Model Context Protocol](https://modelcontextprotocol.io) server deployed on
Cloudflare Workers, exposing tools over HTTP/SSE with **no authentication layer** —
useful as a reference implementation for connecting Claude, ChatGPT, or any MCP-compatible
client to a public toolset without an OAuth flow.

## What this demonstrates
Forward-deployed / solutions engineering work frequently requires standing up a
lightweight integration layer between a client's existing systems and an AI assistant.
This repo is a minimal, production-shaped example of exactly that: a stateless,
globally-distributed MCP server that any MCP client can call.

## Tools exposed
| Tool | Description |
|---|---|
| `calculate` | Evaluates arithmetic expressions safely (no `eval`, uses a guarded parser) |
| `repo_lookup` | Fetches public metadata (stars, language, description) for a GitHub repo by `owner/name` |
| `echo` | Returns the input unchanged — used for connectivity smoke-testing |

## Architecture
```
Client (Claude / any MCP client)
        │  HTTP + SSE
        ▼
Cloudflare Worker (src/index.ts)
        │  McpServer (from @modelcontextprotocol/sdk)
        ▼
Tool handlers (src/tools/*.ts)
```

## Project structure
```
remote-mcp-server-authless/
├── src/
│   ├── index.ts          # Worker entrypoint, registers the MCP server
│   └── tools/
│       ├── calculate.ts
│       ├── repoLookup.ts
│       └── echo.ts
├── wrangler.jsonc          # Cloudflare Worker config
├── package.json
├── tsconfig.json
└── README.md
```

## Run locally
```bash
npm install
npm run dev            # starts on http://localhost:8787
```

## Deploy
```bash
npx wrangler login
npm run deploy
```
Your MCP endpoint will be available at:
`https://remote-mcp-server-authless.<your-subdomain>.workers.dev/sse`

## Connect a client
Add to any MCP-compatible client config:
```json
{
  "mcpServers": {
    "utility-tools": {
      "url": "https://remote-mcp-server-authless.<your-subdomain>.workers.dev/sse"
    }
  }
}
```

## Why "authless"
This template intentionally skips auth to keep the integration surface minimal for demos
and internal tooling. For anything handling private data, add an auth layer (Cloudflare
Access, API key header, or full OAuth) before deploying publicly — see
`remote-mcp-server-authless-1` in this account for a variant with a different tool
domain, kept separate rather than merged so each stays a focused, single-purpose example.

## License
MIT
