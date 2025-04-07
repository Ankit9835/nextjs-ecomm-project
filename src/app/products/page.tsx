import ProductsContainer from '@/src/components/products/ProductsContainer'
import React from 'react'

const ProductPage = async ({searchParams}: {searchParams: {layout:string, search:string}}) => {
  const layout = searchParams.layout || 'grid'
  const search = searchParams.search || ''
  return (
    <>
      <ProductsContainer layout={layout} search={search} />
   </>
  )
}

export default ProductPage
