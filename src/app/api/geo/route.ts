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
    const queryCountry = searchParams.get("country");

    // 1. Resolve client IP and Edge Country Headers
    const edgeCountry = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry");
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfIp = request.headers.get("cf-connecting-ip");

    let clientIp = queryIp || (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || cfIp || "");

    // Allow instant testing via ?country=XX query param
    if (queryCountry) {
      const countryCode = queryCountry.toUpperCase();
      const suggestedLanguage: Language = COUNTRY_TO_LANGUAGE_MAP[countryCode] || "en";
      return NextResponse.json({
        success: true,
        ip: clientIp || "127.0.0.1",
        countryCode,
        countryName: getCountryNameByCode(countryCode),
        cityName: "Simulated Location",
        regionName: "Test Region",
        suggestedLanguage,
        source: "query_simulation",
      });
    }

    // 2. Check Edge Gateway Headers (Vercel / Cloudflare provide this for free with zero API keys)
    if (edgeCountry && edgeCountry.length === 2 && edgeCountry.toUpperCase() !== "XX") {
      const countryCode = edgeCountry.toUpperCase();
      const suggestedLanguage: Language = COUNTRY_TO_LANGUAGE_MAP[countryCode] || "en";
      return NextResponse.json({
        success: true,
        ip: clientIp || "edge_ip",
        countryCode,
        countryName: getCountryNameByCode(countryCode),
        cityName: request.headers.get("x-vercel-ip-city") || "",
        regionName: request.headers.get("x-vercel-ip-country-region") || "",
        suggestedLanguage,
        source: "edge_header",
      });
    }

    const apiKey =
      process.env.IP2LOCATION_API_KEY ||
      process.env.NEXT_PUBLIC_IP2LOCATION_API_KEY ||
      "";

    // 3. Call IP2Location.io if key is configured
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
              countryName: data.country_name || getCountryNameByCode(countryCode),
              regionName: data.region_name || "",
              cityName: data.city_name || "",
              timeZone: data.time_zone || "",
              suggestedLanguage,
              source: "ip2location",
            });
          }
        }
      } catch (apiErr) {
        console.warn("[IP2Location] Remote lookup failed, falling back to public IP resolution:", apiErr);
      }
    }

    // 4. Free Public IP Geolocation (Zero-config fallback: no API key required!)
    try {
      let publicApiUrl = "https://freeipapi.com/api/json/";
      if (clientIp && !isPrivateOrLocalIp(clientIp)) {
        publicApiUrl += encodeURIComponent(clientIp);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const pubRes = await fetch(publicApiUrl, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      clearTimeout(timeoutId);

      if (pubRes.ok) {
        const pubData = await pubRes.json();
        if (pubData && pubData.countryCode) {
          const countryCode = String(pubData.countryCode).toUpperCase();
          const suggestedLanguage: Language = COUNTRY_TO_LANGUAGE_MAP[countryCode] || "en";

          return NextResponse.json({
            success: true,
            ip: pubData.ipAddress || clientIp,
            countryCode,
            countryName: pubData.countryName || getCountryNameByCode(countryCode),
            regionName: pubData.regionName || "",
            cityName: pubData.cityName || "",
            timeZone: pubData.timeZone || "",
            suggestedLanguage,
            source: "free_ip_resolver",
          });
        }
      }
    } catch {
      // Fall through to browser heuristics
    }

    // 5. Fallback Heuristics for offline / localhost without public internet
    const acceptLanguage = (request.headers.get("accept-language") || "").toLowerCase();
    let fallbackLang: Language = "en";
    let fallbackCountry = "US";
    let fallbackCity = "Washington";

    // Heuristic: check accept-language header
    if (acceptLanguage.includes("bn")) {
      fallbackLang = "bn";
      fallbackCountry = "BD";
      fallbackCity = "Dhaka";
    } else if (acceptLanguage.includes("es")) {
      fallbackLang = "es";
      fallbackCountry = "ES";
      fallbackCity = "Madrid";
    } else if (acceptLanguage.includes("fr")) {
      fallbackLang = "fr";
      fallbackCountry = "FR";
      fallbackCity = "Paris";
    } else if (acceptLanguage.includes("de")) {
      fallbackLang = "de";
      fallbackCountry = "DE";
      fallbackCity = "Berlin";
    } else if (acceptLanguage.includes("ar")) {
      fallbackLang = "ar";
      fallbackCountry = "SA";
      fallbackCity = "Riyadh";
    } else if (acceptLanguage.includes("hi")) {
      fallbackLang = "hi";
      fallbackCountry = "IN";
      fallbackCity = "New Delhi";
    } else if (acceptLanguage.includes("zh")) {
      fallbackLang = "zh";
      fallbackCountry = "CN";
      fallbackCity = "Beijing";
    } else if (acceptLanguage.includes("ja")) {
      fallbackLang = "ja";
      fallbackCountry = "JP";
      fallbackCity = "Tokyo";
    } else if (acceptLanguage.includes("pt")) {
      fallbackLang = "pt";
      fallbackCountry = "BR";
      fallbackCity = "Brasília";
    } else if (acceptLanguage.includes("ru")) {
      fallbackLang = "ru";
      fallbackCountry = "RU";
      fallbackCity = "Moscow";
    } else if (acceptLanguage.includes("it")) {
      fallbackLang = "it";
      fallbackCountry = "IT";
      fallbackCity = "Rome";
    } else if (acceptLanguage.includes("ko")) {
      fallbackLang = "ko";
      fallbackCountry = "KR";
      fallbackCity = "Seoul";
    } else if (acceptLanguage.includes("tr")) {
      fallbackLang = "tr";
      fallbackCountry = "TR";
      fallbackCity = "Ankara";
    } else if (acceptLanguage.includes("ur")) {
      fallbackLang = "ur";
      fallbackCountry = "PK";
      fallbackCity = "Islamabad";
    } else if (acceptLanguage.includes("id")) {
      fallbackLang = "id";
      fallbackCountry = "ID";
      fallbackCity = "Jakarta";
    } else {
      // Default to English (United States)
      fallbackLang = "en";
      fallbackCountry = "US";
      fallbackCity = "Washington";
    }

    return NextResponse.json({
      success: true,
      ip: clientIp || "127.0.0.1",
      countryCode: fallbackCountry,
      countryName: getCountryNameByCode(fallbackCountry),
      regionName: "Local",
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

function getCountryNameByCode(code: string): string {
  const map: Record<string, string> = {
    US: "United States",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    NZ: "New Zealand",
    BD: "Bangladesh",
    IN: "India",
    ES: "Spain",
    MX: "Mexico",
    AR: "Argentina",
    FR: "France",
    DE: "Germany",
    SA: "Saudi Arabia",
    AE: "United Arab Emirates",
    CN: "China",
    JP: "Japan",
    BR: "Brazil",
    PT: "Portugal",
    RU: "Russia",
    IT: "Italy",
    KR: "South Korea",
    TR: "Turkey",
    PK: "Pakistan",
    ID: "Indonesia",
    MY: "Malaysia",
    VN: "Vietnam",
    TH: "Thailand",
    NL: "Netherlands",
    PL: "Poland",
    SE: "Sweden",
    GR: "Greece",
    IR: "Iran",
    PH: "Philippines",
  };
  return map[code] || code;
}
