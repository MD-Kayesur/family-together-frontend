import { NextRequest, NextResponse } from "next/server";
import { COUNTRY_TO_LANGUAGE_MAP, Language } from "@/lib/i18n/translations";

function isPrivateOrLocalIp(ip: string): boolean {
  if (!ip) return true;
  const cleanIp = ip.trim().toLowerCase();
  return (
    cleanIp === "::1" ||
    cleanIp === "127.0.0.1" ||
    cleanIp === "localhost" ||
    cleanIp.startsWith("10.") ||
    cleanIp.startsWith("192.168.") ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(cleanIp) ||
    cleanIp.startsWith("fc00:") ||
    cleanIp.startsWith("fe80:")
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryIp = searchParams.get("ip");

    // 1. Resolve client IP from headers
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfIp = request.headers.get("cf-connecting-ip");

    let clientIp = queryIp || (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || cfIp || "");

    const apiKey =
      process.env.IP2LOCATION_API_KEY ||
      process.env.NEXT_PUBLIC_IP2LOCATION_API_KEY ||
      "";

    // 2. Call IP2Location.io if key is configured
    if (apiKey) {
      try {
        let apiUrl = `https://api.ip2location.io/?key=${encodeURIComponent(apiKey)}`;
        
        // If an explicit non-local IP is known, pass it; otherwise let IP2Location detect the caller's public IP
        if (clientIp && !isPrivateOrLocalIp(clientIp)) {
          apiUrl += `&ip=${encodeURIComponent(clientIp)}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && data.country_code) {
            const countryCode = String(data.country_code).toUpperCase();
            const suggestedLanguage: Language =
              COUNTRY_TO_LANGUAGE_MAP[countryCode] || "en";

            return NextResponse.json({
              success: true,
              ip: data.ip || clientIp,
              countryCode: countryCode,
              countryName: data.country_name || "Unknown",
              regionName: data.region_name || "",
              cityName: data.city_name || "",
              timeZone: data.time_zone || "",
              suggestedLanguage,
              source: "ip2location",
            });
          }
        }
      } catch (apiErr) {
        console.warn("[IP2Location] Remote lookup failed, falling back to heuristics:", apiErr);
      }
    }

    // 3. Fallback Heuristics (e.g. localhost, no API key, or network offline)
    // Inspect Accept-Language and client headers
    const acceptLanguage = request.headers.get("accept-language") || "";
    let fallbackLang: Language = "en";
    let fallbackCountry = "US";
    let fallbackCity = "Local";

    if (acceptLanguage.toLowerCase().includes("bn")) {
      fallbackLang = "bn";
      fallbackCountry = "BD";
      fallbackCity = "Dhaka";
    }

    // If explicit query was for a BD IP (e.g., 103.103.35.94)
    if (queryIp && (queryIp.startsWith("103.") || queryIp.startsWith("118."))) {
      fallbackLang = "bn";
      fallbackCountry = "BD";
      fallbackCity = "Dhaka";
    }

    return NextResponse.json({
      success: true,
      ip: clientIp || "127.0.0.1",
      countryCode: fallbackCountry,
      countryName: fallbackCountry === "BD" ? "Bangladesh" : "United States",
      regionName: fallbackCountry === "BD" ? "Dhaka" : "California",
      cityName: fallbackCity,
      suggestedLanguage: fallbackLang,
      source: apiKey ? "ip2location_fallback" : "heuristic_fallback",
      note: apiKey ? undefined : "Set IP2LOCATION_API_KEY in .env for live geo lookup",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to resolve geolocation",
        suggestedLanguage: "en",
      },
      { status: 500 }
    );
  }
}
