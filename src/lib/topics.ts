export const dailyTopics = [
  { id: "godels-incompleteness", title: "Gödel's Incompleteness Theorems", category: "Mathematics & Logic", emoji: "∞" },
  { id: "epigenetic-inheritance", title: "Epigenetic Inheritance", category: "Molecular Biology", emoji: "🧬" },
  { id: "byzantine-fault-tolerance", title: "The Byzantine Generals Problem", category: "Computer Science", emoji: "⚙️" },
  { id: "the-measurement-problem", title: "The Measurement Problem in Quantum Mechanics", category: "Physics", emoji: "⚛️" },
  { id: "cambrian-explosion", title: "The Cambrian Explosion", category: "Evolutionary Biology", emoji: "🦕" },
  { id: "mmt", title: "Modern Monetary Theory", category: "Macroeconomics", emoji: "💱" },
  { id: "fermi-paradox", title: "The Fermi Paradox", category: "Astrophysics & Philosophy", emoji: "🌌" },
  { id: "abiogenesis", title: "Abiogenesis — The Origin of Life", category: "Biochemistry", emoji: "🔬" },
  { id: "trolley-problem-ethics", title: "Utilitarian Ethics & the Trolley Problem", category: "Moral Philosophy", emoji: "⚖️" },
  { id: "horizontal-gene-transfer", title: "Horizontal Gene Transfer", category: "Microbiology", emoji: "🦠" },
  { id: "dunning-kruger", title: "The Dunning-Kruger Effect & Metacognition", category: "Cognitive Psychology", emoji: "🧠" },
  { id: "dark-matter-evidence", title: "The Evidence for Dark Matter", category: "Cosmology", emoji: "🕳️" },
  { id: "syntactic-structures", title: "Chomsky's Universal Grammar", category: "Linguistics", emoji: "🗣️" },
  { id: "haber-bosch", title: "The Haber-Bosch Process", category: "Chemistry & History", emoji: "🌿" },
  { id: "great-filter", title: "The Great Filter Hypothesis", category: "Existential Risk", emoji: "🔭" },
  { id: "plate-tectonics-deep", title: "The Mechanism of Plate Tectonics", category: "Geology", emoji: "🌍" },
  { id: "game-theory-nash", title: "Nash Equilibrium & Game Theory", category: "Mathematics & Economics", emoji: "♟️" },
  { id: "crispr-mechanism", title: "How CRISPR-Cas9 Actually Works", category: "Genetic Engineering", emoji: "✂️" },
  { id: "arrow-impossibility", title: "Arrow's Impossibility Theorem", category: "Political Science & Math", emoji: "🗳️" },
  { id: "prion-diseases", title: "Prion Diseases — Proteins Gone Wrong", category: "Neuroscience", emoji: "🧫" },
  { id: "bretton-woods", title: "The Bretton Woods System & Its Collapse", category: "Economic History", emoji: "🏦" },
  { id: "simulation-hypothesis", title: "The Simulation Hypothesis", category: "Philosophy of Mind", emoji: "💻" },
  { id: "antibiotic-resistance-mechanism", title: "How Bacteria Evolve Antibiotic Resistance", category: "Microbiology", emoji: "💊" },
  { id: "solar-wind-magnetosphere", title: "Solar Wind & Earth's Magnetosphere", category: "Space Physics", emoji: "☀️" },
  { id: "habsburg-inbreeding", title: "The Habsburg Dynasty & the Genetics of Inbreeding", category: "History & Genetics", emoji: "👑" },
  { id: "black-scholes", title: "The Black-Scholes Model", category: "Financial Mathematics", emoji: "📊" },
  { id: "mirror-neurons", title: "Mirror Neurons & Empathy", category: "Neuroscience", emoji: "🪞" },
  { id: "p-vs-np", title: "The P vs NP Problem", category: "Theoretical Computer Science", emoji: "🔢" },
  { id: "cognitive-dissonance", title: "Cognitive Dissonance & Belief Perseverance", category: "Social Psychology", emoji: "🎭" },
  { id: "panspermia", title: "Panspermia — Life from Space", category: "Astrobiology", emoji: "☄️" },
  { id: "tragedy-of-commons", title: "The Tragedy of the Commons", category: "Economics & Ecology", emoji: "🌾" },
  { id: "higgs-boson", title: "The Higgs Boson & the Standard Model", category: "Particle Physics", emoji: "⚛️" },
  { id: "stanford-prison-experiment", title: "The Stanford Prison Experiment & Authority", category: "Social Psychology", emoji: "🔒" },
  { id: "polymerase-chain-reaction", title: "How PCR Works", category: "Molecular Biology", emoji: "🧪" },
  { id: "ottoman-collapse", title: "Why the Ottoman Empire Collapsed", category: "Modern History", emoji: "🕌" },
  { id: "attention-economy", title: "The Attention Economy", category: "Media Theory & Economics", emoji: "📱" },
  { id: "endosymbiosis", title: "Endosymbiotic Theory — How Mitochondria Became Part of Us", category: "Cell Biology", emoji: "🔬" },
  { id: "nuclear-deterrence", title: "Nuclear Deterrence Theory", category: "International Relations", emoji: "☢️" },
];

export function getTodaysTopic() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyTopics[dayOfYear % dailyTopics.length];
}
