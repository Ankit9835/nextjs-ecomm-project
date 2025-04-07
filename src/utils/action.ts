import db from '@/src/utils/db';
import { redirect } from 'next/navigation';


export const fetchFeaturedProducts = async () => {
    try {
        const products = await db.product.findMany({
            where:{
                featured:true
            }
        })
        return products
    } catch (error) {
        console.log(error)
    }
}

export const fetchAllProducts = async ({search =  ''}:{search:string}) => {
    const products = await db.product.findMany({
        where:{
            OR:[
                { name: { contains: search, mode: 'insensitive' } },
                { company: { contains: search, mode: 'insensitive' } },
            ]
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    return products
}

export const fetchSingleProduct = async (productId: string) => {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!product) {
      redirect('/products');
    }
    return product;
  };