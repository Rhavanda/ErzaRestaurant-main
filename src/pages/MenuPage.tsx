import React from 'react';
import MenuSection from '../components/menu/MenuSection';
import { Product } from '../types';

interface MenuPageProps {
    onAddToCart: (product: Product) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ onAddToCart }) => {
    return (
        <div className="pt-20">
            <MenuSection onAddToCart={onAddToCart} />
        </div>
    );
};

export default MenuPage;
