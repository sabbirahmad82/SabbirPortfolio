# Sabbir Ahmad Portfolio

## AI assistant setup

The chat endpoint is a Netlify Function and needs an OpenAI API key configured on the server:

1. In Netlify, open the site's environment variables settings.
2. Add `OPENAI_API_KEY` with your OpenAI API key. Never put this key in HTML or browser JavaScript.
3. Optionally add `OPENAI_MODEL` to select a model. The default is `gpt-4o-mini`.
4. Redeploy the site so the function receives the new variables.

For local development, run the site with Netlify Dev (`npx netlify-cli dev`) and set `OPENAI_API_KEY` in your local environment before starting it. Opening `index.html` directly does not provide the serverless function endpoint.

## Customer reviews

The review form is collected by Netlify Forms after deployment. View submissions in the Netlify site dashboard under **Forms** and approve reviews before sharing them publicly. Submissions are not automatically displayed on the portfolio.
