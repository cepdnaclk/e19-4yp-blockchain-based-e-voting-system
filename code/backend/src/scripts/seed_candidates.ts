import pool from '../models/db';
import dotenv from 'dotenv';
dotenv.config(); // Ensures .env values are loaded

const candidates = [
  {
    name: 'John Doe',
    party: 'Democratic Party',
    position: 'Presidential Candidate',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    name: 'Jane Smith',
    party: 'Republican Party',
    position: 'Presidential Candidate',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  },
  {
    name: 'Mike Johnson',
    party: 'Independent Party',
    position: 'Presidential Candidate',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  },
  {
    name: 'Sarah Williams',
    party: 'Green Party',
    position: 'Presidential Candidate',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  },
];

async function seedCandidates() {
  try {
    // Clear existing candidates
    await pool.query('DELETE FROM candidates');

    // Insert new candidates
    for (const candidate of candidates) {
      await pool.query(
        'INSERT INTO candidates (name, party, position, image_url) VALUES ($1, $2, $3, $4)',
        [candidate.name, candidate.party, candidate.position, candidate.image_url]
      );
    }

    console.log('Successfully seeded candidates');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding candidates:', error);
    process.exit(1);
  }
}

seedCandidates(); 