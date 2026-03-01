'use server'
import {prisma} from "../prisma"
//import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCT_LIMIT } from "../constants";
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return data.map(product => ({ ...product, price: product.price.toString(), rating: product.rating.toString(), }));
}

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });   
  return products;
}

export async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    take: 4
  });
  return products;
}
export async function getProductBySlug(slug:string){
  return prisma.product.findFirst({
    where: {slug:slug},
  });

}
