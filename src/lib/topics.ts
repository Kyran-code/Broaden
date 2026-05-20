export const dailyTopics = [
  { id: "quantum-computing", title: "Quantum Computing", category: "Technology", emoji: "⚛️", difficulty: "Beginner" },
  { id: "behavioral-economics", title: "Behavioral Economics", category: "Economics", emoji: "🧠", difficulty: "Beginner" },
  { id: "crispr", title: "CRISPR Gene Editing", category: "Biology", emoji: "🧬", difficulty: "Beginner" },
  { id: "blockchain", title: "How Blockchain Works", category: "Technology", emoji: "🔗", difficulty: "Beginner" },
  { id: "monetary-policy", title: "Central Bank Monetary Policy", category: "Economics", emoji: "🏦", difficulty: "Beginner" },
  { id: "dark-matter", title: "Dark Matter & Dark Energy", category: "Physics", emoji: "🌌", difficulty: "Beginner" },
  { id: "geopolitics-china-us", title: "US-China Geopolitics", category: "Politics", emoji: "🌏", difficulty: "Beginner" },
  { id: "machine-learning", title: "How Machine Learning Works", category: "AI", emoji: "🤖", difficulty: "Beginner" },
  { id: "climate-tipping-points", title: "Climate Tipping Points", category: "Environment", emoji: "🌡️", difficulty: "Beginner" },
  { id: "stoicism", title: "Stoic Philosophy", category: "Philosophy", emoji: "🏛️", difficulty: "Beginner" },
  { id: "nuclear-fusion", title: "Nuclear Fusion Energy", category: "Physics", emoji: "☀️", difficulty: "Beginner" },
  { id: "microbiome", title: "The Human Microbiome", category: "Biology", emoji: "🦠", difficulty: "Beginner" },
  { id: "supply-chain", title: "Global Supply Chains", category: "Economics", emoji: "🚢", difficulty: "Beginner" },
  { id: "neural-networks", title: "Neural Networks Explained", category: "AI", emoji: "🕸️", difficulty: "Beginner" },
  { id: "constitutional-law", title: "Constitutional Law Basics", category: "Law", emoji: "⚖️", difficulty: "Beginner" },
  { id: "venture-capital", title: "How Venture Capital Works", category: "Finance", emoji: "💰", difficulty: "Beginner" },
  { id: "antibiotics-resistance", title: "Antibiotic Resistance Crisis", category: "Medicine", emoji: "💊", difficulty: "Beginner" },
  { id: "cognitive-biases", title: "Cognitive Biases", category: "Psychology", emoji: "🎭", difficulty: "Beginner" },
  { id: "nato", title: "What is NATO & Why It Matters", category: "Politics", emoji: "🛡️", difficulty: "Beginner" },
  { id: "semiconductor", title: "How Semiconductors Are Made", category: "Technology", emoji: "💡", difficulty: "Beginner" },
  { id: "inflation", title: "What Causes Inflation", category: "Economics", emoji: "📈", difficulty: "Beginner" },
  { id: "black-holes", title: "Black Holes", category: "Astronomy", emoji: "🕳️", difficulty: "Beginner" },
  { id: "epigenetics", title: "Epigenetics", category: "Biology", emoji: "🧫", difficulty: "Beginner" },
  { id: "game-theory", title: "Game Theory Basics", category: "Mathematics", emoji: "♟️", difficulty: "Beginner" },
  { id: "mRNA", title: "How mRNA Vaccines Work", category: "Medicine", emoji: "💉", difficulty: "Beginner" },
  { id: "neuroscience-memory", title: "How Memory Works", category: "Neuroscience", emoji: "💭", difficulty: "Beginner" },
  { id: "international-trade", title: "International Trade & Tariffs", category: "Economics", emoji: "🤝", difficulty: "Beginner" },
  { id: "renewable-energy", title: "Renewable Energy Systems", category: "Environment", emoji: "🌱", difficulty: "Beginner" },
  { id: "philosophy-of-mind", title: "Philosophy of Mind & Consciousness", category: "Philosophy", emoji: "🧩", difficulty: "Beginner" },
  { id: "compound-interest", title: "The Power of Compound Interest", category: "Finance", emoji: "📊", difficulty: "Beginner" },
];

export function getTodaysTopic() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyTopics[dayOfYear % dailyTopics.length];
}
