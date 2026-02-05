export type Theme = {
  brandColor: string;
  textColor: string;
  logoUrl: string;
  radius: string;
  font: string;
};

export const defaultTheme: Theme = {
  brandColor: "#00E074", // Cyberpunk Neon Green
  textColor: "#FFFFFF", // White text
  logoUrl: "/placeholder.svg",
  radius: "0.5rem", // rounded-md
  font: "sans-serif",
};
