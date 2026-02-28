import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// IBJA (India Bullion & Jewellers Association) verified rates — 28 Feb 2026
// Source: ibjarates.com — Gold per 10g, Silver per kg
// 24K: ₹1,59,097/10g = ₹15,910/g | 22K: ₹1,45,733/10g = ₹14,573/g | Silver: ₹2,66,700/kg = ₹267/g
const IBJA_FALLBACK = {
    gold24k: 15910,
    gold22k: 14573,
    gold18k: 11933, // 22K * (18/22)
    silver: 267,
    platinum: 7231,
    live: false,
};

const TROY_OZ_G = 31.1035;
// Indian gold import duty + GST premium factor (~18.5% above international spot)
// Gold 24K India price ≈ international_spot_INR * 1.185
const INDIA_GOLD_PREMIUM = 1.185;
const INDIA_SILVER_PREMIUM = 1.10;

async function fetchWithTimeout(url: string, ms = 4000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
        const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } catch (e) {
        clearTimeout(timer);
        throw e;
    }
}

export async function GET() {
    try {
        // open.er-api.com — free, no auth, includes XAU/XAG metals
        const data = await fetchWithTimeout("https://open.er-api.com/v6/latest/USD");

        if (data?.result !== "success" || !data.rates) {
            return NextResponse.json(IBJA_FALLBACK);
        }

        const rates = data.rates as Record<string, number>;
        const inrPerUSD: number = rates["INR"] ?? 86.5;
        const xauPerUSD: number = rates["XAU"]; // troy oz of gold per 1 USD
        const xagPerUSD: number = rates["XAG"]; // troy oz of silver per 1 USD
        const xptPerUSD: number = rates["XPT"]; // troy oz of platinum per 1 USD

        if (!xauPerUSD || !xagPerUSD) {
            return NextResponse.json(IBJA_FALLBACK);
        }

        // International spot price per gram in INR
        const goldSpotPerGramINR = ((1 / xauPerUSD) / TROY_OZ_G) * inrPerUSD;
        const silverSpotPerGramINR = ((1 / xagPerUSD) / TROY_OZ_G) * inrPerUSD;
        const platSpotPerGramINR = xptPerUSD ? ((1 / xptPerUSD) / TROY_OZ_G) * inrPerUSD : null;

        // Apply India import duty + GST premium to match IBJA prices
        const gold24k = Math.round(goldSpotPerGramINR * INDIA_GOLD_PREMIUM);
        const silver = Math.round(silverSpotPerGramINR * INDIA_SILVER_PREMIUM);
        const plat = platSpotPerGramINR ? Math.round(platSpotPerGramINR * INDIA_GOLD_PREMIUM) : IBJA_FALLBACK.platinum;

        return NextResponse.json({
            gold24k,
            gold22k: Math.round(gold24k * (22 / 24)),
            gold18k: Math.round(gold24k * (18 / 24)),
            silver,
            platinum: plat,
            live: true,
            updatedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error("[metal-prices] API error:", String(err));
        // Return accurate IBJA fallback
        return NextResponse.json(IBJA_FALLBACK);
    }
}
