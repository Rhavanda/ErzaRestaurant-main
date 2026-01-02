import { Product } from './types';

export const MENU_ITEMS: Product[] = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    description: 'Nasi goreng khas Indonesia dengan ayam, telur, dan rempah tradisional.',
    price: 25000,
    // image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
    image: 'https://ik.imagekit.io/ownlrwru2/download.jpg',
    category: 'makanan',
    calories: 450,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Sate Ayam Madura',
    description: 'Sate ayam bakar dengan bumbu kacang yang kaya dan kecap manis.',
    price: 30000,
    image: 'https://ik.imagekit.io/ownlrwru2/daging_rendang.jpg',
    category: 'makanan',
    calories: 380,
    rating: 4.9
  },
  {
    id: '3',
    name: 'Mie Goreng Jawa',
    description: 'Mie goreng gaya Jawa dengan sayuran dan suwiran ayam.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&q=80',
    category: 'makanan',
    calories: 400,
    rating: 4.7
  },
  {
    id: '4',
    name: 'Rendang Daging',
    description: 'Daging sapi masak lambat dalam santan dan rempah. Rasa asli Padang.',
    price: 45000,
    image: 'https://ik.imagekit.io/ownlrwru2/daging_rendang.jpg',
    category: 'makanan',
    calories: 520,
    rating: 5.0
  },
  {
    id: '5',
    name: 'Gado-Gado',
    description: 'Campuran sayuran kukus dengan saus kacang. Pilihan sehat.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80',
    category: 'makanan',
    calories: 320,
    rating: 4.6
  },
  {
    id: '6',
    name: 'Es Teh Manis',
    description: 'Teh manis dingin, teman pas untuk makanan pedas.',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
    category: 'minuman',
    calories: 90,
    rating: 4.5
  },
  {
    id: '7',
    name: 'Es Jeruk Segar',
    description: 'Perasan jeruk segar dengan es yang menyegarkan.',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80',
    category: 'minuman',
    calories: 110,
    rating: 4.8
  },
  {
    id: '8',
    name: 'Pisang Goreng Keju',
    description: 'Pisang goreng dengan topping susu kental manis dan parutan keju.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
    category: 'snack',
    calories: 250,
    rating: 4.7
  }
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const WHATSAPP_NUMBER = "6281234567890"; // Example number
