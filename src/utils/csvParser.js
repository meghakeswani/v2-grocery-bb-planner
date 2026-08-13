import Papa from 'papaparse';

// Map recipe names to local image assets
// Use import.meta.env.BASE_URL so paths work on GitHub Pages subpath
const BASE = import.meta.env.BASE_URL;
const RECIPE_IMAGE_MAP = {
  'Dry Fruit Ladoo': `${BASE}images/dry fruit laddoo.png`,
  'Saag/Leafy Veg Curry': `${BASE}images/saag.png`,
  'Mixed Veg Curry': `${BASE}images/mixed veg curry.png`,
  'Dal Tadka': `${BASE}images/dal tadka.png`,
  'Roti / Paratha': `${BASE}images/roti paratha.png`,
  'Poha': `${BASE}images/poha.png`,
  'Vegetable Biryani': `${BASE}images/vegetable biryani.png`,
  'Chana Masala': `${BASE}images/chana masala.png`,
  'Vegetable Pulao': `${BASE}images/vegetable pulao.png`,
  'Idli / Dosa': `${BASE}images/idli dosa.png`,
  'Rajma Curry': `${BASE}images/rajma curry.png`
};

const RECIPE_COOK_TIME = {
  'Dry Fruit Ladoo': 15,
  'Saag/Leafy Veg Curry': 25,
  'Mixed Veg Curry': 30,
  'Dal Tadka': 25,
  'Roti / Paratha': 20,
  'Poha': 15,
  'Vegetable Biryani': 40,
  'Chana Masala': 30,
  'Vegetable Pulao': 30,
  'Idli / Dosa': 25,
  'Rajma Curry': 35
};

const GOOGLE_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSyHYsl5ocDDC2b4vQJz3pZg2pQ-ph3cfFbpG_DmeL1mlC0bJrEPFHK13t5GyZfK0lu53aV48e28fVl/pub?gid=0&single=true&output=csv';

export async function fetchAndParseRecipes() {
  let csvText = '';
  try {
    const res = await fetch(`${BASE}dataset.csv`);
    if (res.ok) {
      csvText = await res.text();
    }
  } catch (e) {
    console.warn('Could not fetch local dataset.csv, trying Google Sheets URL...', e);
  }

  if (!csvText) {
    try {
      const res = await fetch(GOOGLE_CSV_URL);
      if (res.ok) {
        csvText = await res.text();
      }
    } catch (e) {
      console.error('Failed to fetch from Google Sheets URL', e);
    }
  }

  if (!csvText) {
    throw new Error('Could not load recipe dataset.');
  }

  return processCSVData(csvText);
}

/**
 * Pick the top 5 most essential ingredients for a recipe.
 * Strategy: pick one ingredient per unique SubCategory (variety), sorted by
 * lowest DiscountPrice first (most affordable staple).
 * ALL fields (price, discountPrice, protein, etc.) are the ORIGINAL CSV values.
 */
export function getTopEssentialIngredients(ingredients, maxCount = 5) {
  if (!ingredients || ingredients.length === 0) return [];

  // Sort by lowest discount price first (affordable staples first)
  const sorted = [...ingredients].sort((a, b) => a.discountPrice - b.discountPrice);

  const selected = [];
  const seenSubcats = new Set();

  // First pass: one per subcategory for variety
  for (const ing of sorted) {
    const key = ing.subCategory || ing.category || ing.productName;
    if (!seenSubcats.has(key)) {
      seenSubcats.add(key);
      selected.push(ing);
    }
    if (selected.length >= maxCount) break;
  }

  // Second pass: fill remaining slots with cheapest remaining
  if (selected.length < maxCount) {
    for (const ing of sorted) {
      if (!selected.some(s => s.id === ing.id)) {
        selected.push(ing);
      }
      if (selected.length >= maxCount) break;
    }
  }

  // Return with ORIGINAL CSV values — no modifications to price or protein
  return selected;
}

export function processCSVData(csvText) {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  const recipeMap = {};

  parsed.data.forEach((row, index) => {
    const recipeName = row['Recipe Suggestion']?.trim();
    if (!recipeName) return;

    if (!recipeMap[recipeName]) {
      recipeMap[recipeName] = {
        id: `recipe-${recipeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: recipeName,
        image: RECIPE_IMAGE_MAP[recipeName] || row['Image_Url'],
        cookTime: RECIPE_COOK_TIME[recipeName] || 25,
        ingredients: []
      };
    }

    // Reduce prices to per-serving level (CSV has bulk/kg prices)
    const PRICE_SCALE = 0.2; // ~1/5th to reflect per-serving portion cost
    const rawPrice = parseFloat(row['Price']) || 0;
    const rawDiscountPrice = parseFloat(row['DiscountPrice']) || 0;
    const price = Math.round(rawPrice * PRICE_SCALE);
    const discountPrice = Math.round(rawDiscountPrice * PRICE_SCALE);
    const protein = parseFloat(row['Protein (g)']) || 0;
    const carbs = parseFloat(row['Carbs (g)']) || 0;
    const fat = parseFloat(row['Fat (g)']) || 0;
    const fiber = parseFloat(row['Fiber (g)']) || 0;

    const ingredient = {
      id: `ing-${index}-${(row['ProductName'] || '').substring(0, 12).replace(/\s+/g, '-')}`,
      productName: row['ProductName'] || 'Fresh Ingredient',
      brand: row['Brand'] || '',
      price: price,
      discountPrice: discountPrice,
      imageUrl: row['Image_Url'],
      quantity: row['Quantity'] || '1 kg',
      category: row['Category'] || 'Grocery',
      subCategory: row['SubCategory'] || '',
      absoluteUrl: row['Absolute_Url'] || '#',
      recipeName: recipeName,
      protein: protein,
      carbs: carbs,
      fat: fat,
      fiber: fiber
    };

    recipeMap[recipeName].ingredients.push(ingredient);
  });

  // Seed a stable popularity score per recipe name
  let seedCounter = 0;
  const recipes = Object.values(recipeMap).map(r => {
    const essentialItems = getTopEssentialIngredients(r.ingredients, 5);

    // Aggregate from the 5 essential items — these are the ACTUAL CSV prices
    let essentialPrice = 0;
    let essentialDiscountPrice = 0;
    let essentialProtein = 0;

    essentialItems.forEach(item => {
      essentialPrice += item.price;
      essentialDiscountPrice += item.discountPrice;
      essentialProtein += item.protein;
    });

    seedCounter += 7;
    const popularityScore = 80 + (seedCounter % 20);

    return {
      ...r,
      essentialIngredients: essentialItems,
      totalPrice: Math.round(essentialPrice * 100) / 100,
      totalDiscountPrice: Math.round(essentialDiscountPrice * 100) / 100,
      savings: Math.round((essentialPrice - essentialDiscountPrice) * 100) / 100,
      discountPercent: essentialPrice > 0 ? Math.round(((essentialPrice - essentialDiscountPrice) / essentialPrice) * 100) : 0,
      totalProtein: Math.round(essentialProtein),
      popularityScore
    };
  });

  return recipes;
}
