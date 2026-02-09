// import {getAuth} from "@clerk/nextjs/server";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import connectDB from '@/config/db'


// export async function GET(request){
//     try{
//         const {userId} = getAuth(request)
        
//         await connectDB();
//         const user = await User.findById(userId);
        
//         if(!user){
//             return NextResponse.json({success:false, message:"Uer not found"});

//         } 

//         return NextResponse.json({success:true,user}); 

//     }catch(error){
//         return NextResponse.json({success:false, message:error.message});

//     }
// }

import { getAuth, currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";

export async function GET(request) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" });
  }

  await connectDB();

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    const clerkUser = await currentUser();

    user = await User.create({
      clerkId: userId,
      name: clerkUser.firstName || "User",
      email: clerkUser.emailAddresses[0].emailAddress,
      imageUrl: clerkUser.imageUrl,
      cartItems: {},
    });
  }

  return NextResponse.json({ success: true, user });
}
