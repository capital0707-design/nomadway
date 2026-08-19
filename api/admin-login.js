export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = req.body || {};
  const admin = process.env.ADMIN_PASSWORD;
  if (!admin) return res.status(500).json({ error: 'ADMIN_PASSWORD not set' });
  if (password === admin) return res.status(200).json({ ok: true });
  return res.status(401).json({ error: 'Invalid password' });
}