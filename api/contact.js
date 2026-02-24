export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, role, context } = req.body;

  console.log("New submission:", { name, email, role, context });

  return res.status(200).json({ message: 'Submission received' });
}
