import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_COSMUV_TEMPLATE = {
  currency: "DH",
  primary_color: "#000000",
  country: "MA",
  light_primary: "#000000",
  dark_primary: "#D0021B",
  secondary_color: "#f899a2",
  body_bg: "#F77C94",
  success_color: "#00C853",
  info_color: "#40C4FF",
  warning_color: "#FFAB00",
  danger_color: "#F44336",
  guarantee_color: "#ffab00",
  checkout_color: "#000000",
  field_name_enabled: true,
  field_name_label: "Full name",
  field_phone_enabled: true,
  field_phone_label: "Phone number",
  field_city_enabled: true,
  field_city_label: "City",
  field_address_enabled: true,
  field_address_label: "Address (Road, House number)",
  store_email: "",
  logo_url: "",
  favicon_url: "",
  language: "en",
  store_rtl: false,
  max_orders_per_ip: null,
  checkout_main_title: "CASH ON DELIVERY",
  checkout_address_title: "Enter your shipping address",
  checkout_address_desc: "You will be contacted by one of our operators to confirm your order before shipping.",
  checkout_button_text: "COMPLETE ORDER",
  checkout_field_order: ["name", "phone", "city", "address"],
  checkout_language: "en",
  menu_font: "Inter",
  body_font: "Inter",
  store_font: null,
  footer_newsletter_title: "Subscribe to our emails",
  footer_newsletter_subtitle: "Join our email list for exclusive offers and the latest news.",
  footer_show_newsletter: true,
  footer_links_title: "Products",
  footer_logo_url: "",
  footer_logo_size: 65,
  express_checkout: true,
  header_desktop_layout: ["menu", "logo", "search", "cart"],
  header_mobile_layout: ["menu", "logo", "cart"],
  header_bg_color: "#FFFFFF",
  header_button_color: "#000000",
  header_border_enabled: true,
  header_border_color: "#F0F0F0",
  notice_bar_desktop_enabled: true,
  notice_bar_desktop_text: "HIGH DEMAND: SELLING OUT FAST",
  notice_bar_desktop_bg_color: "#000000",
  notice_bar_desktop_text_color: "#FFFFFF",
  notice_bar_desktop_above_header: true,
  notice_bar_mobile_enabled: true,
  notice_bar_mobile_text: "HIGH DEMAND: SELLING OUT FAST",
  notice_bar_mobile_bg_color: "#000000",
  notice_bar_mobile_text_color: "#FFFFFF",
  notice_bar_mobile_above_header: true,
  notice_bar_desktop_icon: "delivery",
  notice_bar_mobile_icon: "delivery",
  homepage_products_enabled: true,
  homepage_products_title: "Featured Products",
  homepage_products_limit: 8,
  homepage_products_subtitle: "",
  homepage_products_category: "Best sales",
  homepage_products_load_more: false,
  homepage_products_view_type: "Style 2",
  slider_images: [
    "https://pub-33219faf94984e759ea6b688e0938491.r2.dev/1782596007079-4c28f4a3f51704e0.jpg"
  ],
  homepage_features_enabled: true,
  homepage_features: [
    { icon: "star", title: "New Feature", description: "Describe the feature here." },
    { icon: "heart", title: "New Feature", description: "Describe the feature here." },
    { icon: "gift", title: "New Feature", description: "Describe the feature here." }
  ],
  homepage_features_view_type: "Slider",
  homepage_layout_order: ["ticker", "products", "features"],
  homepage_ticker_enabled: true,
  homepage_ticker_items: [
    "https://pub-33219faf94984e759ea6b688e0938491.r2.dev/1782523114620-4af3073e4ce7d21a.png",
    "https://pub-33219faf94984e759ea6b688e0938491.r2.dev/1782523120209-a1f6e87acb4941f4.png"
  ],
  homepage_features_title: "Why Choose Us",
  homepage_features_subtitle: "Discover the benefits that make our products stand out from the rest.",
  homepage_hero_text: "Profitez des meilleures offres de la semaine avec des réductions incroyables !",
  homepage_hero_button_text: "Offres du jour",
  homepage_hero_text_enabled: true,
  header_desktop_bg_color: "#FFFFFF",
  header_desktop_button_color: "#171717",
  header_desktop_border_enabled: true,
  header_desktop_border_color: "#F0F0F0",
  meta_pixel_id: null,
  meta_pixel_enabled: false,
  meta_pixel_deliverability_rate: 100,
  meta_pixel_conversion_type: "purchase",
  meta_pixel_ids: [],
  meta_pixels: []
};

const DEFAULT_COSMUV_PAGES = [
  { title: "About Us", slug: "about-us" },
  { title: "Shipping & Delivery", slug: "shipping" },
  { title: "FAQ", slug: "faq" },
  { title: "Terms and Conditions", slug: "terms-and-conditions" },
  { title: "Privacy Policy & Confidentiality", slug: "privacy-policy-confidentiality" },
  { title: "Contact Us", slug: "contact-us" }
];

