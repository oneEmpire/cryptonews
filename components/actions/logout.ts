"use server"

import { createClient } from "@/app/utils/supabase/server"


export default async function Logout(){
    const  supabase = await createClient();
    const  {error} = await supabase.auth.signOut()

    if(!error){
        return { success: true, message:"logout succesfull" }
    }
    else{
        return { success: false, message: error.message }
    }
}