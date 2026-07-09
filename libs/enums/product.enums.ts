export const ProductTypeName = [
  "Blazer",
  "Blouse",
  "Cap",
  "Cardigan",
  "Coat",
  "Dress",
  "Gloves",
  "Hoodie",
  "Jacket",
  "Polo shirt",
  "Scarf",
  "Shirt",
  "Shorts",
  "Skirt",
  "Slippers",
  "Sneakers",
  "Socks",
  "Sweater",
  "T-shirt",
  "Tie",
  "Top",
  "Trousers",
  "Underwear bottom",
  "Vest top",
  "Watch",
] as const;

export type ProductTypeName = (typeof ProductTypeName)[number];

export const GraphicalAppearanceName = [
  "All over pattern",
  "Application/3D",
  "Chambray",
  "Check",
  "Denim",
  "Embroidery",
  "Jacquard",
  "Lace",
  "Melange",
  "Placement print",
  "Solid",
  "Stripe",
] as const;

export type GraphicalAppearanceName = (typeof GraphicalAppearanceName)[number];

export const ColourGroupName = [
  "Black",
  "Dark Beige",
  "Dark Blue",
  "Dark Green",
  "Dark Grey",
  "Dark Orange",
  "Dark Pink",
  "Dark Purple",
  "Dark Red",
  "Green",
  "Greenish Khaki",
  "Grey",
  "Light Beige",
  "Light Grey",
  "Light Pink",
  "Light Purple",
  "Orange",
  "Other Pink",
  "Pink",
  "Red",
  "White",
  "Yellow",
  "Yellowish Brown",
] as const;

export type ColourGroupName = (typeof ColourGroupName)[number];

export const PerceivedColourValueName = [
  "Bright",
  "Dark",
  "Dusty Light",
  "Light",
  "Medium",
  "Medium Dusty",
] as const;

export type PerceivedColourValueName =
  (typeof PerceivedColourValueName)[number];

export const PerceivedColourMasterName = [
  "Beige",
  "Black",
  "Blue",
  "Brown",
  "Green",
  "Grey",
  "Khaki green",
  "Lilac Purple",
  "Orange",
  "Pink",
  "Red",
  "White",
  "Yellow",
] as const;

export type PerceivedColourMasterName =
  (typeof PerceivedColourMasterName)[number];

export const DepartmentName = [
  "Blazer",
  "Blouse",
  "Shorts",
  "Skirt",
  "Dress",
  "Accessories",
  "Asia Assortment",
  "Blouse & Dress",
  "Campaigns",
  "Denim trousers",
  "Denim wardrobe H&M man inactive from S.6",
  "EQ H&M Man",
  "Jacket",
  "Jacket Casual",
  "Jersey",
  "Jersey Basic",
  "Jersey Fancy",
  "Jersey fancy",
  "Jersey inactive from s1",
  "Knitwear",
  "Light Basic Jersey",
  "Local relevance",
  "Nursing",
  "Outwear",
  "Shirt",
  "Shoes",
  "Small Accessories",
  "Socks Bin",
  "Take Care External",
  "Trouser",
  "Trousers & Skirt",
  "Underwear Jersey",
  "Woven",
  "Woven Occasion",
  "Woven bottoms",
  "Woven top",
] as const;

export type DepartmentName = (typeof DepartmentName)[number];

export const IndexName = ["Ladieswear", "Menswear"] as const;

export type IndexName = (typeof IndexName)[number];
