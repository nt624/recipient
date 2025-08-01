import express from 'express';
import cors from 'cors';
import recipeController from './controllers/recipeController';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// ルーティングをコントローラー層に委譲
app.use('/api', recipeController);

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
