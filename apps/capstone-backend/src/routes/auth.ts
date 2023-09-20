import express from 'express';

const router = express.Router();

router.get('/login', (req, res) => {
  res.send({ message: 'Welcome to capstone-backend!' });
});

export default router;
