import {Prisma} from "@prisma/client"
const sampleData  = {
    products:[
        {
            name: 'Polo Sporting Tshirt',
            slug: 'polo-sporting-tshirt',
            category:'men,s dress shirts',
            description:'Classic Polo style with modern comfort',
            images:[
                '/images/sample-products/p1-1.jpg',
                '/images/sample-products/p1-2.jpg',

            ],
            price:new Prisma.Decimal(59.99),
            brand:'Polo',
            rating:new Prisma.Decimal(4.5),
            numReviews:10,
            stock:5,
            isFeatured:true,
            banner:'banner-1.jpg',

        },
        {
            name: 'Polo Sporting Tshirt 2',
            slug: 'polo-sporting-tshirt-2',
            category:'men,s dress shirts',
            description:'Classic Polo style with modern comfort',
            images:[
                '/images/sample-products/p2-1.jpg',
                '/images/sample-products/p2-2.jpg',

            ],
            price:new Prisma.Decimal(59.99),
            brand:'Polo',
            rating:new Prisma.Decimal(4.5),
            numReviews:10,
            stock:5,
            isFeatured:true,
            banner:'banner-1.jpg',

        },
        {
            name: 'Polo Sporting Tshirt 3',
            slug: 'polo-sporting-tshirt-3',
            category:'men,s dress shirts',
            description:'Classic Polo style with modern comfort',
            images:[
                '/images/sample-products/p3-1.jpg',
                '/images/sample-products/p3-2.jpg',

            ],
            price:new Prisma.Decimal(59.99),
            brand:'Polo',
            rating:new Prisma.Decimal(4.5),
            numReviews:10,
            stock:5,
        },
        {
            name: 'Polo Sporting Tshirt 4',
            slug: 'polo-sporting-tshirt-4',
            category:'men,s dress shirts',
            description:'Classic Polo style with modern comfort',
            images:[
                '/images/sample-products/p4-1.jpg',
                '/images/sample-products/p4-2.jpg',

            ],
            price:new Prisma.Decimal(59.99),
            brand:'Polo',
            rating:new Prisma.Decimal(4.5),
            numReviews:10,
            stock:5,
        },
        {
            name: 'Polo Sporting Tshirt 5',
            slug: 'polo-sporting-tshirt-5',
            category:'men,s dress shirts',
            description:'Classic Polo style with modern comfort',
            images:[
                '/images/sample-products/p5-1.jpg',
                '/images/sample-products/p5-2.jpg',

            ],
            price:new Prisma.Decimal(59.99),
            brand:'Polo',
            rating:new Prisma.Decimal(4.5),
            numReviews:10,
            stock:5,
        },
        {
            name: 'Polo Sporting Tshirt 6',
            slug: 'polo-sporting-tshirt-6',
            category:'men,s dress shirts',
            description:'Classic Polo style with modern comfort',
            images:[
                '/images/sample-products/p6-1.jpg',
                '/images/sample-products/p6-2.jpg',

            ],
            price:new Prisma.Decimal(59.99),
            brand:'Polo',
            rating: new Prisma.Decimal(4.5),
            numReviews:10,
            stock:5,
        }

  
    ]

}
 
export default sampleData;