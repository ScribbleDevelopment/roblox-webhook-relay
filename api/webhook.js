export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { webhookUrl, data } = req.body;

        // Basic validation
        if (!webhookUrl || !data) {
            return res.status(400).json({ error: 'Missing webhookUrl or data' });
        }

        // Forward the payload from Roblox to your final destination (like Discord)
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errText = await response.text();
            return res.status(response.status).json({ error: errText });
        }

        return res.status(200).json({ success: true, message: 'Webhook forwarded successfully!' });
    } catch (error) {
        console.error('Webhook proxy error:', error);
        return res.status(500).json({ error: error.message });
    }
}
