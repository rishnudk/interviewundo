import { User, Testimonial } from './types';

// 40 unique mock users with high-quality, developer-focused profile pictures from Unsplash
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Connor',
    username: 'sarah_codes',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Staff Frontend Engineer',
  },
  {
    id: 'user-2',
    name: 'Alex Rivera',
    username: 'alexr',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Senior Software Engineer',
  },
  {
    id: 'user-3',
    name: 'Elena Rostova',
    username: 'elena_dev',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Tech Lead',
  },
  {
    id: 'user-4',
    name: 'Marcus Chen',
    username: 'marcusc',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Full Stack Engineer',
  },
  {
    id: 'user-5',
    name: 'Devon Harris',
    username: 'devonh',
    avatar:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Systems Architect',
  },
  {
    id: 'user-6',
    name: 'Chloe Tanaka',
    username: 'chloe_t',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Compiler Engineer',
  },
  {
    id: 'user-7',
    name: 'David Kim',
    username: 'davidk',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Infrastructure Lead',
  },
  {
    id: 'user-8',
    name: 'Aisha Rahman',
    username: 'aisha_codes',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Principal Engineer',
  },
  {
    id: 'user-9',
    name: 'Rishnu DK',
    username: 'rishnudk',
    avatar:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Full Stack Developer',
  },
  {
    id: 'user-10',
    name: "Liam O'Connor",
    username: 'liamoc',
    avatar:
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Backend Architect',
  },
  {
    id: 'user-11',
    name: 'Sofia Martinez',
    username: 'sofia_m',
    avatar:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Product Engineer',
  },
  {
    id: 'user-12',
    name: 'Tyler Durden',
    username: 'tylerd',
    avatar:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Security Engineer',
  },
  // Users without testimonials (13 to 40)
  {
    id: 'user-13',
    name: 'Amara Okafor',
    username: 'amara_o',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'DevOps Engineer',
  },
  {
    id: 'user-14',
    name: 'Lucas Dupont',
    username: 'lucas_d',
    avatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Database Engineer',
  },
  {
    id: 'user-15',
    name: 'Yuki Sato',
    username: 'yuki_s',
    avatar:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Machine Learning Engineer',
  },
  {
    id: 'user-16',
    name: 'Carlos Mendez',
    username: 'carlos_m',
    avatar:
      'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Site Reliability Engineer',
  },
  {
    id: 'user-17',
    name: 'Zoe Jenkins',
    username: 'zoe_j',
    avatar:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'QA Automation Lead',
  },
  {
    id: 'user-18',
    name: 'Ryan Reynolds',
    username: 'ryan_codes',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'UI Developer',
  },
  {
    id: 'user-19',
    name: 'Nina Patel',
    username: 'nina_p',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Embedded Systems Engineer',
  },
  {
    id: 'user-20',
    name: 'Ivan Petrov',
    username: 'ivan_p',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Cloud Architect',
  },
  {
    id: 'user-21',
    name: 'Mia Wong',
    username: 'mia_w',
    avatar:
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Data Platform Engineer',
  },
  {
    id: 'user-22',
    name: 'Omar Farooq',
    username: 'omar_f',
    avatar:
      'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Distributed Systems Engineer',
  },
  {
    id: 'user-23',
    name: 'Isabella Silva',
    username: 'isabella_s',
    avatar:
      'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'React Engineer',
  },
  {
    id: 'user-24',
    name: 'Jacob Nielsen',
    username: 'jacob_n',
    avatar:
      'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Senior Linux Engineer',
  },
  {
    id: 'user-25',
    name: 'Leila Khalili',
    username: 'leila_k',
    avatar:
      'https://images.unsplash.com/photo-1491349174775-aaafddd539df?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Solutions Architect',
  },
  {
    id: 'user-26',
    name: 'Thomas Mueller',
    username: 'thomas_m',
    avatar:
      'https://images.unsplash.com/photo-1504257400762-97123c23636c?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Staff Rust Developer',
  },
  {
    id: 'user-27',
    name: 'Camila Gomez',
    username: 'camila_g',
    avatar:
      'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'WebGL Engineer',
  },
  {
    id: 'user-28',
    name: 'Siddharth Nair',
    username: 'sid_nair',
    avatar:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'iOS Engineer',
  },
  {
    id: 'user-29',
    name: 'Grace Hopper',
    username: 'grace_h',
    avatar:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Kernel Developer',
  },
  {
    id: 'user-30',
    name: 'Arthur Pendragon',
    username: 'arthur_p',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Developer Advocate',
  },
  {
    id: 'user-31',
    name: 'Sunita Williams',
    username: 'sunita_w',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Senior Infrastructure Engineer',
  },
  {
    id: 'user-32',
    name: 'Peter Parker',
    username: 'peter_p',
    avatar:
      'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Frontend Architect',
  },
  {
    id: 'user-33',
    name: 'Emily Watson',
    username: 'emily_w',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Data Scientist',
  },
  {
    id: 'user-34',
    name: 'Oliver Twist',
    username: 'oliver_t',
    avatar:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Full Stack Engineer',
  },
  {
    id: 'user-35',
    name: 'Sophia Loren',
    username: 'sophia_l',
    avatar:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Developer Relations',
  },
  {
    id: 'user-36',
    name: 'Logan Howlett',
    username: 'logan_h',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Staff Security Engineer',
  },
  {
    id: 'user-37',
    name: 'Jean Grey',
    username: 'jean_g',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Senior UI/UX Engineer',
  },
  {
    id: 'user-38',
    name: 'Bruce Wayne',
    username: 'bruce_w',
    avatar:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Lead Crypto Engineer',
  },
  {
    id: 'user-39',
    name: 'Diana Prince',
    username: 'diana_p',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Staff Platform Engineer',
  },
  {
    id: 'user-40',
    name: 'Clark Kent',
    username: 'clark_k',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80',
    role: 'Principal Systems Architect',
  },
];

