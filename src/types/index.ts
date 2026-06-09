export interface HeroData {
  edition: string;
  date: string;
  logo: string;
  slogan: string;
  video: {
    type: 'local' | 'youtube' | 'vimeo';
    src: string;
  };
}

export interface CountdownData {
  title: string;
  slogan: string;
  location: string;
  date: string;
  distance: string;
  targetDate: string;
  cta: string;
}

export interface CompetitionData {
  history: string;
  description: string;
  objectives: string[];
  routeFeatures: string[];
  videoUrl: string;
}

export interface DetailsData {
  route: {
    image: string;
    mapUrl: string;
  };
  altimetry: {
    image: string;
    resourceUrl: string;
  };
}

export interface ArticlesData {
  photos: {
    image: string;
    description: string;
    galleryUrl: string;
  };
  shop: {
    image: string;
    description: string;
    shopUrl: string;
  };
}

export interface RegistrationData {
  title: string;
  description: string;
  minMembers: number;
  maxMembers: number;
  types: { id: string; name: string; price: number }[];
  categories: string[];
  sizes: string[];
  genders: string[];
  bank: {
    name: string;
    accountHolder: string;
    accountNumber: string;
    accountType: string;
    identification: string;
    concept: string;
  };
}

export interface Sponsor {
  name: string;
  image: string;
}

export interface SponsorsData {
  title: string;
  main: Sponsor[];
  sponsors: Sponsor[];
  allies: Sponsor[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface SocialData {
  links: SocialLink[];
}

export interface ContactData {
  title: string;
  email: string;
  phone: string;
  address: string;
}

export interface FooterData {
  logo: string;
  name: string;
  edition: string;
  slogan: string;
  whatsapp: string;
  copyright: string;
}
