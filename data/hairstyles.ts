import type { HairstyleOption } from "@/contexts/AppContext";

export const MALE_HAIRSTYLES: HairstyleOption[] = [
  { id: "m1", name: "Taper Fade", category: "Fade", gender: "male", thumbnailEmoji: "💈", prompt: "taper fade haircut, clean sides", isTrending: true },
  { id: "m2", name: "High Fade", category: "Fade", gender: "male", thumbnailEmoji: "✂️", prompt: "high skin fade haircut" },
  { id: "m3", name: "Low Fade", category: "Fade", gender: "male", thumbnailEmoji: "🪒", prompt: "low fade haircut, textured top" },
  { id: "m4", name: "Mid Fade", category: "Fade", gender: "male", thumbnailEmoji: "🎭", prompt: "mid fade haircut with wavy top" },
  { id: "m5", name: "Buzz Cut", category: "Short", gender: "male", thumbnailEmoji: "⚡", prompt: "buzz cut, military short hair" },
  { id: "m6", name: "Crew Cut", category: "Short", gender: "male", thumbnailEmoji: "🏋️", prompt: "classic crew cut hairstyle" },
  { id: "m7", name: "Undercut", category: "Short", gender: "male", thumbnailEmoji: "🔪", prompt: "undercut hairstyle with long top" },
  { id: "m8", name: "Pompadour", category: "Classic", gender: "male", thumbnailEmoji: "🎸", prompt: "pompadour hairstyle, slicked back" },
  { id: "m9", name: "Quiff", category: "Classic", gender: "male", thumbnailEmoji: "🌊", prompt: "quiff hairstyle, voluminous front" },
  { id: "m10", name: "Slick Back", category: "Classic", gender: "male", thumbnailEmoji: "🎩", prompt: "slick back hair, wet look" },
  { id: "m11", name: "Curly Top", category: "Curly", gender: "male", thumbnailEmoji: "🌀", prompt: "curly hair on top, sides faded" },
  { id: "m12", name: "Afro Fade", category: "Curly", gender: "male", thumbnailEmoji: "🌿", prompt: "afro fade hairstyle" },
  { id: "m13", name: "Korean Style", category: "Korean", gender: "male", thumbnailEmoji: "🇰🇷", prompt: "Korean two-block haircut", isNew: true },
  { id: "m14", name: "Two Block", category: "Korean", gender: "male", thumbnailEmoji: "✨", prompt: "Korean two block hairstyle", isNew: true },
  { id: "m15", name: "Flow Hair", category: "Long", gender: "male", thumbnailEmoji: "🌬️", prompt: "long flowing hair for men" },
  { id: "m16", name: "Man Bun", category: "Long", gender: "male", thumbnailEmoji: "🔝", prompt: "man bun hairstyle" },
  { id: "m17", name: "Faux Hawk", category: "Modern", gender: "male", thumbnailEmoji: "🦅", prompt: "faux hawk mohawk hairstyle" },
  { id: "m18", name: "Caesar Cut", category: "Classic", gender: "male", thumbnailEmoji: "👑", prompt: "caesar haircut, short fringe" },
  { id: "m19", name: "Textured Crop", category: "Modern", gender: "male", thumbnailEmoji: "🎯", prompt: "textured crop haircut, messy top", isTrending: true },
  { id: "m20", name: "Pakistani Style", category: "Cultural", gender: "male", thumbnailEmoji: "🌹", prompt: "traditional Pakistani hairstyle" },
  { id: "m21", name: "Wedding Style", category: "Special", gender: "male", thumbnailEmoji: "💍", prompt: "elegant wedding hairstyle for men" },
  { id: "m22", name: "Professional", category: "Special", gender: "male", thumbnailEmoji: "👔", prompt: "professional business hairstyle" },
];

