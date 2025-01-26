import { NextApiRequest, NextApiResponse } from 'next';

export type Result = number[][];

interface JobResults {
    [jobId: string]: Result;
}

let jobResults: JobResults = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { jobId, result } = req.body;
        jobResults[jobId] = result;
        res.status(200).json({ message: 'Job result received' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export function getJobResult(jobId: string) {
    return jobResults[jobId];
}