// Comprehensive directory of all family relationship roles and lineage classifications (Pure English)

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
    groupName: "Grandparents & Ancestors",
    icon: "👴",
    options: [
      { value: "Grandfather", label: "Grandfather", gender: "MALE", defaultEmoji: "👴" },
      { value: "Grandmother", label: "Grandmother", gender: "FEMALE", defaultEmoji: "👵" },
      { value: "Paternal Grandfather", label: "Paternal Grandfather (Father's Father)", gender: "MALE", defaultEmoji: "👴" },
      { value: "Paternal Grandmother", label: "Paternal Grandmother (Father's Mother)", gender: "FEMALE", defaultEmoji: "👵" },
      { value: "Maternal Grandfather", label: "Maternal Grandfather (Mother's Father)", gender: "MALE", defaultEmoji: "👴" },
      { value: "Maternal Grandmother", label: "Maternal Grandmother (Mother's Mother)", gender: "FEMALE", defaultEmoji: "👵" },
      { value: "Great-Grandfather", label: "Great-Grandfather", gender: "MALE", defaultEmoji: "👴" },
      { value: "Great-Grandmother", label: "Great-Grandmother", gender: "FEMALE", defaultEmoji: "👵" },
      { value: "Ancestor / Forefather", label: "Ancestor / Forefather", gender: "MALE", defaultEmoji: "🧓" },
    ],
  },
  {
    groupName: "Parents & Guardians",
    icon: "👨‍👩‍👧",
    options: [
      { value: "Father", label: "Father", gender: "MALE", defaultEmoji: "👨" },
      { value: "Mother", label: "Mother", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Stepfather", label: "Stepfather", gender: "MALE", defaultEmoji: "👨" },
      { value: "Stepmother", label: "Stepmother", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Adoptive Father", label: "Adoptive Father", gender: "MALE", defaultEmoji: "👨" },
      { value: "Adoptive Mother", label: "Adoptive Mother", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Foster Parent / Guardian", label: "Foster Parent / Guardian", gender: "MALE", defaultEmoji: "🧑" },
    ],
  },
  {
    groupName: "Spouses & Partners",
    icon: "💑",
    options: [
      { value: "Husband", label: "Husband", gender: "MALE", defaultEmoji: "👨" },
      { value: "Wife", label: "Wife", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Spouse", label: "Spouse / Partner", gender: "FEMALE", defaultEmoji: "🧑" },
      { value: "Fiancé / Fiancée", label: "Fiancé / Fiancée", gender: "FEMALE", defaultEmoji: "💍" },
      { value: "Ex-Spouse", label: "Ex-Spouse", gender: "FEMALE", defaultEmoji: "🧑" },
    ],
  },
  {
    groupName: "Children & Descendants",
    icon: "👶",
    options: [
      { value: "Son", label: "Son", gender: "MALE", defaultEmoji: "👦" },
      { value: "Daughter", label: "Daughter", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Stepson", label: "Stepson", gender: "MALE", defaultEmoji: "👦" },
      { value: "Stepdaughter", label: "Stepdaughter", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Adopted Son", label: "Adopted Son", gender: "MALE", defaultEmoji: "👦" },
      { value: "Adopted Daughter", label: "Adopted Daughter", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Grandson", label: "Grandson", gender: "MALE", defaultEmoji: "👦" },
      { value: "Granddaughter", label: "Granddaughter", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Grandchild", label: "Grandchild", gender: "MALE", defaultEmoji: "👶" },
      { value: "Great-Grandson", label: "Great-Grandson", gender: "MALE", defaultEmoji: "👶" },
      { value: "Great-Granddaughter", label: "Great-Granddaughter", gender: "FEMALE", defaultEmoji: "👶" },
    ],
  },
  {
    groupName: "Siblings",
    icon: "👫",
    options: [
      { value: "Brother", label: "Brother", gender: "MALE", defaultEmoji: "👦" },
      { value: "Sister", label: "Sister", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Elder Brother", label: "Elder Brother", gender: "MALE", defaultEmoji: "👨" },
      { value: "Younger Brother", label: "Younger Brother", gender: "MALE", defaultEmoji: "👦" },
      { value: "Elder Sister", label: "Elder Sister", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Younger Sister", label: "Younger Sister", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Stepbrother", label: "Stepbrother", gender: "MALE", defaultEmoji: "👦" },
      { value: "Stepsister", label: "Stepsister", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Half-Brother", label: "Half-Brother", gender: "MALE", defaultEmoji: "👦" },
      { value: "Half-Sister", label: "Half-Sister", gender: "FEMALE", defaultEmoji: "👧" },
    ],
  },
  {
    groupName: "Uncles & Aunts",
    icon: "🤝",
    options: [
      { value: "Uncle", label: "Uncle", gender: "MALE", defaultEmoji: "👨" },
      { value: "Aunt", label: "Aunt", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Paternal Uncle", label: "Paternal Uncle (Father's Brother)", gender: "MALE", defaultEmoji: "👨" },
      { value: "Paternal Aunt", label: "Paternal Aunt (Father's Sister)", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Maternal Uncle", label: "Maternal Uncle (Mother's Brother)", gender: "MALE", defaultEmoji: "👨" },
      { value: "Maternal Aunt", label: "Maternal Aunt (Mother's Sister)", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Great-Uncle", label: "Great-Uncle", gender: "MALE", defaultEmoji: "👴" },
      { value: "Great-Aunt", label: "Great-Aunt", gender: "FEMALE", defaultEmoji: "👵" },
    ],
  },
  {
    groupName: "Nieces, Nephews & Cousins",
    icon: "🧒",
    options: [
      { value: "Nephew", label: "Nephew", gender: "MALE", defaultEmoji: "👦" },
      { value: "Niece", label: "Niece", gender: "FEMALE", defaultEmoji: "👧" },
      { value: "Cousin", label: "Cousin", gender: "MALE", defaultEmoji: "🧑" },
      { value: "Paternal Cousin", label: "Paternal Cousin", gender: "MALE", defaultEmoji: "🧑" },
      { value: "Maternal Cousin", label: "Maternal Cousin", gender: "FEMALE", defaultEmoji: "🧑" },
      { value: "Second Cousin", label: "Second Cousin", gender: "MALE", defaultEmoji: "🧑" },
    ],
  },
  {
    groupName: "In-Laws",
    icon: "💍",
    options: [
      { value: "Father-in-Law", label: "Father-in-Law", gender: "MALE", defaultEmoji: "👴" },
      { value: "Mother-in-Law", label: "Mother-in-Law", gender: "FEMALE", defaultEmoji: "👵" },
      { value: "Son-in-Law", label: "Son-in-Law", gender: "MALE", defaultEmoji: "👨" },
      { value: "Daughter-in-Law", label: "Daughter-in-Law", gender: "FEMALE", defaultEmoji: "👩" },
      { value: "Brother-in-Law", label: "Brother-in-Law", gender: "MALE", defaultEmoji: "👨" },
      { value: "Sister-in-Law", label: "Sister-in-Law", gender: "FEMALE", defaultEmoji: "👩" },
    ],
  },
  {
    groupName: "Other Relatives & Family",
    icon: "🌐",
    options: [
      { value: "Family Elder", label: "Family Elder", gender: "MALE", defaultEmoji: "🧓" },
      { value: "Relative", label: "Relative (General)", gender: "MALE", defaultEmoji: "🧑" },
      { value: "Distant Relative", label: "Distant Relative", gender: "MALE", defaultEmoji: "🧑" },
      { value: "Godparent", label: "Godparent", gender: "MALE", defaultEmoji: "🧑" },
      { value: "Godchild", label: "Godchild", gender: "MALE", defaultEmoji: "👶" },
      { value: "Family Friend", label: "Family Friend", gender: "MALE", defaultEmoji: "🧑" },
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
