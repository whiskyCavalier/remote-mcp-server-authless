export async function repoLookup(ownerRepo: string) {
  const res = await fetch(`https://api.github.com/repos/${ownerRepo}`, {
    headers: { "User-Agent": "remote-mcp-server-authless" },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as Record<string, unknown>;
  return {
    name: data.full_name,
    description: data.description,
    stars: data.stargazers_count,
    language: data.language,
    openIssues: data.open_issues_count,
    url: data.html_url,
  };
}