export const FEMALE_HAIRSTYLES: HairstyleOption[] = [
  { id: "f1", name: "Beach Waves", category: "Wavy", gender: "female", thumbnailEmoji: "🌊", prompt: "beach waves hairstyle", isTrending: true },
  { id: "f2", name: "Straight Sleek", category: "Straight", gender: "female", thumbnailEmoji: "➖", prompt: "sleek straight hair" },
  { id: "f3", name: "Curly Natural", category: "Curly", gender: "female", thumbnailEmoji: "🌀", prompt: "natural curly hair, defined curls" },
  { id: "f4", name: "Bob Cut", category: "Short", gender: "female", thumbnailEmoji: "💎", prompt: "classic bob haircut" },
  { id: "f5", name: "Pixie Cut", category: "Short", gender: "female", thumbnailEmoji: "⭐", prompt: "pixie cut hairstyle" },
  { id: "f6", name: "Lob (Long Bob)", category: "Medium", gender: "female", thumbnailEmoji: "🌿", prompt: "long bob lob hairstyle" },
  { id: "f7", name: "Layered Long", category: "Long", gender: "female", thumbnailEmoji: "🦋", prompt: "long layered hair" },
  { id: "f8", name: "Braids", category: "Braided", gender: "female", thumbnailEmoji: "🎀", prompt: "box braids hairstyle" },
  { id: "f9", name: "French Braid", category: "Braided", gender: "female", thumbnailEmoji: "👸", prompt: "french braid hairstyle" },
  { id: "f10", name: "Ponytail", category: "Updo", gender: "female", thumbnailEmoji: "🐴", prompt: "high ponytail hairstyle" },
  { id: "f11", name: "Bun Updo", category: "Updo", gender: "female", thumbnailEmoji: "🌸", prompt: "elegant bun updo" },
  { id: "f12", name: "Side Part", category: "Classic", gender: "female", thumbnailEmoji: "💫", prompt: "deep side part hair" },
  { id: "f13", name: "Korean Perm", category: "Korean", gender: "female", thumbnailEmoji: "🇰🇷", prompt: "Korean soft perm hairstyle", isNew: true },
  { id: "f14", name: "Bangs", category: "Modern", gender: "female", thumbnailEmoji: "✂️", prompt: "blunt bangs hairstyle", isTrending: true },
  { id: "f15", name: "Shag Cut", category: "Modern", gender: "female", thumbnailEmoji: "🎸", prompt: "shag haircut with layers" },
  { id: "f16", name: "Wolf Cut", category: "Modern", gender: "female", thumbnailEmoji: "🐺", prompt: "wolf cut hairstyle", isNew: true },
  { id: "f17", name: "Curtain Bangs", category: "Modern", gender: "female", thumbnailEmoji: "🎭", prompt: "curtain bangs hairstyle", isTrending: true },
  { id: "f18", name: "Wedding Updo", category: "Special", gender: "female", thumbnailEmoji: "👰", prompt: "elegant bridal updo" },
  { id: "f19", name: "Half Up Half", category: "Casual", gender: "female", thumbnailEmoji: "🌺", prompt: "half up half down hairstyle" },
  { id: "f20", name: "Twisted Locs", category: "Natural", gender: "female", thumbnailEmoji: "🌻", prompt: "twisted locs natural hairstyle" },
];

export const HAIR_COLORS = [
  { id: "c1", name: "Natural", hex: "#4A3728", emoji: "🟫" },
  { id: "c2", name: "Black", hex: "#1A1008", emoji: "⬛" },
  { id: "c3", name: "Brown", hex: "#6B4423", emoji: "🟤" },
  { id: "c4", name: "Blonde", hex: "#D4A017", emoji: "🟡" },
  { id: "c5", name: "Red", hex: "#C0392B", emoji: "🔴" },
  { id: "c6", name: "Silver", hex: "#BDC3C7", emoji: "⬜" },
  { id: "c7", name: "Purple", hex: "#7C4DFF", emoji: "🟣" },
  { id: "c8", name: "Blue", hex: "#00E5FF", emoji: "🔵" },
];

export const BEARD_STYLES = [
  { id: "b1", name: "Clean Shave", emoji: "🪒", prompt: "clean shaven face" },
  { id: "b2", name: "Stubble", emoji: "😎", prompt: "light stubble beard" },
  { id: "b3", name: "Short Beard", emoji: "🧔", prompt: "short neat beard" },
  { id: "b4", name: "Full Beard", emoji: "🪖", prompt: "full thick beard" },
  { id: "b5", name: "Goatee", emoji: "🎯", prompt: "goatee beard style" },
  { id: "b6", name: "Van Dyke", emoji: "🎭", prompt: "van dyke beard" },
];

export const CATEGORIES_MALE = ["All", "Fade", "Short", "Curly", "Korean", "Long", "Classic", "Modern", "Special"];
export const CATEGORIES_FEMALE = ["All", "Short", "Medium", "Wavy", "Curly", "Straight", "Korean", "Braided", "Updo", "Modern", "Special"];
