export type Theme = {
  brandColor: string;
  textColor: string;
  logoUrl: string;
  radius: string;
  font: string;
};

export const defaultTheme: Theme = {
  brandColor: "#6366F1", // Indigo 500
  textColor: "#1F2937", // Gray 800
  logoUrl: "/placeholder.svg",
  radius: "0.5rem", // rounded-md
  font: "sans-serif",
};
