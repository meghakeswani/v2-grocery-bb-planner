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

export function formatRecipeQuantity(packetQtyStr = '') {
  const lower = packetQtyStr.toLowerCase().trim();
  if (lower.includes('1 kg') || lower.includes('1kg')) return '200g';
  if (lower.includes('500g') || lower.includes('500 g')) return '100g';
  if (lower.includes('250g') || lower.includes('250 g')) return '50g';
  if (lower.includes('100g') || lower.includes('100 g')) return '25g';
  if (lower.includes('1 l') || lower.includes('1l')) return '200ml';
  if (lower.includes('500 ml') || lower.includes('500ml')) return '100ml';
  if (lower.includes('pc') || lower.includes('piece')) return '1 unit';
  return '1 portion';
}

export function calculateUsages(packetQtyStr = '', recipeQtyStr = '') {
  const pLower = packetQtyStr.toLowerCase().trim();
  const rLower = recipeQtyStr.toLowerCase().trim();

  // Extract numeric grams/ml
  let pNum = 1000;
  if (pLower.includes('kg')) pNum = (parseFloat(pLower) || 1) * 1000;
  else if (pLower.includes('g')) pNum = parseFloat(pLower) || 500;
  else if (pLower.includes('l')) pNum = (parseFloat(pLower) || 1) * 1000;
  else if (pLower.includes('ml')) pNum = parseFloat(pLower) || 500;
  else if (pLower.includes('pc') || pLower.includes('unit')) pNum = 1;

  let rNum = 200;
  if (rLower.includes('kg')) rNum = (parseFloat(rLower) || 0.2) * 1000;
  else if (rLower.includes('g')) rNum = parseFloat(rLower) || 100;
  else if (rLower.includes('l')) rNum = (parseFloat(rLower) || 0.2) * 1000;
  else if (rLower.includes('ml')) rNum = parseFloat(rLower) || 100;
  else if (rLower.includes('unit') || rLower.includes('portion')) rNum = 1;

  if (rNum <= 0) return 3;
  const rawRatio = Math.round(pNum / rNum);
  return Math.min(10, Math.max(1, rawRatio || 5));
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

    const packetQty = row['Quantity'] || '1 kg';
    const recipeQty = formatRecipeQuantity(packetQty);
    const usages = calculateUsages(packetQty, recipeQty);

    const ingredient = {
      id: `ing-${index}-${(row['ProductName'] || '').substring(0, 12).replace(/\s+/g, '-')}`,
      productName: row['ProductName'] || 'Fresh Ingredient',
      brand: row['Brand'] || '',
      // Single recipe portion prices
      price: price,
      discountPrice: discountPrice,
      recipePrice: price,
      recipeDiscountPrice: discountPrice,
      // Full buying store packet prices (as requested for the Cart)
      packetPrice: Math.round(rawPrice),
      packetDiscountPrice: Math.round(rawDiscountPrice),
      // Quantities & Usages
      quantity: packetQty, // Store buying packet quantity (e.g. 50g, 500g, 1 kg)
      recipeQuantity: recipeQty, // Specific quantity needed for 1 recipe (e.g. 200g, 50g)
      usages: usages, // How many times / recipes this packet serves (e.g. 5)
      usagesText: `x${usages}`,
      imageUrl: row['Image_Url'],
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

    // Aggregate from the 5 essential items — single portion vs full packet
    let essentialPrice = 0;
    let essentialDiscountPrice = 0;
    let essentialProtein = 0;
    let essentialCarbs = 0;
    let essentialFat = 0;
    let essentialFiber = 0;
    let packetPriceSum = 0;
    let packetDiscountPriceSum = 0;

    essentialItems.forEach(item => {
      essentialPrice += item.price;
      essentialDiscountPrice += item.discountPrice;
      essentialProtein += item.protein;
      essentialCarbs += (item.carbs || 0);
      essentialFat += (item.fat || 0);
      essentialFiber += (item.fiber || 0);
      packetPriceSum += item.packetPrice;
      packetDiscountPriceSum += item.packetDiscountPrice;
    });

    seedCounter += 7;
    const popularityScore = 80 + (seedCounter % 20);

    const calories = Math.round(essentialProtein * 4 + essentialCarbs * 4 + essentialFat * 9) || 340;

    return {
      ...r,
      essentialIngredients: essentialItems,
      totalPrice: Math.round(essentialPrice * 100) / 100,
      totalDiscountPrice: Math.round(essentialDiscountPrice * 100) / 100,
      totalPacketPrice: Math.round(packetPriceSum),
      totalPacketDiscountPrice: Math.round(packetDiscountPriceSum),
      packetSavings: Math.max(0, Math.round(packetPriceSum - packetDiscountPriceSum)),
      savingsText: '1.5x saved for 3 times',
      savings: Math.round((essentialPrice - essentialDiscountPrice) * 100) / 100,
      discountPercent: essentialPrice > 0 ? Math.round(((essentialPrice - essentialDiscountPrice) / essentialPrice) * 100) : 0,
      totalProtein: Math.round(essentialProtein),
      totalCarbs: Math.round(essentialCarbs),
      totalFat: Math.round(essentialFat),
      totalFiber: Math.round(essentialFiber),
      totalCalories: calories,
      popularityScore
    };
  });

  return recipes;
}
