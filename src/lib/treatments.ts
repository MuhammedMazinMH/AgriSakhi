// Disease-specific treatment recommendations

interface Treatment {
  organic: string;
  chemical: string;
  cultural: string;
  prevention: string;
}

export function getTreatmentRecommendations(disease: string): Treatment {
  const diseaseLower = disease.toLowerCase();
  
  // Tomato diseases
  if (diseaseLower.includes('tomato') && diseaseLower.includes('late blight')) {
    return {
      organic: 'Apply copper-based organic fungicide. Remove and destroy infected plants immediately. Use Bacillus subtilis spray every 5-7 days.',
      chemical: 'Apply chlorothalonil or mancozeb fungicide. Spray every 7-10 days during wet weather. Follow label instructions carefully.',
      cultural: 'Ensure good air circulation. Avoid overhead watering. Remove lower leaves. Space plants 24-36 inches apart.',
      prevention: 'Use resistant varieties. Rotate crops for 3 years. Mulch to prevent soil splash. Monitor weather for blight warnings.'
    };
  }
  
  if (diseaseLower.includes('tomato') && diseaseLower.includes('early blight')) {
    return {
      organic: 'Spray with neem oil or copper fungicide. Apply compost tea weekly. Remove infected lower leaves promptly.',
      chemical: 'Use chlorothalonil or mancozeb. Apply every 7-14 days during growing season. Start applications early.',
      cultural: 'Stake plants for air circulation. Remove weeds. Water at base of plant only. Mulch with straw.',
      prevention: 'Plant resistant varieties. Rotate crops annually. Avoid overhead irrigation. Space plants properly.'
    };
  }
  
  if (diseaseLower.includes('tomato') && diseaseLower.includes('septoria')) {
    return {
      organic: 'Apply copper fungicide or neem oil every 7 days. Remove infected leaves. Ensure good drainage.',
      chemical: 'Use chlorothalonil or mancozeb fungicide. Start at first sign of disease. Reapply every 7-10 days.',
      cultural: 'Remove lower branches touching soil. Avoid wetting foliage. Space plants 2-3 feet apart. Use drip irrigation.',
      prevention: 'Choose resistant varieties. Rotate crops for 3 years. Remove plant debris in fall. Stake or cage plants.'
    };
  }
  
  // Potato diseases
  if (diseaseLower.includes('potato') && diseaseLower.includes('late blight')) {
    return {
      organic: 'Spray with copper fungicide weekly. Hill soil around plants. Remove infected plants immediately and burn or bury deeply.',
      chemical: 'Apply chlorothalonil, mancozeb, or metalaxyl. Begin applications before disease appears. Spray every 5-7 days in wet weather.',
      cultural: 'Plant certified disease-free seed potatoes. Hill plants well. Avoid overhead irrigation. Harvest before frost.',
      prevention: 'Use resistant varieties. Ensure good drainage. Space rows 36-40 inches. Monitor weather forecasts for blight conditions.'
    };
  }
  
  if (diseaseLower.includes('potato') && diseaseLower.includes('early blight')) {
    return {
      organic: 'Apply neem oil or copper spray every 7-10 days. Remove infected leaves. Mulch heavily to prevent soil splash.',
      chemical: 'Use chlorothalonil or mancozeb fungicide. Begin at flowering or first sign of disease. Repeat every 7-14 days.',
      cultural: 'Hill plants to prevent tuber exposure. Water at soil level. Remove volunteer potatoes. Practice crop rotation.',
      prevention: 'Plant resistant varieties. Rotate crops for 3-4 years. Avoid nitrogen excess. Harvest at proper maturity.'
    };
  }
  
  // Corn diseases
  if (diseaseLower.includes('corn') && diseaseLower.includes('common rust')) {
    return {
      organic: 'Apply sulfur dust or neem oil spray. Ensure adequate plant nutrition. Remove heavily infected leaves.',
      chemical: 'Use azoxystrobin or propiconazole fungicide if severe. Apply at first sign of disease. One application usually sufficient.',
      cultural: 'Plant in well-drained soil. Avoid overcrowding. Destroy crop residue after harvest. Ensure balanced fertilization.',
      prevention: 'Choose resistant hybrids. Avoid late planting. Monitor fields regularly. Plant early-maturing varieties in high-risk areas.'
    };
  }
  
  if (diseaseLower.includes('corn') && diseaseLower.includes('northern leaf blight')) {
    return {
      organic: 'Use copper-based fungicide. Improve air circulation. Remove infected leaves early in season.',
      chemical: 'Apply propiconazole or azoxystrobin at first symptoms. Spray before tasseling for best results. Repeat if necessary.',
      cultural: 'Plow under crop debris in fall. Rotate with non-host crops. Maintain adequate row spacing. Avoid excessive nitrogen.',
      prevention: 'Plant resistant hybrids. Practice 2-year rotation minimum. Bury residue completely. Scout fields regularly.'
    };
  }
  
  // Grape diseases
  if (diseaseLower.includes('grape') && diseaseLower.includes('black rot')) {
    return {
      organic: 'Apply lime-sulfur or copper fungicide. Remove mummified berries. Prune for good air flow. Start sprays at bud break.',
      chemical: 'Use myclobutanil or captan fungicide. Begin applications at bud break. Continue every 10-14 days through fruit set.',
      cultural: 'Prune for open canopy. Remove infected fruit immediately. Clean up fallen leaves and berries. Avoid overhead irrigation.',
      prevention: 'Choose resistant varieties. Space vines properly. Ensure good drainage. Remove overwintering mummies in spring.'
    };
  }
  
  if (diseaseLower.includes('grape') && diseaseLower.includes('leaf blight')) {
    return {
      organic: 'Spray with copper fungicide or neem oil. Remove infected leaves. Improve air circulation through pruning.',
      chemical: 'Apply mancozeb or captan fungicide. Start before bloom. Repeat applications every 10-14 days during wet weather.',
      cultural: 'Prune to improve air flow. Train vines off ground. Remove weeds. Avoid wetting foliage when irrigating.',
      prevention: 'Plant in well-drained areas. Use drip irrigation. Space rows widely. Clean up leaf litter in fall.'
    };
  }
  
  // Apple diseases
  if (diseaseLower.includes('apple') && diseaseLower.includes('scab')) {
    return {
      organic: 'Apply sulfur or copper fungicide. Remove fallen leaves in autumn. Use resistant rootstocks. Prune for air circulation.',
      chemical: 'Use captan, myclobutanil, or dodine fungicide. Begin at green tip. Continue through petal fall. Spray every 7-10 days.',
      cultural: 'Rake and remove fallen leaves. Prune to open canopy. Avoid wetting foliage. Mow tall grass under trees.',
      prevention: 'Plant scab-resistant varieties. Space trees properly. Ensure good drainage. Remove wild apple trees nearby.'
    };
  }
  
  if (diseaseLower.includes('apple') && diseaseLower.includes('rust')) {
    return {
      organic: 'Apply sulfur fungicide. Remove nearby juniper bushes (alternate host). Rake up fallen leaves.',
      chemical: 'Use myclobutanil or propiconazole. Apply from pink bud through petal fall. Usually 2-3 applications needed.',
      cultural: 'Remove cedar or juniper trees within 1-2 miles if possible. Prune for air circulation. Clean up leaf litter.',
      prevention: 'Plant rust-resistant varieties. Remove alternate hosts. Monitor weather for high-risk periods. Space trees well.'
    };
  }
  
  // Pepper diseases
  if (diseaseLower.includes('pepper') && diseaseLower.includes('bacterial spot')) {
    return {
      organic: 'Spray with copper-based bactericide. Remove infected plants. Use disease-free seeds. Avoid working in wet plants.',
      chemical: 'Apply copper hydroxide or mancozeb. Start preventively. Spray weekly during wet weather. Combine with fixed copper.',
      cultural: 'Remove and destroy infected plants. Avoid overhead watering. Disinfect tools. Rotate crops for 2-3 years.',
      prevention: 'Use certified disease-free seed. Plant resistant varieties. Avoid splashing water. Space plants for air flow.'
    };
  }
  
  // Strawberry diseases
  if (diseaseLower.includes('strawberry') && diseaseLower.includes('leaf scorch')) {
    return {
      organic: 'Apply neem oil or copper spray. Remove old leaves after harvest. Ensure good air circulation.',
      chemical: 'Use captan or thiram fungicide. Apply at bloom and after renovation. Repeat every 7-14 days if needed.',
      cultural: 'Renovate beds after harvest. Remove old foliage. Avoid overhead irrigation. Thin dense plantings.',
      prevention: 'Plant resistant varieties. Space plants 12-18 inches. Mulch to reduce splash. Avoid wetting foliage.'
    };
  }
  
  // Cherry diseases
  if (diseaseLower.includes('cherry') && (diseaseLower.includes('powdery mildew') || diseaseLower.includes('leaf spot'))) {
    return {
      organic: 'Spray sulfur or potassium bicarbonate. Remove infected leaves. Prune for air circulation. Apply in early morning.',
      chemical: 'Use myclobutanil or propiconazole fungicide. Begin at shuck split. Continue through harvest. Spray every 10-14 days.',
      cultural: 'Prune to open canopy. Remove mummified fruit. Rake fallen leaves. Avoid excessive nitrogen fertilizer.',
      prevention: 'Choose resistant varieties. Space trees properly. Ensure good drainage. Remove wild cherry trees nearby.'
    };
  }
  
  // Peach diseases
  if (diseaseLower.includes('peach') && diseaseLower.includes('bacterial spot')) {
    return {
      organic: 'Apply copper spray at leaf fall and before bloom. Remove infected twigs. Use disease-free nursery stock.',
      chemical: 'Use copper fungicide or oxytetracycline antibiotic. Apply from petal fall through season. Spray every 7-10 days.',
      cultural: 'Prune out infected branches. Avoid overhead irrigation. Destroy infected fruit. Thin fruit properly.',
      prevention: 'Plant resistant varieties. Space trees 15-20 feet. Avoid sites with poor air drainage. Use windbreaks.'
    };
  }
  
  // Squash and cucumber diseases
  if ((diseaseLower.includes('squash') || diseaseLower.includes('cucumber')) && diseaseLower.includes('powdery mildew')) {
    return {
      organic: 'Spray with neem oil, sulfur, or potassium bicarbonate. Apply weekly. Remove severely infected leaves.',
      chemical: 'Use sulfur or myclobutanil fungicide. Begin at first sign. Spray upper and lower leaf surfaces. Repeat every 7 days.',
      cultural: 'Improve air circulation. Avoid overhead watering. Remove old plant material. Plant in full sun.',
      prevention: 'Choose resistant varieties. Space plants widely. Avoid wetting foliage. Plant in areas with good air movement.'
    };
  }
  
  // Bean diseases
  if (diseaseLower.includes('bean') && (diseaseLower.includes('rust') || diseaseLower.includes('blight'))) {
    return {
      organic: 'Apply copper fungicide or neem oil. Avoid working in wet plants. Remove infected plants promptly.',
      chemical: 'Use chlorothalonil or copper hydroxide. Apply at first symptoms. Repeat every 7-14 days. Spray leaf undersides.',
      cultural: 'Plant in well-drained soil. Avoid overhead irrigation. Space rows 24-30 inches. Remove crop debris after harvest.',
      prevention: 'Use disease-free seed. Rotate crops for 2-3 years. Plant resistant varieties. Avoid working in wet conditions.'
    };
  }
  
  // Citrus diseases
  if (diseaseLower.includes('orange') || diseaseLower.includes('citrus')) {
    return {
      organic: 'Apply copper spray or horticultural oil. Remove infected fruit and leaves. Ensure proper nutrition.',
      chemical: 'Use copper fungicide or specific systemic fungicide. Apply according to disease cycle. Repeat as recommended.',
      cultural: 'Prune for air circulation. Remove dead wood. Avoid wetting foliage. Maintain proper soil pH (6.0-7.5).',
      prevention: 'Plant disease-free nursery stock. Space trees properly. Ensure good drainage. Control insect vectors.'
    };
  }
  
  // Default treatment for unknown diseases
  return {
    organic: 'Apply neem oil solution (2 tablespoons per gallon of water) every 7-14 days. Remove and dispose of heavily infected leaves. Consider using compost tea as a preventive spray.',
    chemical: 'Use a broad-spectrum fungicide appropriate for your crop (follow manufacturer\'s instructions carefully). Apply in early morning or late evening. Rotate between different fungicide classes to prevent resistance.',
    cultural: 'Improve air circulation by proper spacing and pruning. Avoid overhead watering - use drip irrigation or soaker hoses. Remove plant debris regularly. Practice crop rotation and avoid planting susceptible crops in the same location.',
    prevention: 'Plant resistant varieties when available. Maintain proper plant spacing for air flow. Ensure good soil drainage. Monitor plants regularly for early detection. Keep tools clean and disinfected.'
  };
}
