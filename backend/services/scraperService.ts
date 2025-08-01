import axios from 'axios';
import * as cheerio from 'cheerio';

type CheerioAPI = cheerio.CheerioAPI;

function scrapeKurashiru($: CheerioAPI) {
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('ul.recipeIngredients__list li').each((_: any, el: any) => {
    ingredients.push($(el).text().trim());
  });
  return { name, ingredients };
}

function scrapeCookpad($: CheerioAPI) {
  const name = $('.recipe-title').first().text().trim() || $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('.ingredient_name').each((_: any, el: any) => {
    ingredients.push($(el).text().trim());
  });
  return { name, ingredients };
}

function scrapeDelishKitchen($: CheerioAPI) {
  const name = $('.recipe-title').first().text().trim() || $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('.ingredient-list__item').each((_: any, el: any) => {
    ingredients.push($(el).text().trim());
  });
  return { name, ingredients };
}

function scrapeShirogohan($: CheerioAPI) {
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('.ingredient-list li, .ingredient-list__item').each((_: any, el: any) => {
    ingredients.push($(el).text().trim());
  });
  return { name, ingredients };
}

function scrapeKikkoman($: CheerioAPI) {
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('.ingredient-list__item, .ingredient-list li').each((_: any, el: any) => {
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
  $('.ingredient-list__item, .ingredient-list li').each((_: any, el: any) => {
    ingredients.push($(el).text().trim());
  });
  return { name, ingredients };
}

function scrapeKyouNoRyouri($: CheerioAPI) {
  const name = $('h1').first().text().trim();
  const ingredients: string[] = [];
  $('.ingredient-list__item, .ingredient-list li').each((_: any, el: any) => {
    ingredients.push($(el).text().trim());
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
  if (hostname.includes('shirogohan')) return 'shirogohan';
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
    case 'shir0gohan': return scrapeShirogohan($);
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
  return extractRecipe(siteType, $);
}
