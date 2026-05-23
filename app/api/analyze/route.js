import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export const maxDuration = 60;

function getDateContext() {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long' });
  const year = now.getFullYear();
  const m = now.getMonth() + 1;
  return { month, year, monthNum: m };
}

// ─── Regional market profiles ────────────────────────────────────────────────
const REGIONAL_DATA = {
  'Los Angeles / San Diego': {
    premium: '+18–25% above national avg',
    liquidity: 'Very High — bikes sell in 3–7 days',
    segments: 'Sport bikes, naked/streetfighter, scramblers, anything with visual appeal',
    season: 'year-round',
    notes: 'Cosmetics matter more here than anywhere — scratches and faded plastics hurt value significantly. CA emissions compliance required (CARB); non-compliant bikes sell at a 10–15% discount. Competition from dealers is stiff.',
  },
  'San Francisco / Sacramento': {
    premium: '+12–18% above national avg',
    liquidity: 'High — tech/commuter demand keeps market active',
    segments: 'Adventure, commuters, nakeds, anything practical and fuel-efficient',
    season: 'year-round',
    notes: 'Commuter utility is prized. CARB compliance required same as SoCal. Bay Area traffic = strong demand for nimble sub-650cc bikes. Adventure bikes command a premium in foothills areas.',
  },
  'Seattle / Portland': {
    premium: '+5–10% above national avg',
    liquidity: 'Moderate-High in summer; Moderate in winter',
    segments: 'Adventure, dual-sport, cruisers — practical > flashy',
    season: 'mild-winter',
    notes: 'Buyers are practical and rain-tolerant. Fenders, windshields, and luggage add value. Check for surface rust from wet climate — frame bolts, exhaust headers. Oregon has no sales tax which attracts buyers from WA for private sales.',
  },
  'Phoenix / Las Vegas': {
    premium: '+8–15% above national avg',
    liquidity: 'High — active year-round community',
    segments: 'Cruisers, nakeds, sport bikes, adventure',
    season: 'year-round',
    notes: 'UV damage is real — inspect faded plastics and cracked seats. Extreme summer heat (Jun–Aug) briefly slows the market (115°F = no one rides midday). Best selling window is Oct–Apr. Low mileage is common here because summers are unrideable.',
  },
  'Dallas / Houston / Austin': {
    premium: '+5–12% above national avg',
    liquidity: 'High — large population, strong cash-deal culture',
    segments: 'Cruisers/Harley (especially DFW/Houston), nakeds and sport bikes (Austin), adventure',
    season: 'mild-winter',
    notes: 'Truck culture means buyers can haul — easy transactions. Austin skews younger/sportier. Harley culture dominates DFW and Houston. North TX gets a mild winter dip Nov–Feb; south TX is nearly year-round.',
  },
  'Atlanta / Nashville': {
    premium: '+0–5% above national avg',
    liquidity: 'Moderate-High Mar–Oct; Moderate Nov–Feb',
    segments: 'Cruisers, sport bikes, beginner bikes — Harley culture very strong',
    season: 'mild-winter',
    notes: 'Appalachian mountain roads drive demand for adventure and dual-sport in TN/NC/GA/AL. Harley-Davidson is deeply embedded culturally. Humidity and occasional flooding in low-lying areas — check for watermark lines on engine cases.',
  },
  'Miami / Tampa / Orlando': {
    premium: '+5–10% above national avg',
    liquidity: 'High — INVERTED seasonality vs. rest of country',
    segments: 'Cruisers, scooters, nakeds; sport bikes in younger Miami/Orlando demos',
    season: 'year-round',
    notes: 'IMPORTANT: Florida peaks in WINTER (Oct–Mar) when snowbirds arrive and swell the buyer pool — opposite of cold-weather states. Salt air is a major issue — check chrome for pitting, frame/swingarm for rust bubbles. Post-hurricane flood titles circulate; always check VIN history. Summer is the slow buying season here.',
  },
  'Chicago / Detroit': {
    premium: '-5–0% vs national avg — buyer-friendly market',
    liquidity: 'Moderate May–Sep; Very Low Oct–Apr',
    segments: 'Cruisers, sport bikes, beginner bikes; Milwaukee = Harley heartland',
    season: 'harsh-winter',
    notes: 'Rust is the #1 issue — inspect frame welds, subframe, exhaust, chrome, wheel rims, and any exposed steel. Winter road salt accelerates corrosion badly. Strong winter buying opportunity Dec–Feb; sellers are motivated. Spring price spike is dramatic — bikes bought in Jan at $3k routinely sell for $3.8k in May.',
  },
  'Minneapolis / Kansas City': {
    premium: '-8–-2% vs national avg — most buyer-friendly market in the US',
    liquidity: 'Very Low Nov–Apr; Moderate-High May–Sep',
    segments: 'Cruisers, dual-sport, beginner bikes; touring strong in KC/St. Louis',
    season: 'harsh-winter',
    notes: 'Shortest effective riding season in the country (5–6 months). Sellers in Dec–Feb are often desperate — this is the best buying market in the US for winter deals. Price correction in spring is the steepest of any region. Check for ethanol fuel damage on carbureted bikes that sat all winter.',
  },
  'Denver / Salt Lake City': {
    premium: '+5–12% above national avg',
    liquidity: 'Moderate — passionate riding culture but smaller population',
    segments: 'Adventure bikes (KTM, BMW GS, Africa Twin, Honda ADV), dual-sport, enduro — these command a significant regional premium',
    season: 'mild-winter',
    notes: 'Adventure and dual-sport bikes command 15–25% MORE here than national avg. Sport bikes are slower to move. Altitude affects carbureted bikes — check for proper jetting. Denver/SLC buyers are active online and travel to buy good bikes.',
  },
  'New York / DC / Philadelphia': {
    premium: '+10–20% above national avg',
    liquidity: 'High — dense population, limited parking drives demand for smaller bikes',
    segments: 'Nakeds, scramblers, small-displacement commuters; NYC strongly prefers sub-650cc',
    season: 'mild-winter',
    notes: 'NYC/DC/Philly buyers pay a premium for practical, maneuverable bikes. Clean title is non-negotiable — thieves are active and buyers are skittish. Small displacement (300–650cc) often sells faster than big bikes here. Storage is a major concern — buyers with garages pay more.',
  },
  'Boston / Providence': {
    premium: '+5–8% above national avg',
    liquidity: 'Low Oct–Apr; High May–Sep',
    segments: 'Sport bikes and nakeds (college towns), adventure (NH/VT/ME mountains)',
    season: 'harsh-winter',
    notes: 'Boston/Providence college market creates strong Aug–Sep demand for 300–600cc beginner bikes as students return. Compressed 5-month riding season means spring deals move very fast. Check for electrolytic corrosion from road salt on any New England bike.',
  },
};

