import { createClient } from "@supabase/supabase-js";

// Next.js sets these in standard environments, but for a standalone script we might need to load from .env.local
import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].trim().replace(/^"|"$/g, "");
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding categories...");
  
  const categoriesToInsert = [
    { name: "Watches", slug: "watches", description: "Luxury watches", sort_order: 1, is_active: true },
    { name: "Glasses", slug: "glasses", description: "Premium sunglasses", sort_order: 2, is_active: true }
  ];

  const categories = [];
  for (const cat of categoriesToInsert) {
    const { data, error } = await supabase.from("categories").upsert(cat, { onConflict: "slug" }).select().single();
    if (error) console.error("Error inserting category:", error);
    else categories.push(data);
  }

  const watchesCatId = categories.find(c => c.slug === "watches")?.id;
  const glassesCatId = categories.find(c => c.slug === "glasses")?.id;

  console.log("Seeding products...");
  
  const productsToInsert = [
    {
      title: "Royal Oak Chronograph",
      slug: "royal-oak-chronograph",
      description: "A stunning timepiece with octagonal bezel.",
      price: 25000,
      compare_at_price: 28000 as number | null,
      category_id: watchesCatId,
      is_active: true,
      is_featured: true,
      tags: ["luxury", "men", "automatic"]
    },
    {
      title: "Submariner Date",
      slug: "submariner-date",
      description: "The reference among divers' watches.",
      price: 12500,
      compare_at_price: null as unknown as number,
      category_id: watchesCatId,
      is_active: true,
      is_featured: false,
      tags: ["diver", "automatic", "steel"]
    },
    {
      title: "Aviator Classic",
      slug: "aviator-classic",
      description: "Timeless style originally designed for pilots.",
      price: 150,
      compare_at_price: 180 as number | null,
      category_id: glassesCatId,
      is_active: true,
      is_featured: true,
      tags: ["sunglasses", "classic", "unisex"]
    },
    {
      title: "Wayfarer Original",
      slug: "wayfarer-original",
      description: "Iconic sunglasses since 1952.",
      price: 160,
      compare_at_price: null as unknown as number,
      category_id: glassesCatId,
      is_active: true,
      is_featured: false,
      tags: ["sunglasses", "classic", "icon"]
    }
  ];

  for (const prod of productsToInsert) {
    const { error } = await supabase.from("products").upsert(prod, { onConflict: "slug" });
    if (error) console.error("Error inserting product:", error);
    else console.log(`Inserted product: ${prod.title}`);
  }

  console.log("Seeding store settings...");
  
  const defaultSettings = {
    supported_countries: ["SA", "MA", "AE", "EG", "KW", "QA", "BH", "OM", "JO", "LB", "TN", "DZ"],
    default_country: "MA",
    currency: "MAD",
    currency_symbol: "د.م.",
    phone_code: "+212",
    free_shipping_threshold: 500,
    default_shipping_cost: 50,
    store_phone: "+212 6XX XXX XXX",
    store_email: "contact@ysf.shoop",
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    const { error } = await supabase
      .from("store_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) console.error("Error inserting setting:", error);
    else console.log(`Inserted setting: ${key}`);
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
