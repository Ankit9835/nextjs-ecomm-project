import React from 'react'
import SectionTitle from '../global/SectionTitle'
import EmptyList from '../global/EmptyList'
import ProductsGrid from '../products/ProductsGrid'
import { fetchFeaturedProducts } from '@/src/utils/action'

const FeaturedProducts = async () => {
    const products = await fetchFeaturedProducts()
    if(products?.length === 0) return <EmptyList />
  return (
    <>
    <section className='pt-24'>
        <SectionTitle text='featured products'/>
        <ProductsGrid  products={products}/>
    </section>
    </>
  )
}

export default FeaturedProducts
