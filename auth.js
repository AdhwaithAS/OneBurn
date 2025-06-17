export function apiAuth(requiredKey) {
  return (req, res, next) => {
    const userKey = req.headers['x-api-key'];
    if (!userKey || userKey !== requiredKey) {
      return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }
    next();
  };
}
