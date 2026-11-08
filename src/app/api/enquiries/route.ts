import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import { notifyTeam, saveEnquiry, validateEnquiry } from "@/lib/enquiries";

// Simple per-instance rate limit: 5 submissions per IP per 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill the hidden "company_url" field.
  if (typeof body.company_url === "string" && body.company_url.length > 0) {
    return NextResponse.json({ ok: true, id: "received" });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many submissions. Please try again shortly." }, { status: 429 });
  }

  const result = validateEnquiry(body);
  if (!result.ok) return NextResponse.json({ error: "Please check the highlighted fields.", errors: result.errors }, { status: 422 });

  try {
    const { id } = await saveEnquiry(result.data);
    after(async () => {
      try {
        await notifyTeam(result.data, id);
      } catch (err) {
        console.error("[enquiries] notification failed", err);
      }
    });
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("[enquiries] save failed", err);
    return NextResponse.json({ error: "We couldn't save your enquiry. Please try again or reach us on WhatsApp." }, { status: 500 });
  }
}
