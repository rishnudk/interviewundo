export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: string;
  company?: string;
}

export interface Testimonial {
  id: string;
  userId: string;
  message: string;
  rating: number;
  approved: boolean;
  createdAt: string;
}

export interface CommunityTestimonialsProps {
  users: User[];
  testimonials: Testimonial[];
}
