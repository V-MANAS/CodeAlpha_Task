import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/User";


export async function POST(request){
    try{
        const {userId} =getAuth(request)
        const {address,items} = await request.json();

        if(!address || items.length === 0 ){
            return NextResponse.json({success:false,message:'Invalid data!'});

        }

        //calculate amount using items
        const amount = await items.reduce(async(acc,item)=>{
            const product = await Product.findById(item.product);
            return await acc + product.offerPrice * item.quantity;
        },0)

       await inngest.send({
  name: "order/created",
  data: {
    userId,
    items: items.map((item) => ({
      product: item.product,   // string ID
      quantity: item.quantity,
    })),
    amount: Number(amount),
    address,                   // FULL OBJECT
    date: Date.now(),
  },
});



        //clear user cart
       const user = await User.findOne({ clerkId: userId });


        user.cartItems = {}
        await user.save()

        return NextResponse.json({success:true,message:'Order placed'})


    }catch(error){
        console.log(error);
        return NextResponse.json({success:false,message:error.message})
    }
}