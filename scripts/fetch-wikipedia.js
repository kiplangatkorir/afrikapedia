/**
 * Script to fetch Wikipedia articles and save as JSON
 * Run with: node scripts/fetch-wikipedia.js
 */

const fs = require('fs');
const path = require('path');

const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1';

// Africa-related topics to pre-fetch
const TOPICS = [
  // Kingdoms & Empires
  'Mali Empire',
  'Kingdom of Aksum',
  'Ancient Egypt',
  'Kingdom of Kush',
  'Songhai Empire',
  'Ghana Empire',
  'Ashanti Empire',
  'Benin Empire',
  'Zulu Kingdom',
  'Ethiopian Empire',
  'Kanem-Bornu',
  'Great Zimbabwe',
  
  // People & Leaders
  'Mansa Musa',
  'Sundiata Keita',
  'Shaka',
  'Haile Selassie',
  'Nelson Mandela',
  'Kwame Nkrumah',
  'Patrice Lumumba',
  'Thomas Sankara',
  
  // Places & Cities
  'Timbuktu',
  'Djenné',
  'Alexandria',
  'Carthage',
  'Addis Ababa',
  'Marrakesh',
  
  // Culture & Philosophy
  'Ubuntu (philosophy)',
  'Maat',
  'Yoruba religion',
  'Dogon people',
  'San people',
  
  // Languages & Scripts
  'Ge\'ez script',
  'Nsibidi',
  'Adinkra symbols',
  'Egyptian hieroglyphs',
  'Swahili language',
  
  // Science & Innovation
  'Timbuktu Manuscripts',
  'Great Pyramid of Giza',
  'Lalibela',
  'Rock-hewn churches, Lalibela',
  
  // Modern Africa
  'African Union',
  'Pan-Africanism',
  'Decolonisation of Africa',
];

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function fetchArticle(title) {
  try {
    const summaryRes = await fetch(`${WIKIPEDIA_API}/page/summary/${encodeURIComponent(title)}`);
    if (!summaryRes.ok) {
      console.log(`  ⚠️  Failed to fetch summary for "${title}"`);
      return null;
    }
    const summary = await summaryRes.json();

    const sectionsRes = await fetch(`${WIKIPEDIA_API}/page/${encodeURIComponent(title)}/sections`);
    let sections = null;
    if (sectionsRes.ok) {
      sections = await sectionsRes.json();
    }

    return {
      title: summary.title,
      description: summary.description,
      extract: summary.extract,
      content: summary.extract,
      thumbnail: summary.thumbnail?.source,
      sections,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(summary.title)}`,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.log(`  ❌ Error fetching "${title}": ${error.message}`);
    return null;
  }
}

async function main() {
  const outputDir = path.join(__dirname, '..', 'src', 'data', 'articles');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`📚 Fetching ${TOPICS.length} Wikipedia articles...\n`);

  let success = 0;
  let failed = 0;

  for (const topic of TOPICS) {
    console.log(`Fetching: ${topic}`);
    const article = await fetchArticle(topic);
    
    if (article) {
      const slug = slugify(article.title);
      const filePath = path.join(outputDir, `${slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
      console.log(`  ✅ Saved: ${slug}.json`);
      success++;
    } else {
      failed++;
    }

    // Rate limiting - be nice to Wikipedia API
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n✅ Done! ${success} articles saved, ${failed} failed`);
  console.log(`📁 Output: ${outputDir}`);
}

main().catch(console.error);
