
import React from 'react'
import SectionTitle from '@/src/components/global/SectionTitle';
import ProductsGrid from '@/src/components/products/ProductsGrid';
import { fetchUserFavorites } from '@/src/utils/action';

const FavoritesPage = async () => {
  const favorites = await fetchUserFavorites();
  if (Array.isArray(favorites)) {
    if(favorites.length === 0) return <SectionTitle text='You have no favorites yet.' />;
    return (
      <div>
        <SectionTitle text='Favorites' />
        <ProductsGrid products={favorites.map((favorite) => favorite.product)} />
      </div>
    );
  } 
}

export default FavoritesPage