// ─── City → region mapper ─────────────────────────────────────────────────────
function mapCityToRegion(cityInput) {
  if (!cityInput) return null;
  const s = cityInput.toLowerCase().trim();

  // California split — check specific cities first before the state fallback
  const soCal = ['los angeles','san diego','anaheim','long beach','irvine','riverside','santa ana','oxnard','ventura','santa barbara','palm springs','bakersfield','san bernardino','ontario','fontana'];
  const noCal = ['san francisco','sacramento','san jose','oakland','fresno','stockton','modesto','santa rosa','berkeley','sf bay','bay area','redding','chico'];
  for (const c of soCal) if (s.includes(c)) return 'Los Angeles / San Diego';
  for (const c of noCal) if (s.includes(c)) return 'San Francisco / Sacramento';

  const map = {
    // Pacific Northwest
    seattle:'Seattle / Portland', tacoma:'Seattle / Portland', portland:'Seattle / Portland',
    spokane:'Seattle / Portland', eugene:'Seattle / Portland',
    ' wa':'Seattle / Portland', ',wa':'Seattle / Portland', 'washington state':'Seattle / Portland',
    ' or ':'Seattle / Portland', ',or':'Seattle / Portland', ' oregon':'Seattle / Portland',

    // Southwest Desert
    phoenix:'Phoenix / Las Vegas', 'las vegas':'Phoenix / Las Vegas', tucson:'Phoenix / Las Vegas',
    henderson:'Phoenix / Las Vegas', scottsdale:'Phoenix / Las Vegas', mesa:'Phoenix / Las Vegas',
    tempe:'Phoenix / Las Vegas', chandler:'Phoenix / Las Vegas', reno:'Phoenix / Las Vegas',
    ' az':'Phoenix / Las Vegas', ',az':'Phoenix / Las Vegas', ' arizona':'Phoenix / Las Vegas',
    ' nv':'Phoenix / Las Vegas', ',nv':'Phoenix / Las Vegas', ' nevada':'Phoenix / Las Vegas',

    // Texas
    dallas:'Dallas / Houston / Austin', houston:'Dallas / Houston / Austin', austin:'Dallas / Houston / Austin',
    'san antonio':'Dallas / Houston / Austin', 'fort worth':'Dallas / Houston / Austin',
    'el paso':'Dallas / Houston / Austin', lubbock:'Dallas / Houston / Austin', plano:'Dallas / Houston / Austin',
    ' tx':'Dallas / Houston / Austin', ',tx':'Dallas / Houston / Austin', ' texas':'Dallas / Houston / Austin',

    // Southeast
    atlanta:'Atlanta / Nashville', nashville:'Atlanta / Nashville', charlotte:'Atlanta / Nashville',
    birmingham:'Atlanta / Nashville', memphis:'Atlanta / Nashville', raleigh:'Atlanta / Nashville',
    durham:'Atlanta / Nashville', richmond:'Atlanta / Nashville', louisville:'Atlanta / Nashville',
    knoxville:'Atlanta / Nashville', chattanooga:'Atlanta / Nashville', greensboro:'Atlanta / Nashville',
    columbia:'Atlanta / Nashville', jackson:'Atlanta / Nashville', 'little rock':'Atlanta / Nashville',
    ' ga':'Atlanta / Nashville', ',ga':'Atlanta / Nashville', ' georgia':'Atlanta / Nashville',
    ' tn':'Atlanta / Nashville', ',tn':'Atlanta / Nashville', ' tennessee':'Atlanta / Nashville',
    ' al':'Atlanta / Nashville', ',al':'Atlanta / Nashville', ' alabama':'Atlanta / Nashville',
    ' sc':'Atlanta / Nashville', ',sc':'Atlanta / Nashville', ' nc':'Atlanta / Nashville', ',nc':'Atlanta / Nashville',
    ' ms':'Atlanta / Nashville', ',ms':'Atlanta / Nashville', ' ar':'Atlanta / Nashville', ',ar':'Atlanta / Nashville',
    ' ky':'Atlanta / Nashville', ',ky':'Atlanta / Nashville', ' kentucky':'Atlanta / Nashville',
    ' wv':'Atlanta / Nashville', ',wv':'Atlanta / Nashville',

    // Florida
    miami:'Miami / Tampa / Orlando', tampa:'Miami / Tampa / Orlando', orlando:'Miami / Tampa / Orlando',
    jacksonville:'Miami / Tampa / Orlando', 'fort lauderdale':'Miami / Tampa / Orlando',
    'st. pete':'Miami / Tampa / Orlando', 'st pete':'Miami / Tampa / Orlando',
    tallahassee:'Miami / Tampa / Orlando', pensacola:'Miami / Tampa / Orlando',
    ' fl':'Miami / Tampa / Orlando', ',fl':'Miami / Tampa / Orlando', ' florida':'Miami / Tampa / Orlando',

    // Midwest / Great Lakes
    chicago:'Chicago / Detroit', detroit:'Chicago / Detroit', indianapolis:'Chicago / Detroit',
    columbus:'Chicago / Detroit', cleveland:'Chicago / Detroit', milwaukee:'Chicago / Detroit',
    cincinnati:'Chicago / Detroit', toledo:'Chicago / Detroit', akron:'Chicago / Detroit',
    'grand rapids':'Chicago / Detroit', lansing:'Chicago / Detroit',
    ' il':'Chicago / Detroit', ',il':'Chicago / Detroit', ' illinois':'Chicago / Detroit',
    ' mi':'Chicago / Detroit', ',mi':'Chicago / Detroit', ' michigan':'Chicago / Detroit',
    ' in':'Chicago / Detroit', ',in':'Chicago / Detroit', ' indiana':'Chicago / Detroit',
    ' oh':'Chicago / Detroit', ',oh':'Chicago / Detroit', ' ohio':'Chicago / Detroit',
    ' wi':'Chicago / Detroit', ',wi':'Chicago / Detroit', ' wisconsin':'Chicago / Detroit',

    // Upper Midwest / Plains
    minneapolis:'Minneapolis / Kansas City', 'kansas city':'Minneapolis / Kansas City',
    'st. louis':'Minneapolis / Kansas City', 'st louis':'Minneapolis / Kansas City',
    omaha:'Minneapolis / Kansas City', tulsa:'Minneapolis / Kansas City',
    'oklahoma city':'Minneapolis / Kansas City', wichita:'Minneapolis / Kansas City',
    'des moines':'Minneapolis / Kansas City', sioux:'Minneapolis / Kansas City',
    fargo:'Minneapolis / Kansas City', 'st. paul':'Minneapolis / Kansas City',
    ' mn':'Minneapolis / Kansas City', ',mn':'Minneapolis / Kansas City',
    ' ia':'Minneapolis / Kansas City', ',ia':'Minneapolis / Kansas City',
    ' mo':'Minneapolis / Kansas City', ',mo':'Minneapolis / Kansas City',
    ' ks':'Minneapolis / Kansas City', ',ks':'Minneapolis / Kansas City',
    ' ne':'Minneapolis / Kansas City', ',ne':'Minneapolis / Kansas City',
    ' sd':'Minneapolis / Kansas City', ',sd':'Minneapolis / Kansas City',
    ' nd':'Minneapolis / Kansas City', ',nd':'Minneapolis / Kansas City',
    ' ok':'Minneapolis / Kansas City', ',ok':'Minneapolis / Kansas City',

    // Mountain West
    denver:'Denver / Salt Lake City', 'salt lake city':'Denver / Salt Lake City',
    slc:'Denver / Salt Lake City', 'salt lake':'Denver / Salt Lake City',
    'colorado springs':'Denver / Salt Lake City', boulder:'Denver / Salt Lake City',
    albuquerque:'Denver / Salt Lake City', boise:'Denver / Salt Lake City',
    billings:'Denver / Salt Lake City', missoula:'Denver / Salt Lake City',
    'santa fe':'Denver / Salt Lake City', provo:'Denver / Salt Lake City',
    ' co':'Denver / Salt Lake City', ',co':'Denver / Salt Lake City', ' colorado':'Denver / Salt Lake City',
    ' ut':'Denver / Salt Lake City', ',ut':'Denver / Salt Lake City', ' utah':'Denver / Salt Lake City',
    ' wy':'Denver / Salt Lake City', ',wy':'Denver / Salt Lake City', ' wyoming':'Denver / Salt Lake City',
    ' mt':'Denver / Salt Lake City', ',mt':'Denver / Salt Lake City', ' montana':'Denver / Salt Lake City',
    ' id':'Denver / Salt Lake City', ',id':'Denver / Salt Lake City', ' idaho':'Denver / Salt Lake City',
    ' nm':'Denver / Salt Lake City', ',nm':'Denver / Salt Lake City', ' new mexico':'Denver / Salt Lake City',

    // Mid-Atlantic
    'new york':'New York / DC / Philadelphia', nyc:'New York / DC / Philadelphia',
    brooklyn:'New York / DC / Philadelphia', bronx:'New York / DC / Philadelphia',
    queens:'New York / DC / Philadelphia', philadelphia:'New York / DC / Philadelphia',
    philly:'New York / DC / Philadelphia', washington:'New York / DC / Philadelphia',
    baltimore:'New York / DC / Philadelphia', pittsburgh:'New York / DC / Philadelphia',
    newark:'New York / DC / Philadelphia', 'jersey city':'New York / DC / Philadelphia',
    norfolk:'New York / DC / Philadelphia', 'virginia beach':'New York / DC / Philadelphia',
    arlington:'New York / DC / Philadelphia', trenton:'New York / DC / Philadelphia',
    ' ny':'New York / DC / Philadelphia', ',ny':'New York / DC / Philadelphia',
    ' nj':'New York / DC / Philadelphia', ',nj':'New York / DC / Philadelphia', ' new jersey':'New York / DC / Philadelphia',
    ' pa':'New York / DC / Philadelphia', ',pa':'New York / DC / Philadelphia', ' pennsylvania':'New York / DC / Philadelphia',
    ' md':'New York / DC / Philadelphia', ',md':'New York / DC / Philadelphia', ' maryland':'New York / DC / Philadelphia',
    ' dc':'New York / DC / Philadelphia', ' va':'New York / DC / Philadelphia', ',va':'New York / DC / Philadelphia', ' virginia':'New York / DC / Philadelphia',
    ' de':'New York / DC / Philadelphia', ',de':'New York / DC / Philadelphia', ' delaware':'New York / DC / Philadelphia',

    // New England
    boston:'Boston / Providence', providence:'Boston / Providence', hartford:'Boston / Providence',
    springfield:'Boston / Providence', worcester:'Boston / Providence',
    'new haven':'Boston / Providence', bridgeport:'Boston / Providence',
    manchester:'Boston / Providence', portland:'Boston / Providence',
    ' ma':'Boston / Providence', ',ma':'Boston / Providence', ' massachusetts':'Boston / Providence',
    ' ct':'Boston / Providence', ',ct':'Boston / Providence', ' connecticut':'Boston / Providence',
    ' ri':'Boston / Providence', ',ri':'Boston / Providence', ' rhode island':'Boston / Providence',
    ' nh':'Boston / Providence', ',nh':'Boston / Providence', ' new hampshire':'Boston / Providence',
    ' vt':'Boston / Providence', ',vt':'Boston / Providence', ' vermont':'Boston / Providence',
    ' me':'Boston / Providence', ',me':'Boston / Providence', ' maine':'Boston / Providence',

    // California fallback (if just "ca" or "california" with no city hint)
    ' ca':'Los Angeles / San Diego', ',ca':'Los Angeles / San Diego', ' california':'Los Angeles / San Diego',
  };

  // Pad the string so state-code patterns (" tx") match at the start too
  const padded = ' ' + s;
  for (const [key, region] of Object.entries(map)) {
    if (padded.includes(key)) return region;
  }
  return null;
}

