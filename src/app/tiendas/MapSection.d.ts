export interface MapSectionProps {
  city: string;
  stores: Array<{
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    city: string;
    position: [number, number];
  }>;
}
