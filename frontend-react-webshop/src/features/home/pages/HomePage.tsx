import { FeatureHighlights } from '../components/FeatureHighlights';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { PromoBanners } from '../components/PromoBanners';
import { HomeCategories } from '../components/HomeCategories';

export function HomePage() {
  return (
    <div style={{ paddingTop: 16 }}>
      {/* Hero section: sidebar + banner */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', marginBottom: 24 }}>
        <HomeCategories />
        <PromoBanners />
      </div>

      <FeatureHighlights />
      <FeaturedProducts />
    </div>
  );
}
