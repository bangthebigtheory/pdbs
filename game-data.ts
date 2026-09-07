export type TransportType = 'taxi' | 'bus' | 'metro';

export interface Connection {
  to: string;
  type: TransportType;
}

export interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  connections: Connection[];
}

export const MAP_LOCATIONS: Record<string, Location> = {
  Majestic: {
    id: 'Majestic',
    name: 'Majestic',
    x: 400,
    y: 400,
    connections: [
      { to: 'Malleshwaram', type: 'taxi' },
      { to: 'Cubbon Park', type: 'taxi' },
      { to: 'MG Road', type: 'taxi' },
      { to: 'Hebbal', type: 'bus' },
      { to: 'Jayanagar', type: 'bus' },
      { to: 'MG Road', type: 'metro' },
      { to: 'Jayanagar', type: 'metro' },
    ],
  },
  'MG Road': {
    id: 'MG Road',
    name: 'MG Road',
    x: 550,
    y: 450,
    connections: [
      { to: 'Cubbon Park', type: 'taxi' },
      { to: 'Indiranagar', type: 'taxi' },
      { to: 'Majestic', type: 'taxi' },
      { to: 'Koramangala', type: 'bus' },
      { to: 'Majestic', type: 'metro' },
      { to: 'Indiranagar', type: 'metro' },
      { to: 'KR Puram', type: 'metro' },
    ],
  },
  'Cubbon Park': {
    id: 'Cubbon Park',
    name: 'Cubbon Park',
    x: 500,
    y: 400,
    connections: [
      { to: 'Majestic', type: 'taxi' },
      { to: 'MG Road', type: 'taxi' },
      { to: 'Malleshwaram', type: 'bus' },
    ],
  },
  Indiranagar: {
    id: 'Indiranagar',
    name: 'Indiranagar',
    x: 700,
    y: 450,
    connections: [
      { to: 'MG Road', type: 'taxi' },
      { to: 'Koramangala', type: 'taxi' },
      { to: 'KR Puram', type: 'bus' },
      { to: 'MG Road', type: 'metro' },
      { to: 'Whitefield', type: 'metro' },
    ],
  },
  Koramangala: {
    id: 'Koramangala',
    name: 'Koramangala',
    x: 650,
    y: 600,
    connections: [
      { to: 'Indiranagar', type: 'taxi' },
      { to: 'Silk Board', type: 'taxi' },
      { to: 'MG Road', type: 'bus' },
      { to: 'Jayanagar', type: 'bus' },
    ],
  },
  Jayanagar: {
    id: 'Jayanagar',
    name: 'Jayanagar',
    x: 450,
    y: 650,
    connections: [
      { to: 'Banashankari', type: 'taxi' },
      { to: 'Koramangala', type: 'taxi' },
      { to: 'Majestic', type: 'bus' },
      { to: 'Silk Board', type: 'bus' },
      { to: 'Majestic', type: 'metro' },
    ],
  },
  Banashankari: {
    id: 'Banashankari',
    name: 'Banashankari',
    x: 350,
    y: 750,
    connections: [
      { to: 'Jayanagar', type: 'taxi' },
      { to: 'Silk Board', type: 'taxi' },
      { to: 'Electronic City', type: 'bus' },
    ],
  },
  'Silk Board': {
    id: 'Silk Board',
    name: 'Silk Board',
    x: 650,
    y: 750,
    connections: [
      { to: 'Koramangala', type: 'taxi' },
      { to: 'Banashankari', type: 'taxi' },
      { to: 'Electronic City', type: 'taxi' },
      { to: 'Jayanagar', type: 'bus' },
      { to: 'KR Puram', type: 'bus' },
    ],
  },
  'Electronic City': {
    id: 'Electronic City',
    name: 'Electronic City',
    x: 800,
    y: 850,
    connections: [
      { to: 'Silk Board', type: 'taxi' },
      { to: 'Banashankari', type: 'bus' },
      { to: 'Whitefield', type: 'bus' },
    ],
  },
  'KR Puram': {
    id: 'KR Puram',
    name: 'KR Puram',
    x: 850,
    y: 400,
    connections: [
      { to: 'Whitefield', type: 'taxi' },
      { to: 'Hebbal', type: 'taxi' },
      { to: 'Silk Board', type: 'bus' },
      { to: 'Indiranagar', type: 'bus' },
      { to: 'MG Road', type: 'metro' },
    ],
  },
  Whitefield: {
    id: 'Whitefield',
    name: 'Whitefield',
    x: 950,
    y: 500,
    connections: [
      { to: 'KR Puram', type: 'taxi' },
      { to: 'Electronic City', type: 'bus' },
      { to: 'Indiranagar', type: 'metro' },
    ],
  },
  Hebbal: {
    id: 'Hebbal',
    name: 'Hebbal',
    x: 450,
    y: 200,
    connections: [
      { to: 'KR Puram', type: 'taxi' },
      { to: 'Yelahanka', type: 'taxi' },
      { to: 'Majestic', type: 'bus' },
      { to: 'Malleshwaram', type: 'bus' },
      { to: 'Airport', type: 'bus' },
    ],
  },
  Yelahanka: {
    id: 'Yelahanka',
    name: 'Yelahanka',
    x: 500,
    y: 100,
    connections: [
      { to: 'Hebbal', type: 'taxi' },
      { to: 'Airport', type: 'taxi' },
      { to: 'Malleshwaram', type: 'bus' },
    ],
  },
  Airport: {
    id: 'Airport',
    name: 'Airport',
    x: 700,
    y: 50,
    connections: [
      { to: 'Yelahanka', type: 'taxi' },
      { to: 'Hebbal', type: 'bus' },
    ],
  },
  Malleshwaram: {
    id: 'Malleshwaram',
    name: 'Malleshwaram',
    x: 350,
    y: 300,
    connections: [
      { to: 'Majestic', type: 'taxi' },
      { to: 'Hebbal', type: 'taxi' },
      { to: 'Cubbon Park', type: 'bus' },
      { to: 'Yelahanka', type: 'bus' },
    ],
  },
};

export const TRANSPORT_COSTS = {
  taxi: 200,
  bus: 300,
  metro: 500,
};

export const REVEAL_ROUNDS = [4, 8, 12, 16, 20];
