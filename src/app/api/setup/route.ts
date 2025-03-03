import { setupLanceDB } from "@/app/db/lancedb";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await setupLanceDB();
    return NextResponse.json({
      message: "LanceDB setup completed successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to setup LanceDB" },
      { status: 500 },
    );
  }
}
