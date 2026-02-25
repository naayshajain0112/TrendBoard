import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://finnhub.io/api/v1/news?category=general&token=d6ffprhr01qjq8n1g3d0d6ffprhr01qjq8n1g3dg"
  );

  const data = await res.json();

  return NextResponse.json(data);
}