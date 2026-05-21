import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Allow up to 60s for image analysis
export const maxDuration = 60;

export async function POST(request) {
  try {
    const body = await request.json();
    const { year, make, model, price, mileage, condition, description, listingUrl, images } = body;

    if (!make || !model || !price) {
      return Response.json({ error: 'Make, model, and price are required.' }, { status: 400 });
    }

    const hasImages = images && images.length > 0;

    const textPrompt = `You are a motorcycle flip expert with deep knowledge of US used motorcycle market values. Analyze this listing and respond ONLY with a valid JSON object — no markdown, no backticks, no preamble, no explanation.
${hasImages ? `\nYou have been provided ${images.length} photo(s) of the motorcycle. Carefully analyze them for visible damage, rust, crash damage, modifications, wear on tires/chain/sprockets, cleanliness, and anything that affects value or saleability. Factor your visual observations into every field — scores, flags, summary, and negotiation tip.\n` : ''}
Listing details:
- Year: ${year || 'unknown'}
- Make: ${make}
- Model: ${model}
- Asking price: $${price}
- Mileage: ${mileage || 'unknown'}
- Condition: ${condition || 'not specified'}
- Description/notes: ${description || 'none provided'}
${listingUrl ? `- Listing URL: ${listingUrl}` : ''}

Return exactly this JSON structure and nothing else:
{
  "score": <integer 0-100, overall flip potential score>,
  "estimated_market_value": <integer USD, what this bike is worth>,
  "suggested_offer": <integer USD, what to offer the seller>,
  "estimated_sell_price": <integer USD, realistic price you could sell it for>,
  "estimated_profit": <integer USD, estimated_sell_price minus suggested_offer>,
  "days_to_sell_estimate": "<e.g. 1-2 weeks, 3-4 weeks>",
  "green_flags": ["<flag>", "<flag>", "<flag>"],
  "red_flags": ["<flag>", "<flag>"],
  "summary": "<2-3 sentence plain english verdict on this flip opportunity>",
  "negotiation_tip": "<one specific, actionable tip for negotiating with this seller>"
}`;

    // Build content array — images first so Claude sees them before the text prompt
    const content = [];

    if (hasImages) {
      for (const img of images) {
        content.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: img.mediaType,
            data: img.base64,
          },
        });
      }
    }

    content.push({ type: 'text', text: textPrompt });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content }],
    });

    const text = message.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return Response.json(result);

  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
