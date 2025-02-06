import axios from "axios";

export async function getJobs() {
    const config = {
        method: 'get',
        url: 'https://upwork-jobs.p.rapidapi.com/jobs',
        headers: { 
            'x-rapidapi-host': 'upwork-jobs.p.rapidapi.com', 
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        }
    };
    
    const response = await axios.request(config);
    return response.data;
}