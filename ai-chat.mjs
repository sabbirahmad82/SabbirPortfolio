const SYSTEM_PROMPT = `You are the portfolio assistant for Sabbir Ahmad, a freelance video editor based in Bangladesh.

Answer questions helpfully and briefly using only these known details:
- Services: video editing, reels and shorts, YouTube video editing, promotional videos, audio and captions, and color correction.
- Contact: sa581827346@gmail.com or WhatsApp 01951332282.
- Portfolio: https://sabbirahmad82-portfolio.netlify.app/

Do not invent prices, availability, tools, client results, or project details. If asked for something not listed here, say you do not have that information and direct the visitor to contact Sabbir. Keep replies focused on the portfolio and video editing.`;

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 500) {
    return jsonResponse({ error: "Message must be between 1 and 500 characters." }, 400);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: "The AI assistant is not configured yet." }, 503);
  }

  let upstream;
  try {
    upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ]
      })
    });
  } catch {
    return jsonResponse({ error: "Could not reach the AI service." }, 502);
  }

  if (!upstream.ok) {
    return jsonResponse({ error: "The AI service could not answer right now." }, 502);
  }

  const result = await upstream.json().catch(() => null);
  const reply = result?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    return jsonResponse({ error: "The AI service returned an empty reply." }, 502);
  }

  return jsonResponse({ reply });
}