const DEFAULT_COSMUV_MENUS = [
  {
    name: "Main Menu",
    slug: "main-menu",
    items: [
      { id: "b882838e-8ef9-433d-9773-ace694228e91", url: "/", label: "Home" },
      { id: "819cbea9-e533-466a-997c-42acee2ee892", url: "/pages/about-us", label: "About Us" },
      { id: "93a5b53c-e1ff-49ee-be21-ec386e511efc", url: "/pages/contact-us", label: "Contact Us" }
    ]
  },
  {
    name: "Footer Menu",
    slug: "footer-menu",
    items: [
      { id: "0aab9d80-0a89-4555-a89b-d1e30a62d31c", url: "/pages/about-us", label: "About Us" },
      { id: "dbb44821-3538-41cb-8b37-97e768e9d706", url: "/pages/privacy-policy-confidentiality", label: "Privacy Policy & Confidentiality" },
      { id: "7c167c6c-5404-44bf-934f-e8b0d252fc48", url: "/pages/terms-and-conditions", label: "Terms and Conditions" },
      { id: "972eaf98-956f-4425-b5f7-f5278dce7799", url: "/pages/shipping", label: "Shipping & Delivery" },
      { id: "971173cb-59d8-4e1e-909c-6fb8570405a3", url: "/pages/contact-us", label: "Contact Us" },
      { id: "42278411-6f16-4181-af47-533c2c08bb2f", url: "/pages/faq", label: "FAQ" }
    ]
  }
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, subdomain, storeName } = body;

    if (!userId || !subdomain || !storeName) {
      return NextResponse.json(
        { error: "userId, subdomain, and storeName are required." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    });

    // Check if store already exists for this subdomain
    const { data: existingStore } = await supabaseAdmin
      .from("stores")
      .select("id")
      .eq("subdomain", subdomain)
      .maybeSingle();

    if (existingStore) {
      return NextResponse.json(
        { error: "This subdomain is already taken." },
        { status: 409 }
      );
    }

    // 1. Fetch the live COSMUV tenant store instance from our database as our template seed
    const { data: templateStore } = await supabaseAdmin
      .from("stores")
      .select("*")
      .ilike("subdomain", "cosmuv")
      .maybeSingle();

    let newStorePayload: Record<string, any> = {};
    if (templateStore) {
      // Extract the backend configuration data version of the COSMUV store row
      // Remove identity/unique columns that should not be copied
      const {
        id,
        created_at,
        updated_at,
        subdomain: _sub,
        store_name: _name,
        user_id: _uid,
        custom_domain,
        custom_domain_verified,
        status: _st,
        ...templateConfig
      } = templateStore;
      newStorePayload = { ...templateConfig };
    } else {
      // Hardcode default fallback schema matching COSMUV layout just in case template row is ever offline/renamed
      newStorePayload = { ...DEFAULT_COSMUV_TEMPLATE };
    }

    // Override with new store identity
    newStorePayload = {
      ...newStorePayload,
      subdomain: subdomain,
      store_name: storeName,
      user_id: userId,
      status: body.status || "pending",
      header_logo_text: storeName,
      footer_logo_text: storeName,
    };

    // 2. Insert the store cleanly using service role with the full cloned configuration
    const { data: store, error: storeError } = await supabaseAdmin
      .from("stores")
      .insert(newStorePayload)
      .select()
      .single();

    if (storeError) {
      console.error("Error creating store in DB:", storeError);
      return NextResponse.json(
        { error: storeError.message || "Failed to create store entry." },
        { status: 500 }
      );
    }

    // 3. Clone child tables (store_pages and store_menus) so navigation works out of the box
    if (store && store.id) {
      try {
        if (templateStore && templateStore.id) {
          // Clone custom pages from live COSMUV store
          const { data: templatePages } = await supabaseAdmin
            .from("store_pages")
            .select("*")
            .eq("store_id", templateStore.id);

          if (templatePages && templatePages.length > 0) {
            const newPages = templatePages.map((p: any) => {
              const { id, created_at, updated_at, store_id, ...pageData } = p;
              return { ...pageData, store_id: store.id };
            });
            await supabaseAdmin.from("store_pages").insert(newPages);
          }

          // Clone navigation menus from live COSMUV store
          const { data: templateMenus } = await supabaseAdmin
            .from("store_menus")
            .select("*")
            .eq("store_id", templateStore.id);

          if (templateMenus && templateMenus.length > 0) {
            const newMenus = templateMenus.map((m: any) => {
              const { id, created_at, updated_at, store_id, ...menuData } = m;
              return { ...menuData, store_id: store.id };
            });
            await supabaseAdmin.from("store_menus").insert(newMenus);
          }
        } else {
          // Fallback to inserting default pages and menus
          const newPages = DEFAULT_COSMUV_PAGES.map(p => ({
            ...p,
            store_id: store.id
          }));
          await supabaseAdmin.from("store_pages").insert(newPages);

          const newMenus = DEFAULT_COSMUV_MENUS.map(m => ({
            ...m,
            store_id: store.id
          }));
          await supabaseAdmin.from("store_menus").insert(newMenus);
        }
      } catch (childErr) {
        console.error("Non-fatal error cloning template pages/menus:", childErr);
      }
    }

    return NextResponse.json({ success: true, store });
  } catch (error: any) {
    console.error("Store creation API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
