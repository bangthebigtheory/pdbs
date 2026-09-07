import { db } from './index';
import { questions } from './schema';

const sampleQuestions = [
  {
    question: "What organelle is known as the powerhouse of the cell?",
    answer: "Mitochondria",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"],
    category: "Science"
  },
  {
    question: "Which technology is used to determine the sequence of DNA bases?",
    answer: "DNA Sequencing",
    options: ["CRISPR", "DNA Sequencing", "PCR", "Electrophoresis"],
    category: "Science"
  },
  {
    question: "What is the chemical symbol for Gold?",
    answer: "Au",
    options: ["Ag", "Au", "Pb", "Fe"],
    category: "Science"
  },
  {
    question: "Who is known as the Father of the Indian Constitution?",
    answer: "B. R. Ambedkar",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "B. R. Ambedkar", "Sardar Patel"],
    category: "History"
  },
  {
    question: "Which city is known as the Silicon Valley of India?",
    answer: "Bengaluru",
    options: ["Hyderabad", "Chennai", "Bengaluru", "Pune"],
    category: "General Knowledge"
  },
  {
    question: "What is the largest planet in our solar system?",
    answer: "Jupiter",
    options: ["Saturn", "Jupiter", "Neptune", "Mars"],
    category: "Science"
  },
  {
    question: "Which river flows through Bengaluru?",
    answer: "Vrishabhavathi",
    options: ["Cauvery", "Vrishabhavathi", "Arkavathi", "Hemavathi"],
    category: "Geography"
  },
  {
    question: "What is the currency of Japan?",
    answer: "Yen",
    options: ["Won", "Yuan", "Yen", "Ringgit"],
    category: "General Knowledge"
  },
  {
    question: "Who wrote 'Discovery of India'?",
    answer: "Jawaharlal Nehru",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Rabindranath Tagore", "Subhash Chandra Bose"],
    category: "Literature"
  },
  {
    question: "Which element has the atomic number 1?",
    answer: "Hydrogen",
    options: ["Helium", "Hydrogen", "Lithium", "Oxygen"],
    category: "Science"
  }
];

export async function seedQuestions() {
  await db.insert(questions).values(sampleQuestions);
}
