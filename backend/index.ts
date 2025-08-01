import express from 'express';
import cors from 'cors';
import { scrapeRecipe } from './scraper';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
