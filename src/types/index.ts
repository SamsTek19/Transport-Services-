export interface Booking {
  id?: string;
  name: string;
  email: string;
  phone: string;
  pickup_address: string;
  dropoff_address: string;
  pickup_date: string;
  pickup_time: string;
  passengers: number;
  wheelchair_accessible: boolean;
  round_trip: boolean;
  special_requests?: string;
  status?: string;
  created_at?: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}
