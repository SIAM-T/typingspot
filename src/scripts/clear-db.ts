import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { supabase } from "@/lib/supabase/config";

async function clearDatabase() {
  try {
    // Clear typing results first (due to foreign key constraints)
    console.log("Clearing typing_results...");
    const { error: error1 } = await supabase.from("typing_results").delete().neq("id", "0");
    if (error1) throw error1;

    // Clear user achievements
    console.log("Clearing user_achievements...");
    const { error: error2 } = await supabase.from("user_achievements").delete().neq("id", "0");
    if (error2) throw error2;

    // Clear code snippets
    console.log("Clearing code_snippets...");
    const { error: error3 } = await supabase.from("code_snippets").delete().neq("id", "0");
    if (error3) throw error3;

    // Clear users table last
    console.log("Clearing users...");
    const { error: error4 } = await supabase.from("users").delete().neq("id", "0");
    if (error4) throw error4;

    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
  }
}

// Run the clear function
clearDatabase(); 