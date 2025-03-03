import { searchMovies } from "@/app/db/lancedb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { query } = body;

  if (!query || query.trim() === "") {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const results = await searchMovies(query);
    console.log(results);
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
