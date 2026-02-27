import { Badge } from "@/components/ui/badge";
import { Card,CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/products/product-price";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import ProductImages from "@/components/shared/products/product-images";
import AddToCart from '@/components/shared/products/add-to-cart'


const ProductDetailsPage = async (props:{params:Promise<{slug:string}>}) => {
    const {slug} = await props.params;
    const product = await getProductBySlug(slug);
    if(!product) notFound();
    return ( <>
    <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
            {/*IMAGES COLOUMN */}
            <div className='col-span-2'>
                <ProductImages images={product.images}/>
            </div>
            {/*Details Coulmn */}
            <div className='col-span-2 pl-10'>
                <div className='flex flex-col gap-6 mt-4'></div>
                <p>{product.brand} {product.category}</p>
                <h1 className='h3-bold mt-4'>{product.name}</h1>
                <p className='mt-4'>{Number(product.rating).toFixed(1)} of {product.numReviews} Reviews</p>
                <div className='flex flex-col sm:flex-row sm:items-center'>
                    <ProductPrice value={Number(product.price)} className='w-24 rounded-full bg-green-100 text-green-700 px-5 py-2 mt-4'/>
                </div>
                <div className='mt-10'>
                    <p className='font-semibold'>Description</p>
                    <p>{product.description}</p>
                </div>
            </div>
            {/*Actions Coloumn */}
            <div>
              <Card>
                <CardContent className="p-4">
                    <div className='mb-2 flex justify-between'>
                     <div>Price</div>
                     <div><ProductPrice value={Number(product.price)}/></div>
                    </div>
                    <div className='mb-2 flex justify-between'>
                        <div>Status</div>
                        {product.stock > 0 ? (
                            <Badge variant='outline'>In Stock</Badge>
                        ) :(
                            <Badge variant='destructive'>Out Of Stock</Badge>
                        )}
                    </div>
                    {product.stock > 0 && (
                        <div className='flex-center'>
                            <AddToCart item={{
                                productId:product.id,
                                name:product.name,
                                slug:product.slug,
                                price:product.price.toString(),
                                quantity:1,
                                image:product.images![0]
                            }}/>

                        </div>
                    )}
                   

                </CardContent>
              </Card>
            </div>

        </div>
    </section>


    </> );
}
 
export default ProductDetailsPage;