import axios from 'axios';
import cheerio from 'cheerio';

export async function scrapeRecipe(url: string) {
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  // 例：レシピ名と材料の抽出（サイトにより要調整）
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];

  $('ul.ingredients li').each((_, el) => {
    ingredients.push($(el).text().trim());
  });

  return { name, ingredients };
}
