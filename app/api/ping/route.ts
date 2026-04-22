import { NextRequest, NextResponse } from "next/server"
import { sites } from "@/lib/sites"

export const dynamic = "force-static"

export async function GET() {
  return NextResponse.json({
    status: "online",
    statusCode: 200,
  })
}
