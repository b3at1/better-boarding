import { NextResponse, NextRequest } from "next/server";

type Result = number[][];

export interface JobResult {
  result: Result;
  timeTaken: number;
}

interface JobResults {
  [jobId: string]: JobResult;
}

const jobResults: JobResults = {};

// clear job results every 10 minutes
setInterval(() => {
  for (const jobId in jobResults) {
    delete jobResults[jobId];
  }
}, 60 * 1000);

export async function POST(req: NextRequest) {
  const { jobId, result, timeTaken } = await req.json();
  console.log("Finishing job:", jobId);
  jobResults[jobId] = { result, timeTaken };
  console.log("Job results:", jobResults);
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId") as string;
  console.log("Getting job result:", jobId);
  console.log("Job results:", jobResults[jobId]);
  return NextResponse.json(jobResults[jobId]);
}

export function getJobResult(jobId: string) {
  return fetch("/api/finish?jobId=" + jobId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}