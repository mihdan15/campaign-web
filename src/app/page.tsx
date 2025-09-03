import CampaignFilter from "@/components/CampaignFilter";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      {/* BG layer fixed: tidak ikut scroll, di belakang konten */}
      <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-pink-200 blur-3xl opacity-40 animate-float" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-200 blur-3xl opacity-40 animate-float" />
      </div>
      <CampaignFilter />
    </div>
  );
}
