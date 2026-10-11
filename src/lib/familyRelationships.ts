// Comprehensive directory of all family relationship roles and lineage classifications

export interface RelationshipItem {
  value: string;
  label: string;
  gender: "MALE" | "FEMALE";
  defaultEmoji: string;
}

export interface RelationshipGroup {
  groupName: string;
  icon: string;
  options: RelationshipItem[];
}

export const ALL_FAMILY_RELATIONSHIPS: RelationshipGroup[] = [
  {
    groupName: "Grandparents & Ancestors (দাদা-দাদী, নানা-নানী ও পূর্বপুরুষ)",
    icon: "👴",
    options: [
      { value: "Grandfather", label: "Grandfather (দাদা / নানা)", gender: "MALE", defaultEmoji: "👴" },
      { value: "Grandmother", label: "Grandmother (দাদী / নানী)", gender: "FEMALE", defaultEmoji: "👵" },
      { value: "Paternal Grandfather", label: "Paternal Grandfather (দাদা)", gender: "MALE", defaultEmoji: "👴" },
      { value: "Paternal Grandmother", label: "Paternal Grandmother (দাদী)", gender: "FEMALE", defaultEmoji: "👵" },
      { value: "Maternal Grandfather", label: "Maternal Grandfather (নানা)", gender: "MALE", defaultEmoji: "👴" },
      { value: "Maternal Grandmother", label: "Maternal Grandmother (নানী)", gender: "FEMALE", defaultEmoji: "👵" },
      { value: "Great-Grandfather", label: "Great-Grandfather (পড়দাদা / পড়নানা)", gender: "MALE", defaultEmoji: "👴" },
      { value: "Great-Grandmother", label: "Great-Grandmother (পড়দাদী / পড়নানী)", gender: "FEMALE", defaultEmoji: "👵" },
      { value: "Ancestor / Forefather", label: "Ancestor / Forefather (পূর্বপুরুষ)", gender: "MALE", defaultEmoji: "🧓" },
    ],
  },
  {
    groupName: "Parents & Guardians (পিতা-মাতা ও অভিভাবক)",
    icon: "👨‍👩‍👧",
    options: [
      { value: "Father", label: "Father (বাবা / পিতা)", gender: "MALE", defaultEmoji: "👨" },
      { value: "Mother", label: "Mother (মা / মাতা)", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Stepfather", label: "Stepfather (সৎ বাবা)", gender: "MALE", defaultEmoji: "👨" },
      { value: "Stepmother", label: "Stepmother (সৎ মা)", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Adoptive Father", label: "Adoptive Father (দত্তক পিতা)", gender: "MALE", defaultEmoji: "👨" },
      { value: "Adoptive Mother", label: "Adoptive Mother (দত্তক মাতা)", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Foster Parent / Guardian", label: "Foster Parent / Guardian (অভিভাবক)", gender: "MALE", defaultEmoji: "🧑" },
    ],
  },
  {
    groupName: "Spouses & Partners (স্বামী-স্ত্রী ও জীবনসঙ্গী)",
    icon: "💑",
    options: [
      { value: "Husband", label: "Husband (স্বামী)", gender: "MALE", defaultEmoji: "👨" },
      { value: "Wife", label: "Wife (স্ত্রী)", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Spouse", label: "Spouse / Partner (জীবনসঙ্গী)", gender: "FEMALE", defaultEmoji: "🧑" },
      { value: "Fiancé / Fiancée", label: "Fiancé / Fiancée (হবু স্বামী/স্ত্রী)", gender: "FEMALE", defaultEmoji: "💍" },
      { value: "Ex-Spouse", label: "Ex-Spouse (সাবেক স্বামী/স্ত্রী)", gender: "FEMALE", defaultEmoji: "🧑" },
    ],
  },
  {
    groupName: "Children & Descendants (সন্তান, নাতি-নাতনী ও বংশধর)",
    icon: "👶",
    options: [
      { value: "Son", label: "Son (ছেলে / পুত্র)", gender: "MALE", defaultEmoji: "👦" },
      { value: "Daughter", label: "Daughter (মেয়ে / কন্যা)", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Stepson", label: "Stepson (সৎ ছেলে)", gender: "MALE", defaultEmoji: "👦" },
      { value: "Stepdaughter", label: "Stepdaughter (সৎ মেয়ে)", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Adopted Son", label: "Adopted Son (দত্তক পুত্র)", gender: "MALE", defaultEmoji: "👦" },
      { value: "Adopted Daughter", label: "Adopted Daughter (দত্তক কন্যা)", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Grandson", label: "Grandson (নাতি)", gender: "MALE", defaultEmoji: "👦" },
      { value: "Granddaughter", label: "Granddaughter (নাতনী)", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Grandchild", label: "Grandchild (নাতি-নাতনী)", gender: "MALE", defaultEmoji: "👶" },
      { value: "Great-Grandson", label: "Great-Grandson (পুতি)", gender: "MALE", defaultEmoji: "👶" },
      { value: "Great-Granddaughter", label: "Great-Granddaughter (পুতনী)", gender: "FEMALE", defaultEmoji: "👶" },
    ],
  },
  {
    groupName: "Siblings (ভাই-বোন)",
    icon: "👫",
    options: [
      { value: "Brother", label: "Brother (ভাই)", gender: "MALE", defaultEmoji: "👦" },
      { value: "Sister", label: "Sister (বোন)", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Elder Brother", label: "Elder Brother (বড় ভাই)", gender: "MALE", defaultEmoji: "👨" },
      { value: "Younger Brother", label: "Younger Brother (ছোট ভাই)", gender: "MALE", defaultEmoji: "👦" },
      { value: "Elder Sister", label: "Elder Sister (বড় বোন)", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Younger Sister", label: "Younger Sister (ছোট বোন)", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Stepbrother", label: "Stepbrother (সৎ ভাই)", gender: "MALE", defaultEmoji: "👦" },
      { value: "Stepsister", label: "Stepsister (সৎ বোন)", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Half-Brother", label: "Half-Brother (বৈমাত্রেয় ভাই)", gender: "MALE", defaultEmoji: "👦" },
      { value: "Half-Sister", label: "Half-Sister (বৈমাত্রেয় বোন)", gender: "FEMALE", defaultEmoji: "👧" },
    ],
  },
  {
    groupName: "Uncles & Aunts (চাচা, মামা, খালা ও ফুফু)",
    icon: "🤝",
    options: [
      { value: "Uncle", label: "Uncle (চাচা / মামা / খালু / ফুফা)", gender: "MALE", defaultEmoji: "👨" },
      { value: "Aunt", label: "Aunt (চাচী / মামী / খালা / ফুফু)", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Paternal Uncle", label: "Paternal Uncle (চাচা / জেঠা)", gender: "MALE", defaultEmoji: "👨" },
      { value: "Paternal Aunt", label: "Paternal Aunt (ফুফু)", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Maternal Uncle", label: "Maternal Uncle (মামা)", gender: "MALE", defaultEmoji: "👨" },
      { value: "Maternal Aunt", label: "Maternal Aunt (খালা)", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Great-Uncle", label: "Great-Uncle (দাদাতো/নানাতো চাচা)", gender: "MALE", defaultEmoji: "👴" },
      { value: "Great-Aunt", label: "Great-Aunt (দাদাতো/নানাতো খালা/ফুফু)", gender: "FEMALE", defaultEmoji: "👵" },
    ],
  },
  {
    groupName: "Nieces, Nephews & Cousins (ভাগ্নে, ভাগ্নী, ভাতিজা ও কাজিন)",
    icon: "🧒",
    options: [
      { value: "Nephew", label: "Nephew (ভাতিজা / ভাগ্নে)", gender: "MALE", defaultEmoji: "👦" },
      { value: "Niece", label: "Niece (ভাতিজী / ভাগ্নী)", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Cousin", label: "Cousin (কাজিন / ভাই-বোন)", gender: "MALE", defaultEmoji: "🧑" },
      { value: "Paternal Cousin", label: "Paternal Cousin (চাচাতো / ফুফাতো ভাই-বোন)", gender: "MALE", defaultEmoji: "🧑" },
      { value: "Maternal Cousin", label: "Maternal Cousin (মামাতো / খালাতো ভাই-বোন)", gender: "FEMALE", defaultEmoji: "🧑" },
      { value: "Second Cousin", label: "Second Cousin (দূর সম্পর্কের কাজিন)", gender: "MALE", defaultEmoji: "🧑" },
    ],
  },
  {
    groupName: "In-Laws (বৈবাহিক আত্মীয় / শ্বশুরবাড়ি)",
    icon: "💍",
    options: [
      { value: "Father-in-Law", label: "Father-in-Law (শ্বশুর)", gender: "MALE", defaultEmoji: "👴" },
      { value: "Mother-in-Law", label: "Mother-in-Law (শাশুড়ী)", gender: "FEMALE", defaultEmoji: "👵" },
      { value: "Son-in-Law", label: "Son-in-Law (জামাই / জামাতা)", gender: "MALE", defaultEmoji: "👨" },
      { value: "Daughter-in-Law", label: "Daughter-in-Law (পুত্রবধূ / বৌমা)", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Brother-in-Law", label: "Brother-in-Law (শ্যালক / দেবর / ভাসুর / ভগ্নিপতি)", gender: "MALE", defaultEmoji: "👨" },
      { value: "Sister-in-Law", label: "Sister-in-Law (শ্যালিকা / ননদ / জা / ভাবী)", gender: "FEMALE", defaultEmoji: "👩" },
    ],
  },
  {
    groupName: "Other Relatives & Family (অন্যান্য আত্মীয়)",
    icon: "🌐",
    options: [
      { value: "Family Elder", label: "Family Elder (পরিবারের মুরুব্বি / প্রবীণ)", gender: "MALE", defaultEmoji: "🧓" },
      { value: "Relative", label: "Relative (সাধারণ আত্মীয়)", gender: "MALE", defaultEmoji: "🧑" },
      { value: "Distant Relative", label: "Distant Relative (দূর সম্পর্কের আত্মীয়)", gender: "MALE", defaultEmoji: "🧑" },
      { value: "Godparent", label: "Godparent (ধর্মপিতা / ধর্মমাতা)", gender: "MALE", defaultEmoji: "🧑" },
      { value: "Godchild", label: "Godchild (ধর্মসন্তান)", gender: "MALE", defaultEmoji: "👶" },
      { value: "Family Friend", label: "Family Friend (পারিবারিক বন্ধু)", gender: "MALE", defaultEmoji: "🧑" },
    ],
  },
];

// Flat lookup map by value
export const RELATIONSHIP_BY_VALUE = new Map<string, RelationshipItem>();
ALL_FAMILY_RELATIONSHIPS.forEach((grp) => {
  grp.options.forEach((opt) => {
    RELATIONSHIP_BY_VALUE.set(opt.value, opt);
  });
});

export function getRelationshipMeta(roleValue: string): { gender: "MALE" | "FEMALE"; emoji: string } {
  const found = RELATIONSHIP_BY_VALUE.get(roleValue);
  if (found) {
    return { gender: found.gender, emoji: found.defaultEmoji };
  }

  // Fallback heuristics
  const lower = roleValue.toLowerCase();
  if (
    lower.includes("mother") ||
    lower.includes("grandmother") ||
    lower.includes("wife") ||
    lower.includes("daughter") ||
    lower.includes("sister") ||
    lower.includes("aunt") ||
    lower.includes("niece")
  ) {
    return {
      gender: "FEMALE",
      emoji: lower.includes("grand") ? "👵" : lower.includes("daughter") || lower.includes("young") ? "👧" : "👩",
    };
  }

  if (
    lower.includes("father") ||
    lower.includes("grandfather") ||
    lower.includes("husband") ||
    lower.includes("son") ||
    lower.includes("brother") ||
    lower.includes("uncle") ||
    lower.includes("nephew")
  ) {
    return {
      gender: "MALE",
      emoji: lower.includes("grand") ? "👴" : lower.includes("son") || lower.includes("young") ? "👦" : "👨",
    };
  }

  return { gender: "MALE", emoji: "🧑" };
}
