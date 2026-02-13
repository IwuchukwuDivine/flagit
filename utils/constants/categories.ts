export const CATEGORY_VALUES = [
  "roads",
  "water",
  "electricity",
  "sanitation",
  "health care",
  "education",
  "transportation",
  "public services",
  "other",
] as const;

export type CategoryValue = (typeof CATEGORY_VALUES)[number];

export const CATEGORIES: { value: CategoryValue; label: string }[] = [
  { value: "roads", label: "Roads & Bridges" },
  { value: "water", label: "Water Supply" },
  { value: "electricity", label: "Street Lighting" },
  { value: "sanitation", label: "Sanitation" },
  { value: "health care", label: "Health Care" },
  { value: "education", label: "Education" },
  { value: "transportation", label: "Transportation" },
  { value: "public services", label: "Public Services" },
  { value: "other", label: "Other" },
];