// ─── Seasonal guidance by market type ────────────────────────────────────────
function getSeasonalGuidance(monthNum, season) {
  if (season === 'year-round') {
    if (monthNum === 1 || monthNum === 2) return 'Slight buyer advantage — post-holiday spending freeze motivates some sellers (-5%). Good buying window before spring.';
    if (monthNum >= 3 && monthNum <= 10) return 'Balanced to seller-favorable. Normal pricing. Florida peaks Oct–Mar (snowbird season).';
    return 'Minimal seasonal impact. Slight -5% softening possible. Florida remains strong through winter.';
  }
  if (season === 'mild-winter') {
    if (monthNum >= 12 || monthNum <= 2) return 'Buyer advantage: -10 to -15% vs peak. Motivated sellers. Good time to buy, hold until spring.';
    if (monthNum >= 3 && monthNum <= 5) return 'Spring surge. Prices firm, seller-favorable. Bikes move fast. Best time to sell.';
    if (monthNum >= 6 && monthNum <= 9) return 'Balanced summer market. Strong demand, prices hold steady.';
    return 'Transitional. Deals beginning to emerge as season winds down.';
  }
  // harsh-winter
  if (monthNum >= 11 || monthNum <= 3) return 'STRONG buyer advantage: -18 to -28% vs peak. Sellers are often desperate. This is the best buying window of the year — buy now, hold until April for maximum return.';
  if (monthNum >= 4 && monthNum <= 6) return 'Spring rush. Prices spike +15–20% from winter lows. Seller-favorable, bikes move very fast. Excellent sell window.';
  if (monthNum >= 7 && monthNum <= 9) return 'Peak season. Balanced market, prices hold. Good sell window before fall.';
  return 'Selling window closing fast. Move inventory before November or hold all winter.';
}

