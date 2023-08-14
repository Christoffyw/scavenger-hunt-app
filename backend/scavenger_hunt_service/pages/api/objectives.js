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
    if (req.method === 'OPTIONS') {
        console.log("PREFLIGHT OK")
        return res.status(200).send('Preflight ok');
    }
    return res.status(200).json(data);
}