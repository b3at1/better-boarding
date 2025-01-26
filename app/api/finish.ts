import { NextApiRequest, NextApiResponse } from 'next';

export type Result = number[][];

interface JobResults {
    [jobId: string]: Result;
}

const jobResults: JobResults = {};

// clear job results every 10 minutes
setInterval(() => {
    for (const jobId in jobResults) {
        delete jobResults[jobId];
    }
}, 60 * 1000);

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