
import { Movie, Theater, ShowTime } from './types';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'RRR (Rise Roar Revolt)',
    genre: ['Action', 'Drama', 'History'],
    duration: 187,
    language: 'Telugu / Hindi',
    releaseDate: '2022-03-25',
    rating: 9.1,
    description: 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop',
    status: 'Now Showing',
  },
  {
    id: 'm2',
    title: 'Baahubali 2: The Conclusion',
    genre: ['Action', 'Fantasy'],
    duration: 167,
    language: 'Telugu / Hindi',
    releaseDate: '2017-04-28',
    rating: 8.2,
    description: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.',
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800&auto=format&fit=crop',
    status: 'Now Showing',
  },
  {
    id: 'm3',
    title: 'Dangal',
    genre: ['Biography', 'Drama', 'Sport'],
    duration: 161,
    language: 'Hindi',
    releaseDate: '2016-12-23',
    rating: 8.3,
    description: 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    status: 'Now Showing',
  },
  {
    id: 'm4',
    title: 'Pathaan',
    genre: ['Action', 'Adventure', 'Thriller'],
    duration: 146,
    language: 'Hindi',
    releaseDate: '2023-01-25',
    rating: 7.0,
    description: 'An Indian spy takes on the leader of a group of mercenaries who have a nefarious plan to target his homeland.',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
    status: 'Coming Soon',
  }
];

export const INITIAL_THEATERS: Theater[] = [
  { id: 't1', name: 'PVR Director\'s Cut', location: 'Vasant Kunj, Delhi' },
  { id: 't2', name: 'Inox Insignia', location: 'Nariman Point, Mumbai' },
  { id: 't3', name: 'Prasad\'s IMAX', location: 'Hyderabad' },
];

export const INITIAL_SHOWTIMES: ShowTime[] = [
  { id: 's1', movieId: 'm1', theaterId: 't1', time: '13:00', price: 450, availableSeats: [] },
  { id: 's2', movieId: 'm1', theaterId: 't2', time: '17:30', price: 600, availableSeats: ['A1', 'A2'] },
  { id: 's3', movieId: 'm2', theaterId: 't3', time: '10:00', price: 350, availableSeats: [] },
  { id: 's4', movieId: 'm3', theaterId: 't1', time: '20:15', price: 550, availableSeats: [] },
];
