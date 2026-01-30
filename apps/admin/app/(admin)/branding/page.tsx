import ThemeEditor from "@/components/admin/ThemeEditor";
import LandingEditor from "@/components/admin/LandingEditor";
import SocialLinksEditor from "@/components/admin/SocialLinksEditor";

export default function BrandingPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Personalización</h1>
        <p className="text-gray-600">Configura la identidad visual y el contenido de tu espacio.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ThemeEditor />
        <LandingEditor />
        <SocialLinksEditor />
      </div>
    </div>
  );
}
