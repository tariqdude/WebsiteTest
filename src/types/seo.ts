export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  author?: string;
  keywords?: string[];
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface OpenGraphProps {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'website' | 'article' | 'product' | 'profile';
  siteName?: string;
  locale?: string;
}

export interface TwitterCardProps {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  image: string;
  creator?: string;
  site?: string;
}

export interface StructuredDataProps {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  image?: string;
  sameAs?: string[];
}