// 12 Testimonials: 10 approved (in rotation) and 2 unapproved (hidden from rotation)
export const mockTestimonials: Testimonial[] = [
  {
    id: 't-1',
    userId: 'user-1',
    rating: 5,
    message:
      'The platform feels incredibly polished. The interactive workspace combined with real-time feedback completely changed my prep strategy. I solved my first interview in just two days.',
    approved: true,
    createdAt: '2026-07-01T12:00:00Z',
  },
  {
    id: 't-2',
    userId: 'user-2',
    rating: 5,
    message:
      'Next-level compiler speed. Doing React & Node.js challenges with instant outputs in a web sandbox makes learning so fast. Beats conventional mock sites by a mile.',
    approved: true,
    createdAt: '2026-07-03T14:30:00Z',
  },
  {
    id: 't-3',
    userId: 'user-3',
    rating: 5,
    message:
      'I love how clean and developer-focused the UI is. Minimal distraction, heavy keyboard-shortcut support, and excellent problem descriptions. Worth every single cent.',
    approved: true,
    createdAt: '2026-07-05T09:15:00Z',
  },
  {
    id: 't-4',
    userId: 'user-4',
    rating: 5,
    message:
      "The AI feedback is super detailed. It doesn't just tell you if your code passed; it analyzes time complexity, suggests optimizations, and teaches you better software design patterns.",
    approved: true,
    createdAt: '2026-07-08T18:45:00Z',
  },
  {
    id: 't-5',
    userId: 'user-5',
    rating: 5,
    message:
      'System design questions on here are amazing. Having interactive canvases and structural feedback makes complex distributed systems concepts easy to understand.',
    approved: true,
    createdAt: '2026-07-10T11:00:00Z',
  },
  {
    id: 't-6',
    userId: 'user-6',
    rating: 5,
    message:
      'No bloated features. Just high-quality JavaScript and TypeScript puzzles that target actual real-world scenarios rather than obscure mathematical operations. Outstanding work!',
    approved: true,
    createdAt: '2026-07-12T16:20:00Z',
  },
  {
    id: 't-7',
    userId: 'user-7',
    rating: 5,
    message:
      'Best coding prep platform on the market, period. The Git-like workflow integration and shell execution simulation are extremely satisfying for senior developers.',
    approved: true,
    createdAt: '2026-07-15T08:00:00Z',
  },
  {
    id: 't-8',
    userId: 'user-8',
    rating: 5,
    message:
      'The streak mechanics actually kept me motivated. I did 30 straight days of exercises and cleared my Google L6 interview loop with absolute confidence.',
    approved: true,
    createdAt: '2026-07-18T10:10:00Z',
  },
  {
    id: 't-9',
    userId: 'user-9',
    rating: 5,
    message:
      'The platform feels incredibly polished. I solved my first interview in just two days.',
    approved: true,
    createdAt: '2026-07-20T22:30:00Z',
  },
  {
    id: 't-10',
    userId: 'user-10',
    rating: 5,
    message:
      'Outstanding developer experience. The Monaco editor integration is seamless, autocomplete is smart, and the VIM bindings actually work correctly.',
    approved: true,
    createdAt: '2026-07-22T13:40:00Z',
  },
  // Unapproved Testimonials (should NOT appear in the rotation)
  {
    id: 't-11',
    userId: 'user-11',
    rating: 2,
    message: 'This is a test unapproved review. It should not show up.',
    approved: false,
    createdAt: '2026-07-25T15:00:00Z',
  },
  {
    id: 't-12',
    userId: 'user-12',
    rating: 1,
    message: 'Another unapproved review. Ignore me.',
    approved: false,
    createdAt: '2026-07-26T16:00:00Z',
  },
];