function buildSystemPrompt(regionKey, monthNum, month, year) {
  const region = REGIONAL_DATA[regionKey];
  const seasonType = region?.season ?? 'mild-winter';
  const seasonalGuidance = getSeasonalGuidance(monthNum, seasonType);

  const regionBlock = region ? `
━━ ACTIVE REGION: ${regionKey} ━━
Price vs. national avg: ${region.premium}
Market liquidity: ${region.liquidity}
Strong-selling segments: ${region.segments}
Regional notes: ${region.notes}
Current seasonal context (${month} ${year}): ${seasonalGuidance}
` : `
━━ REGION: Not specified — use national average pricing ━━
Current month: ${month} ${year}. ${seasonalGuidance}
`;

  return `You are a seasoned motorcycle flipper and market analyst with 15+ years buying and selling used motorcycles across the US. You have deep knowledge of regional price differences, seasonal demand swings, model-specific failure points, and negotiation psychology.

Give brutally honest, specific assessments. Name the actual model reputation. Quote the actual price gap. Reference the actual region. No generic filler.
${regionBlock}
━━ SCORING RUBRIC — be precise, do not cluster scores ━━
90–100 → Exceptional. >25% gross margin, premium high-demand model, sells in days, near-zero risk
80–89  → Hot flip. 18–25% gross margin, strong demand, sells 1–2 weeks, minor concerns only
70–79  → Good flip. 12–18% gross margin, solid demand, sells 2–4 weeks, manageable risks
60–69  → Marginal. 6–12% gross margin OR significant risk factors. Only proceed if price drops further
40–59  → Risky. <6% margin, notable problems, or slow-moving model. Pass unless heavily discounted
0–39   → Hard pass. Loss likely, major red flags, or nearly unsellable as-is

━━ HIGH-DEMAND MODELS (fast sales, price firmly) ━━
Kawasaki Ninja 400, Z400 · Honda Grom, Monkey · Suzuki SV650 · Yamaha MT-07/FZ-07
Honda CBR600RR (2003–2012) · KTM Duke 390/790 · Kawasaki Ninja 650/Z650
Honda CB500 series · Harley Iron 883/1200, Sportster 48 · Royal Enfield Meteor/Classic 350
Yamaha MT-03/R3 · Honda CB300R

━━ SLOW-MOVING / RISKY ━━
Large tourers (Gold Wing, Road Glide) · Older 2-strokes · Exotics outside major metros
Salvage/rebuilt title (discount 25–40% from clean) · Non-running/seized · Off-road only (no street title)

━━ TITLE STATUS — this is one of the most important factors in any flip ━━
CLEAN TITLE: Full value. No discount needed. Easiest to sell, largest buyer pool.
SALVAGE TITLE: Reduce estimated_sell_price by 30–45% vs. clean title equivalent. Buyer pool shrinks dramatically — many lenders won't finance salvage, many buyers won't touch it. Only flip salvage if the discount is massive (50%+ off clean value) and damage is cosmetic only.
REBUILT/RECONSTRUCTED TITLE: Reduce by 20–35% vs. clean. Better than salvage but still a significant discount. Disclose clearly in your listing — buyers who discover it after the fact are a nightmare.
NO TITLE / BILL OF SALE ONLY: Major risk. In many states you cannot legally register a no-title bike. Some states (VT, SD, ME) allow title bonding — but it's a process. Reduce value by 40–60% vs. clean. Only experienced flippers should touch these.
TITLE IN HAND / NOT YET TRANSFERRED: Normal — this just means the seller hasn't transferred it to themselves yet. Verify the title name matches the seller's ID. Watch for curbstoners (dealers selling as private party).
ALWAYS flag title status prominently in your analysis. If no title status was provided, note that it's unknown and add "Verify title status immediately" to inspect_checklist.

━━ TRANSACTION COSTS — always account for these ━━
Title/registration: $50–150 · Basic prep (fluids, chain, cleaning): $80–300 · Transport/fuel: $30–100
Typical total: $150–450. Use for net_profit_estimate.

━━ PHOTO ANALYSIS — treat photos as equal weight to the written description ━━
When photos are provided, conduct a systematic visual inspection before scoring:
1. CRASH/DAMAGE SCAN: Look for asymmetry in bodywork, cracked or missing fairings, bent levers, mirror damage, tank dents, handlebar bends, frame slider marks, scuffed footpegs — any sign of a tip-over or crash.
2. RUST & CORROSION: Scan chrome surfaces, exhaust headers and muffler, wheel rims, spoke nipples (if wire wheels), frame welds, swingarm pivot area, and any exposed steel for rust, pitting, or bubbling paint.
3. MECHANICAL WEAR: Check tire tread depth and sidewall cracking, chain slack and sprocket tooth wear (shark-toothing = red flag), brake rotor thickness and scoring, fork seal condition (oil streaks on lower legs), and coolant overflow tank level if visible.
4. FLUID LEAKS: Look for oil staining around the engine cases, head gasket area, fork legs, and brake calipers.
5. MODIFICATIONS: Identify aftermarket parts — exhausts, handlebars, mirrors, levers, grips, seat. Note whether they add or subtract from resale value. Heavily modified bikes are harder to sell.
6. COSMETIC CONDITION: Overall paint quality, plastic condition, seat condition (tears, fading), windshield scratches. In high-visual markets (SoCal, Mid-Atlantic) cosmetics significantly affect price.
7. CLEANLINESS: A clean, well-presented bike typically indicates better maintenance. A grimy, neglected bike warrants scrutiny of maintenance history.
Weight photo findings as heavily as the written description. If photos reveal damage or issues not mentioned in the description, flag them prominently in red_flags and reduce the score accordingly.`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { year, make, model, price, mileage, condition, titleStatus, description, listingUrl, images, city } = body;

    if (!make || !model || !price) {
      return Response.json({ error: 'Make, model, and price are required.' }, { status: 400, headers: CORS_HEADERS });
    }

    const hasImages = images && images.length > 0;
    const { month, year: currentYear, monthNum } = getDateContext();
    const regionKey = city ? mapCityToRegion(city) : null;

    const systemPrompt = buildSystemPrompt(regionKey, monthNum, month, currentYear);

    const photoInstruction = hasImages
      ? `\nYou have ${images.length} photo(s). Run through ALL 7 visual inspection categories from your system prompt (crash scan, rust, mechanical wear, fluid leaks, mods, cosmetics, cleanliness) before writing your response. Explicitly note what you see or don't see in each category. Factor photo findings equally with the written description in every output field.\n`
      : '\nNo photos provided — flag this as lower confidence and note in the inspect_checklist that a visual inspection is critical before purchase.\n';

    const userPrompt = `Analyze this motorcycle listing. Respond ONLY with valid JSON — no markdown, no backticks, no explanation.
${photoInstruction}
Listing:
- Year: ${year || 'unknown'}
- Make: ${make}
- Model: ${model}
- Asking price: $${price}
- Mileage: ${mileage ? `${parseInt(mileage).toLocaleString()} miles` : 'unknown'}
- Condition: ${condition || 'not specified'}
- Title status: ${titleStatus || 'NOT PROVIDED — flag as unknown, add to inspect_checklist'}
- Description/notes: ${description || 'none provided'}
${listingUrl ? `- Listing URL: ${listingUrl}` : ''}
${city ? `- Buyer's location: ${city}` : '- Location: not specified (use national avg)'}${regionKey ? ` (${regionKey} market)` : ''}

Return exactly this JSON and nothing else:
{
  "score": <integer 0–100 per scoring rubric — be precise>,
  "estimated_market_value": <integer USD — what this bike is worth in the specified region>,
  "suggested_offer": <integer USD — max to pay and hit your margin>,
  "estimated_sell_price": <integer USD — realistic resale in this region>,
  "estimated_profit": <integer USD — estimated_sell_price minus suggested_offer, gross>,
  "estimated_costs": <integer USD — title, prep, transport; typically $150–450>,
  "net_profit_estimate": <integer USD — estimated_profit minus estimated_costs>,
  "days_to_sell_estimate": "<realistic range factoring region + current season, e.g. '3–7 days', '2–3 weeks'>",
  "market_demand": "<High | Medium | Low | Niche>",
  "confidence": "<High | Medium | Low — based on listing data completeness and photo availability>",
  "green_flags": ["<specific flag>", "<specific flag>"],
  "red_flags": ["<specific flag — reference actual listing details or photo observations>"],
  "inspect_checklist": ["<specific physical inspection item for this make/model/year>", "<another>", "<another>"],
  "summary": "<2–3 sentences: specific verdict naming the model reputation, price vs. regional market, seasonal context, and honest risk assessment. No filler.>",
  "negotiation_tip": "<one specific leverage-based tactic referencing an actual detail from this listing>"
}`;

    const content = [];
    if (hasImages) {
      for (const img of images) {
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: img.mediaType, data: img.base64 },
        });
      }
    }
    content.push({ type: 'text', text: userPrompt });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1400,
      system: systemPrompt,
      messages: [{ role: 'user', content }],
    });

    const text = message.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    // Safety fallbacks
    if (result.estimated_costs == null) result.estimated_costs = 250;
    if (result.net_profit_estimate == null) result.net_profit_estimate = result.estimated_profit - result.estimated_costs;
    if (!result.market_demand) result.market_demand = 'Medium';
    if (!result.confidence) result.confidence = 'Medium';
    if (!result.inspect_checklist) result.inspect_checklist = [];

    return Response.json(result, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json({ error: 'Analysis failed. Please try again.' }, { status: 500, headers: CORS_HEADERS });
  }
}
