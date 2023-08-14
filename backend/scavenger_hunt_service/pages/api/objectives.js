import NextCors from 'nextjs-cors';

const data = { objectives: [
    {
        id: 1,
        title: "With the Fris? No Way!",
        description: "Pose with a frisbee."
    },
    {
        id: 2,
        title: "Burger Boulevard",
        description: "Find 3 restaurants side-by-side."
    }
]}

export default async function handler(req, res) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });

    return res.status(200).json(data);
}