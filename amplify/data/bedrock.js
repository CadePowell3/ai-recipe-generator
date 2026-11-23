export function request(ctx) {
  const ingredients = ctx.args.ingredients || [];
  return {
    resourcePath: "/model/us.anthropic.claude-haiku-4-5-20251001-v1:0/invoke",
    method: "POST",
    params: {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 600,
        messages: [{
          role: "user",
          content: [{
            type: "text",
            text: "Create one concise recipe with a title, ingredients, and numbered steps using: " + ingredients.join(", "),
          }],
        }],
      }),
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    return { error: ctx.error.message };
  }
  if (ctx.result.statusCode !== 200) {
    return { error: ctx.result.body };
  }
  const parsed = JSON.parse(ctx.result.body);
  return {
    body: parsed.content
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n"),
  };
}
