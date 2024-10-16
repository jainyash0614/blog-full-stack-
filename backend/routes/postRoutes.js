import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { isAuthenticated, isAuthor } from '../middleware/auth.js';
import { createPost, getPosts, getPost, updatePost, deletePost, likePost, unlikePost, addComment, getComments, getAudio } from '../controllers/postController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

router.post('/', isAuthenticated, upload.single('image'), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/:id', isAuthenticated, isAuthor, upload.single('image'), updatePost);
router.delete('/:id', isAuthenticated, isAuthor, deletePost);
router.post('/:id/like', isAuthenticated, likePost);
router.delete('/:id/like', isAuthenticated, unlikePost);
router.post('/:id/comments', isAuthenticated, addComment);
router.get('/:id/comments', getComments);
router.get('/:id/audio', getAudio);

export default router;