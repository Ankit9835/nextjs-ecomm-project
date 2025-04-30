'use server';

import db from '@/src/utils/db';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect, usePathname } from 'next/navigation';
import { imageSchema, productSchema, reviewSchema, validateWithZodSchema } from './schemas';
import { deleteImage, uploadImage } from './superbase';
import { revalidatePath } from 'next/cache';
import { Cart } from '@prisma/client';


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

  export const fetchFavoriteId = async ({ productId }: { productId: string }) => {
  const user = await getAuthUser();
  const favorite = await db.favorite.findFirst({
    where: {
      productId,
      clerkId: user.id,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id || null;
};

export const toggleFavoriteAction = async (prevState: {
  productId:string,
  favoriteId:string | null,
  pathName:string
}) => {

  try {
    console.log('test')
    const user = await getAuthUser();
    console.log(user.id)
  const {productId, favoriteId, pathName} = prevState
  if(favoriteId){
    await db.favorite.delete({
      where:{
        id: favoriteId
      }
    })
  } else {
    await db.favorite.create({
      data:{
        productId,
        clerkId: user?.id
      }
    })
  }
  revalidatePath(pathName);
  return { message: favoriteId ? 'Removed from Faves' : 'Added to Faves' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchUserFavorites = async () => {
  try {
    const user = await getAuthUser();
    const favorites = await db.favorite.findMany({
      where:{
        clerkId: user.id
      },
      include:{
        product:true
      }
    })
    //console.log('fav',favorites)
    return favorites
  } catch (error) {
    return renderError(error);
  }
}

export const createReviewAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);

    const validatedFields = validateWithZodSchema(reviewSchema, rawData);

    await db.review.create({
      data: {
        ...validatedFields,
        clerkId: user.id,
      },
    });
    revalidatePath(`/products/${validatedFields.productId}`);
    return { message: 'Review submitted successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchProductReviews = async (productId:string) => {
  try {
    const review = db.review.findMany({
      where:{
        productId
      },
      orderBy:{
        createdAt:'desc'
      }
    })
    return review
  } catch (error) {
    return renderError(error);
  }
};
export const fetchProductReviewsByUser = async () => {
  try {
    const user = await getAuthUser()
    const review = await db.review.findMany({
      where:{
        clerkId:user?.id
      },
      select:{
        id:true,
        rating:true,
        comment:true,
        product: {
          select: {
            image: true,
            name: true,
          },
        },
      }
    })
    return review
  } catch (error) {
    return renderError(error);
  }
  
};
export const deleteReviewAction = async (prevState: {reviewId: string}) => {
  const user = await getAuthUser();
  try {
    const {reviewId} = prevState
      const review = db.review.delete({
        where:{
          id:reviewId,
          clerkId: user.id,
        }
      })
      revalidatePath('/reviews');
      return { message: 'Review deleted successfully' };
  } catch (error) {
    return renderError(error);
  }
};

export const findExistingReview = async (userId: string, productId: string) => {
  return db.review.findFirst({
    where: {
      clerkId: userId,
      productId,
    },
  });
};

export const fetchProductRating = async (productId: string) => {
  try {
    const result = await db.review.groupBy({
      by: ['productId'],
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
      where: {
        productId,
      },
    });
    
    
    return {
      rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
      count: result[0]?._count.rating ?? 0,
    };
  } catch (error) {
    
  }
};

export const fetchCartItems = async () => {
  const {userId} = auth()
  try {
    const cartItems = await db.cart.findFirst({
      where:{
        clerkId: userId ?? '',
      },
      select:{
        numItemsInCart:true
      }
    })
    console.log('cart', cartItems)
    return cartItems || 0
  } catch (error) {
    return renderError(error);
  }
};

const fetchProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where:{
      id:productId
    }
  })
  if(!product){
    throw new Error('product not found')
  } 
  return product
};

export const fetchOrCreateCart = async ({userId,errorOnFailure=false}:{userId:string,errorOnFailure?:boolean}) => {
  let cart = await db.cart.findFirst({
    where:{
      clerkId:userId
    },
    include:{
      cartItems:{
        include:{
          product:true
        }
      }
    }
  })
  console.log('cartssssss',cart)
  if(!cart && errorOnFailure){
    throw new Error('cart not found')
  } 
  if(!cart){
   cart = await db.cart.create({
      data:{
        clerkId: userId
      },
      include:{
        cartItems:{
          include:{
            product:true
          }
        }
      }
    })
  }

  return cart
};

const updateOrCreateCartItem = async ({productId,cartId,amount}: {productId:string,cartId:string,amount:number}) => {
  let cartItems = await db.cartItem.findFirst({
    where:{
      cartId,
      productId
    }
  })

  if(cartItems){
    cartItems = await db.cartItem.update({
      where:{
        id:cartItems.id,
      },
      data:{
        amount: cartItems.amount + amount
      }
    })
  } else {
    cartItems = await db.cartItem.create({
      data: { amount, productId, cartId },
    });
  }
};

export const updateCart = async (cart:Cart) => {
  const cartItems = await db.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
    include: {
      product: true, // Include the related product
    },
  });

  let numItemsInCart = 0;
  let cartTotal = 0;

  for (const item of cartItems) {
    numItemsInCart += item.amount;
    cartTotal += item.amount * item.product.price;
  }
  const tax = cart.taxRate * cartTotal;
  const shipping = cartTotal ? cart.shipping : 0;
  const orderTotal = cartTotal + tax + shipping;

  await db.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      numItemsInCart,
      cartTotal,
      tax,
      orderTotal,
    },
  });
};

export const addToCartAction = async (prevState:any, formData:FormData) => {
  const user = await getAuthUser()
  try {
    const productId = formData.get('productId') as string
    const amount = Number(formData.get('amount'))
    await fetchProduct(productId)
    const cart = await fetchOrCreateCart({userId:user.id})
    await updateOrCreateCartItem({productId,cartId:cart.id,amount})
    await updateCart(cart)
  } catch (error) {
    
  }
  redirect('/cart');
  return {message: 'cart added successfully'}
};

export const removeCartItemAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const cartItemId = formData.get('id') as string;
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    await db.cartItem.delete({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    await updateCart(cart);
    revalidatePath('/cart');
    return { message: 'Item removed from cart' };
  } catch (error) {
    return renderError(error);
  }
};

export const updateCartItemAction = async ({
  amount,
  cartItemId,
}: {
  amount: number;
  cartItemId: string;
}) => {
  const user = await getAuthUser();

  try {
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    await db.cartItem.update({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      data: {
        amount,
      },
    });
    await updateCart(cart);
    revalidatePath('/cart');
    return { message: 'cart updated' };
  } catch (error) {
    return renderError(error);
  }
};

export const createOrderAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  let orderId: null | string = null
  let cartId: null | string = null
  try {
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    cartId = cart.id
    await db.order.deleteMany({
      where: {
        clerkId: user.id,
        isPaid: false,
      },
    });
    const order = await db.order.create({
      data: {
        clerkId: user.id,
        products: cart.numItemsInCart,
        orderTotal: cart.orderTotal,
        tax: cart.tax,
        shipping: cart.shipping,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    orderId = order.id
    await db.cart.delete({
      where: {
        id: cart.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect(`/checkout?orderId=${orderId}&cartId=${cartId}`);
};
export const fetchUserOrders = async () => {
  const user = await getAuthUser();
  const orders = await db.order.findMany({
    where: {
      clerkId: user.id,
      isPaid: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return orders;
};

export const fetchAdminOrders = async () => {
  const user = await getAdminUser();

  const orders = await db.order.findMany({
    where: {
      isPaid: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return orders;
};