import axios from 'axios';
import * as cheerio from 'cheerio';

type CheerioAPI = cheerio.CheerioAPI;

function scrapeKurashiru($: CheerioAPI) {
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('ul.ingredient-list li').each((_: any, el: any) => {
    ingredients.push($(el).text().trim());
  });
  return { name, ingredients };
}

function scrapeCookpad($: CheerioAPI) {
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];
  // 材料リストの各liをループ
  $('.ingredient-list li').each((_: any, el: any) => {
    const names: string[] = [];
    $(el).find('span').contents().each((_: any, node: any) => {
      if (node.type === 'tag' && node.name === 'a') {
        names.push($(node).text().trim());
      } else if (node.type === 'text') {
        const text = node.data.trim();
        if (text) names.push(text);
      }
    });
    // 分量部分
    const quantity = $(el).find('bdi').text().trim();
    const ingredient = names.join('') + (quantity ? ` ${quantity}` : '');
    ingredients.push(ingredient);
  });
  return { name, ingredients };
}

function scrapeDelishKitchen($: CheerioAPI) {
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('ul.ingredient-list li').each((_: any, el: any) => {
    ingredients.push($(el).text().trim());
  });
  return { name, ingredients };
}

function scrapeSirogohan($: CheerioAPI) {
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('.material-halfbox li').each((_: any, el: any) => {
    ingredients.push($(el).text().trim());
  });
  return { name, ingredients };
}

function scrapeKikkoman($: CheerioAPI) {
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('ul.recipe-detail-ingredient__list li').each((_: any, el: any) => {
    ingredients.push($(el).text().trim());
  });
  return { name, ingredients };
}

function scrapeAjinomoto($: CheerioAPI) {
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('ul.recipeIngredients__list li').each((_: any, el: any) => {
    ingredients.push($(el).text().trim());
  });
  return { name, ingredients };
}

function scrapeMizkan($: CheerioAPI) {
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('.recipeTopAbout_ingredients li').each((_: any, el: any) => {
    const text = $(el).text().trim();
    if (text) ingredients.push(text);
  });
  return { name, ingredients };
}

function scrapeKyouNoRyouri($: CheerioAPI) {
  const name = $('h1.ttl').first().text().trim();
  const ingredients: string[] = [];
  $('#ingredients_list dl').each((_: any, el: any) => {
    const dt = $(el).find('dt');
    const ingredientName = dt.find('span.ingredient').text().trim();
    const quantity = dt.find('span.floatright').text().trim();
    if (ingredientName) {
      ingredients.push(quantity ? `${ingredientName} ${quantity}` : ingredientName);
    }
  });
  return { name, ingredients };
}

function scrapeDefault($: CheerioAPI) {
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('ul li').each((_: any, el: any) => {
    ingredients.push($(el).text().trim());
  });
  return { name, ingredients };
}

async function fetchHtml(url: string): Promise<string> {
  const { data } = await axios.get(url);
  return data;
}

function getSiteType(url: string): string {
  const hostname = new URL(url).hostname;
  if (hostname.includes('kurashiru')) return 'kurashiru';
  if (hostname.includes('cookpad')) return 'cookpad';
  if (hostname.includes('delishkitchen')) return 'delishkitchen';
  if (hostname.includes('sirogohan')) return 'sirogohan';
  if (hostname.includes('kikkoman')) return 'kikkoman';
  if (hostname.includes('ajinomoto')) return 'ajinomoto';
  if (hostname.includes('mizkan')) return 'mizkan';
  if (hostname.includes('kyounoryouri')) return 'kyounoryouri';
  return 'default';
}

function extractRecipe(siteType: string, $: CheerioAPI) {
  switch (siteType) {
    case 'kurashiru': return scrapeKurashiru($);
    case 'cookpad': return scrapeCookpad($);
    case 'delishkitchen': return scrapeDelishKitchen($);
    case 'sirogohan': return scrapeSirogohan($);
    case 'kikkoman': return scrapeKikkoman($);
    case 'ajinomoto': return scrapeAjinomoto($);
    case 'mizkan': return scrapeMizkan($);
    case 'kyounoryouri': return scrapeKyouNoRyouri($);
    default: return scrapeDefault($);
  }
}

export async function scrapeRecipe(url: string) {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);
  const siteType = getSiteType(url);
  console.log(`Scraping ${siteType} recipe from: ${url}`);
  return extractRecipe(siteType, $);
}
