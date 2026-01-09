export const MOCK_PROFILES = [
  {
    id: 'u1',
    full_name: 'Aanya Sharma',
    age: 19,
    date_of_birth: '2005-05-15',
    college: { name: 'IIT Delhi' },
    year_of_study: 2,
    bio: 'Tech enthusiast and part-time classical dancer. Always down for a hackathon or a chai break! ☕✨',
    profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    interests: ['Coding', 'Classical Dance', 'Chai', 'Startups'],
    match_score: { total_score: 94, breakdown: 'High interest overlap in Tech & Arts' }
  },
  {
    id: 'u2',
    full_name: 'Rohan Gupta',
    age: 20,
    date_of_birth: '2004-08-22',
    college: { name: 'DTU' },
    year_of_study: 3,
    bio: 'Gamer by night, civil engineer by day. Looking for someone to carry me in Valorant. 🎮',
    profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    interests: ['Gaming', 'Fitness', 'Valorant', 'Photography'],
    match_score: { total_score: 88, breakdown: 'Shared love for Gaming and Fitness' }
  },
  {
    id: 'u3',
    full_name: 'Priya Iyer',
    age: 19,
    date_of_birth: '2005-11-03',
    college: { name: 'Miranda House' },
    year_of_study: 2,
    bio: 'History buff with a passion for podcasting. Let’s talk about ancient ruins and modern music. 🎙️',
    profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    interests: ['History', 'Podcasting', 'Indie Music', 'Reading'],
    match_score: { total_score: 82, breakdown: 'Strong personality alignment' }
  },
  {
    id: 'u4',
    full_name: 'Kabir Verma',
    age: 21,
    date_of_birth: '2003-02-14',
    college: { name: 'NSUT' },
    year_of_study: 4,
    bio: 'Aspiring entrepreneur. Building something cool in the EdTech space. Coffee is my fuel. 🚀',
    profile_photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    interests: ['Entrepreneurship', 'Coffee', 'Basketball', 'Travel'],
    match_score: { total_score: 91, breakdown: 'Mutual interest in Startups & Travel' }
  },
  {
    id: 'u5',
    full_name: 'Ishani Roy',
    age: 18,
    date_of_birth: '2006-07-30',
    college: { name: 'SRCC' },
    year_of_study: 1,
    bio: 'Finance major. When I am not crunching numbers, I am exploring the best cafes in Delhi. 🥐',
    profile_photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    interests: ['Finance', 'Cafe Hopping', 'Tennis', 'Fashion'],
    match_score: { total_score: 75, breakdown: 'Similar lifestyle preferences' }
  }
];

export const MOCK_COMMUNITIES = [
  { id: 'c1', name: 'Photography Club', members: 450, description: 'Capture the campus through your lens.', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=200' },
  { id: 'c2', name: 'Startup Network', members: 1200, description: 'Connecting future founders and builders.', img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=200' },
  { id: 'c3', name: 'Dance Society', members: 280, description: 'Express yourself through movement.', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=200' },
  { id: 'c4', name: 'Code & Coffee', members: 890, description: 'Weekly meetups for programmers.', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=200' }
];

export const MOCK_EVENTS = [
  { id: 'e1', title: 'Campus Music Fest', date: 'Jan 15, 2026', location: 'Open Air Theater', attendees: 1500 },
  { id: 'e2', title: 'Founder\'s Meetup', date: 'Jan 18, 2026', location: 'Innovation Lab', attendees: 120 },
  { id: 'e3', title: 'Alumni Dinner', date: 'Jan 22, 2026', location: 'Main Hall', attendees: 500 }
];

export const MOCK_POSTS = [
  { id: 1, author: "Tech Society", content: "Hackathon loading... 🚀 Who's ready for the biggest code fest of the year?", time: "2h ago", likes: 124, comments: 12 },
  { id: 2, author: "Rahul Sharma", content: "Just explored the new campus cafe. 10/10 recommend the cold coffee! ☕", time: "4h ago", likes: 89, comments: 23 },
  { id: 3, author: "Dance Club", content: "Auditions start tomorrow at LT-1. Bring your energy! 💃🕺", time: "5h ago", likes: 256, comments: 45 },
];

export const MOCK_SHIPS = [
  {
    id: 's1',
    shipper: { full_name: 'You' },
    user1: MOCK_PROFILES[0],
    user2: MOCK_PROFILES[3],
    status: 'Matched! 🎉',
    reason: 'Both are super into startups and tech!'
  },
  {
    id: 's2',
    shipper: { full_name: 'Ishani Roy' },
    user1: { id: 'current_user', full_name: 'You' },
    user2: MOCK_PROFILES[1],
    status: 'Pending',
    reason: 'You both love gaming!'
  }
];

export const MOCK_USER = {
  id: 'current_user',
  full_name: 'Demo Student',
  email: 'demo@origo.edu',
  college: { name: 'IIT Delhi', domain: 'iitd.ac.in', location: 'New Delhi' },
  year_of_study: 2,
  bio: 'I love exploring campus and meeting new people. Always down for a coffee or a quick coding session!',
  profile_photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  interests: ['Tech', 'Music', 'Sports'],
  is_onboarded: false,
  created_at: new Date().toISOString(),
  onboarding_data: {
    social_level: 'Social butterfly',
    communication_style: 'In-person',
    weekend_vibe: 'Party',
    group_size: 'Small squad (3-5)',
    free_time: ['Gaming', 'Projects', 'Friends'],
    music_taste: ['Indie', 'Pop', 'EDM']
  }
};

export const MOCK_THREADS = [
  {
    id: "user_1",
    name: "Aanya",
    lastMsg: "See you at the fest! 🎉",
    time: "2m",
    unread: 2,
    online: true,
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: "user_2",
    name: "Rohan",
    lastMsg: "That's so interesting! I'd love to hear more about that. 😊",
    time: "1h",
    unread: 0,
    online: true,
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: "user_4",
    name: "Kabir",
    lastMsg: "Bro, did you check the notes?",
    time: "3h",
    unread: 0,
    online: false,
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100"
  },
];
