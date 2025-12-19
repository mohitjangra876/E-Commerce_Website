import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';

const Product = () => {
const {products , currency, addToCart}= useContext(ShopContext);
const [productsData, setProductData]=useState(false);
const {productId}=useParams();
const [image , setImage]=useState('');
const [size , setSize]=useState('');
  const fechProductData=async()=>{
    products.map((item)=>{
      if(item._id===productId){
        setProductData(item);
          // console.log(item);
          setImage(item.image[0]);
      return null;
      }
    
    })
  }

  useEffect(()=>{
             fechProductData();
  },[productId])

  return productsData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in-out duration-500 opacity-100' >
      
{/* Product Data */}

<div className='flex gap-12 sm:gap-12 flex-col sm:flex-row' >

{/* Product Images */}

<div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row ' >
<div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full  ' >

 { productsData.image.map((item,index)=>(
    <img src={item} onClick={()=>setImage(item)} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer aspect-square object-cover' style={{objectPosition: 'top'}} />
  ))
}
</div>

<div className='w-full sm:w-[80%] ' > 
  <img src={image} className='w-full h-auto object-contain'  />
    </div>

</div>

{/* Product Info  */}

<div className='flex-1 ' >
<h1 className='font-medium text-2xl mt-2 ' >{productsData.name}  </h1>
<div className='flex items-center gap-1 mt-2' >
  <img src={assets.star_icon} className='w-3 5 ' />
  <img src={assets.star_icon} className='w-3 5 ' />
  <img src={assets.star_icon} className='w-3 5 ' />
  <img src={assets.star_icon} className='w-3 5 ' />
  <img src={assets.star_dull_icon} className='w-3 5 ' />
  <p className='pl-2' >(122)</p>
</div>
<p className='mt-5 text-3xl font-medium' >{currency} {productsData.price}</p>
<p className='mt-5 text-grey-500 md:w-4/5' >{productsData.description}</p>
<div className='flex flex-col gap-4 my-8' >
  <p>Select-Size</p>
  <div className='flex gap-2' >
{productsData.sizes.map((item,index)=>(
  <button onClick={()=>setSize(item)} key={index} className={`border border-gray-100 py-2 px-4 bg-gray-100 ${item===size?'border-orange-500':''} `}  > {item} </button>
))}
  </div>

</div>
<button onClick={async () => {
  if (!size) {
    toast.error('Please select a size');
    return;
  }
  await addToCart(productsData._id, size, 1);
}} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700' >Add to Cart</button>
<hr className='mt-8 sm:w-4/5' />
<div className='text-sm text-gray-500 mt-5 flex flex-col gap-1' >
  <p>100% Original Product.</p>
  <p> Cash on delivery is available on this product. </p>
  <p>Eaasy return and exchange policy within 7 days.</p>

</div>
</div> 
</div>

{/* Description and Review Section */}

<div className='mt-20' >
<div className='flex' >
  <b className='border px-5 py-3 text-sm' > Description </b>
<p  className='border px-5 py-3 text-sm'> Reviews (122)  </p>
</div>
<div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 '  >
<p>
  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio saepe distinctio inventore at animi, quia veritatis quisquam temporibus officia minus ex, hic ut dolorem. Nostrum voluptates molestias laudantium explicabo odio. 
   </p>
   <p>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias possimus qui amet quam enim asperiores? Enim obcaecati velit inventore accusamus qui dignissimos dicta culpa aspernatur maxime a, soluta id nulla!
   </p>
</div>
</div>

{/*  Display realted products */}

<RelatedProducts category={productsData.category} subCategory={productsData.subCategory}  />

    </div>
  ) : <div className='opacity-0' ></div>
}

export default Product
