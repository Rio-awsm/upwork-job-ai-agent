import { FilterByAI } from "./filterByAI.js";
import { getJobs } from "./getJobs.js";
import dotenv from 'dotenv';
dotenv.config();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function processJobs(jobs, batchSize = 3) {
    const results = [];
    
    for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(async (job) => {
                try {
                    const isDevelopmentJob = await FilterByAI(job);
                    return isDevelopmentJob ? job : null;
                } catch (error) {
                    console.error(`Error processing job ${job.id}:`, error.message);
                    return null;
                }
            })
        );
        
        results.push(...batchResults.filter(Boolean));
        
        if (i + batchSize < jobs.length) {
            await delay(1000);
        }
    }
    
    return results;
}

async function main() {
    const allJobs = await getJobs();
    const twelveHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    
    const recentJobs = allJobs.filter(job => {
        const jobTime = new Date(job.timestamp);
        return jobTime >= twelveHoursAgo;
    }).map(job => ({
        id: job.id,
        title: job.title,
        link: job.link,
        skills: job.skills
    }));

    const developmentJobs = await processJobs(recentJobs);
    console.log(JSON.stringify(developmentJobs, null, 2));
}

main();