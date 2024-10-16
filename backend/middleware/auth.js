import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAuthor = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await db.query('SELECT author_id FROM blog_posts WHERE id = $1', [postId]);
    if (result.rows[0].author_id !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};