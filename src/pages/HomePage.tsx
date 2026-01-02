import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/home/Hero';
import WhyChooseUs from '../components/home/WhyChooseUs';
import PopularMenu from '../components/home/PopularMenu';
import NewsletterCTA from '../components/home/NewsletterCTA';
import { Product } from '../types';

interface HomePageProps {
    onAddToCart: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
    const navigate = useNavigate();

    return (
        <>
            <Hero onViewMenu={() => navigate('/menu')} />
            <WhyChooseUs />
            <PopularMenu onAddToCart={onAddToCart} onSeeAll={() => navigate('/menu')} />
            <NewsletterCTA />
        </>
    );
};

export default HomePage;
