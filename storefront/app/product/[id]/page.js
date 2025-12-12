// // /storefront/app/product/[id]/page.js
// import { medusa } from "@/lib/medusa";

// export default async function ProductPage({ params }) {
//   const { id } = params;

//   const { product } = await medusa.products.retrieve(id);

//   return (
//     <main className="p-8">
//       <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
//       <p className="mb-6">{product.description}</p>

//       <div className="p-4 border rounded-lg">
//         <p className="text-lg font-semibold">Price:</p>
//         {product.variants[0]?.prices?.map((price) => (
//           <p key={price.id}>
//             {price.amount / 100} {price.currency_code.toUpperCase()}
//           </p>
//         ))}
//       </div>
//     </main>
//   );
// }
