import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import RunLog from "@/models/RunLog";

export async function GET() {
    await dbConnect();
    try {
        const runs = await RunLog.find({}).sort({ score: -1, timeTaken: 1 }); // Higher score = better, Lower time = better
        return NextResponse.json({ success: true, data: runs });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch runs" }, { status: 400 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        const run = await RunLog.create(body);
        return NextResponse.json({ success: true, data: run }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to log run" }, { status: 400 });
    }
}
