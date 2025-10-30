export interface SeriesItem {
  id: string;
  name: string;
  image?: string;
}

export interface SeriesNavigationLink {
  sectionId: string;
  label: string;
  href: string;
}

export interface SeriesFilterConfig {
  title: string;
  breadcrumbCategory: string;
  breadcrumbSection: string;
  navigationLinks: SeriesNavigationLink[];
  series: SeriesItem[];
}


