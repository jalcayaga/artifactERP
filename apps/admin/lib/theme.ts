export type Theme = {
  brandColor: string;
  textColor: string;
  logoUrl: string;
  secondaryLogoUrl: string;
  radius: string;
  font: string;
};

export const defaultTheme: Theme = {
  brandColor: "#6366F1", // Indigo 500
  textColor: "#1F2937", // Gray 800
  logoUrl: "/logo-panel-matched.png",
  secondaryLogoUrl: "/logo-rail-matched.png",
  radius: "0.5rem", // rounded-md
  font: "sans-serif",
};
