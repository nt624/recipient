import express from 'express';
import { scrapeRecipe } from '../services/scraperService';

const router = express.Router();

router.post('/scrape', async (req, res) => {
  const { url } = req.body;
  console.error('url:', url); // デバッグ用ログ
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const recipe = await scrapeRecipe(url);
    res.json(recipe);
  } catch (err) {
    console.error('Scrape error:', err);
    res.status(500).json({ error: 'Failed to scrape recipe' });
  }
});

export default router;
