import db from '../config/database.js';
import textToSpeech from '@google-cloud/text-to-speech';
import { Readable } from 'stream';
import fs from 'fs';
import util from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new textToSpeech.TextToSpeechClient();

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user.id;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await db.query(
      'INSERT INTO blog_posts (title, content, author_id, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, authorId, imageUrl]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

export const getPosts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT blog_posts.*, users.email as author_email, COUNT(likes.id) as likes_count
      FROM blog_posts
      JOIN users ON blog_posts.author_id = users.id
      LEFT JOIN likes ON blog_posts.id = likes.post_id
      GROUP BY blog_posts.id, users.email
      ORDER BY blog_posts.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

export const getPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user ? req.user.id : null;

  try {
    const result = await db.query(`
      SELECT p.*, u.email as author_email, 
             COUNT(DISTINCT l.id) as likes_count, 
             BOOL_OR(l.user_id = $2) as user_liked
      FROM blog_posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.id = $1
      GROUP BY p.id, u.email
    `, [postId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post' });
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let result;
    if (imageUrl) {
      result = await db.query(
        'UPDATE blog_posts SET title = $1, content = $2, image_url = $3 WHERE id = $4 RETURNING *',
        [title, content, imageUrl, postId]
      );
    } else {
      result = await db.query(
        'UPDATE blog_posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
        [title, content, postId]
      );
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post' });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    await db.query('DELETE FROM blog_posts WHERE id = $1', [postId]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
};

export const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    await db.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)', [userId, postId]);
    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post' });
  }
};

export const unlikePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    await db.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [userId, postId]);
    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post' });
  }
};

export const addComment = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { content } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, postId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
};

export const getComments = async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await db.query(
      'SELECT comments.*, users.email as user_email FROM comments JOIN users ON comments.user_id = users.id WHERE post_id = $1 ORDER BY created_at DESC',
      [postId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

export const getAudio = async (req, res) => {
  const postId = req.params.id;

  try {
        // Fetch the post content
        const result = await db.query('SELECT content FROM blog_posts WHERE id = $1', [postId]);
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        const postContent = result.rows[0].content;
    
        // Remove HTML tags from the content
        const plainText = postContent.replace(/<[^>]*>?/gm, '');
    
        // Configure the text-to-speech request
        const request = {
          input: { text: plainText },
          voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' },
        };
    
        // Perform the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);
    
        // Create a unique filename for the audio file
        const fileName = `audio_${postId}_${Date.now()}.mp3`;
        const filePath = path.join(__dirname, '../uploads', fileName);
    
        // Write the audio content to a file
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(filePath, response.audioContent, 'binary');
    
        // Send the audio file URL to the client
        res.json({ audioUrl: `/uploads/${fileName}` });
      } catch (error) {
        console.error('Error generating audio:', error);
        res.status(500).json({ message: 'Error generating audio' });
      }
    };
    