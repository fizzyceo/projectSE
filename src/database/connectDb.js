const { createClient } = require("@supabase/supabase-js");

let supabaseInstance = null;

const connectDb = () => {
  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(
        process.env.ANON_PUBLIC,
        process.env.SERVICE_ROLE
      );
      console.info("Connected to Supabase");
    }
    return supabaseInstance;
  } catch (error) {
    console.error("Supabase connection error", error);
    throw error; // Re-throw the error for handling at the caller level if needed
  }
};

module.exports = connectDb;
