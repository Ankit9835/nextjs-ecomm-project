'use server';

import db from '@/src/utils/db';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { imageSchema, productSchema, validateWithZodSchema } from './schemas';
import { deleteImage, uploadImage } from './superbase';
import { revalidatePath } from 'next/cache';


const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : 'An error occurred',
  };
};

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error('You must be logged in to access this route');
  }
  return user;
};

const getAdminUser = async () => {
  const user = await getAuthUser()
  if(user.id != process.env.ADMIN_USER_ID) redirect('/')
    return user;
}


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

  
  export const createProductAction = async (
    prevState: any,
    formData: FormData
  ): Promise<{ message: string }> => {
    const user = await getAuthUser();

    try {
     const product = Object.fromEntries(formData)
     const file = formData.get('image') as File
      const validatedData = validateWithZodSchema(productSchema, product);
      const validateFile = validateWithZodSchema(imageSchema, { image: file });
      const fullPath = await uploadImage(validateFile.image);
  
      await db.product.create({
        data: {
          ...validatedData,
          image: fullPath,
          clerkId: user.id,
        },
      });
      return { message: 'product create' };
    } catch (error) {
      return renderError(error);
    }
  };

  export const fetchAdminProducts = async () => {
    await getAdminUser();
    const products = await db.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return products;
  };

  export const deleteProductAction = async (prevState: { productId: string }) => {
    const { productId } = prevState;
    await getAdminUser();
  
    try {
     const product = await db.product.delete({
        where: {
          id: productId,
        },
      });
      await deleteImage(product.image);
      revalidatePath('/admin/products');
      return { message: 'product removed' };
    } catch (error) {
      return renderError(error);
    }
  };

  export const fetchAdminProductDetails = async (productId: string) => {
    await getAdminUser();
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!product) redirect('/admin/products');
    return product;
  };

  export const updateProductAction = async (
    prevState: any,
    formData: FormData
  ) => {
    await getAdminUser();
    try {
      const productId = formData.get('id') as string;
      console.log('id',productId)
      const rawData = Object.fromEntries(formData);
  
      const validatedFields = validateWithZodSchema(productSchema, rawData);
  
      await db.product.update({
        where: {
          id: productId,
        },
        data: {
          ...validatedFields,
        },
      });
      revalidatePath(`/admin/products/${productId}/edit`);
      return { message: 'Product updated successfully' };
    } catch (error) {
      console.log('error',error)
      return renderError(error);
    }
  };
  export const updateProductImageAction = async (
    prevState: any,
    formData: FormData
  ) => {
    await getAuthUser();
  try {
    const image = formData.get('image') as File;
    const productId = formData.get('id') as string;
    const oldImageUrl = formData.get('url') as string;

    const validatedFile = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFile.image);
    await deleteImage(oldImageUrl);
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        image: fullPath,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: 'Product Image updated successfully' };
  } catch (error) {
    return renderError(error);
  }
   
  };