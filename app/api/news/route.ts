import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://finnhub.io/api/v1/news?category=general&token=d6ffprhr01qjq8n1g3d0d6ffprhr01qjq8n1g3dg"
    );

    // Check if request failed
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch news" },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Check if data exists
    if (!data) {
      return NextResponse.json(
        { error: "No data received" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}