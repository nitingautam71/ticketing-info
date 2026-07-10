export interface TrainClass {
  name: string;
  price: number;
}

export interface Train {
  id: string;
  operator: string;
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  classes: TrainClass[];
}

export interface TrainSearchParams {
  from: string;
  to: string;
}

interface TrainProvider {
  search(params: TrainSearchParams): Promise<Train[]>;
}

class MockTrainProvider implements TrainProvider {
  async search({ from, to }: TrainSearchParams): Promise<Train[]> {
    const fromName = from || 'Paris';
    const toName = to || 'London';
    return [
      {
        id: 'TR-301',
        operator: 'Eurostar',
        trainNumber: 'EST9012',
        departureStation: `${fromName} Gare du Nord`,
        arrivalStation: `${toName} St Pancras Intl`,
        departureTime: '08:15 AM',
        arrivalTime: '10:35 AM',
        duration: '2h 20m',
        price: 89,
        classes: [
          { name: 'Standard', price: 89 },
          { name: 'Standard Premier', price: 149 },
          { name: 'Business Premier', price: 289 },
        ],
      },
      {
        id: 'TR-302',
        operator: 'Eurostar',
        trainNumber: 'EST9054',
        departureStation: `${fromName} Gare du Nord`,
        arrivalStation: `${toName} St Pancras Intl`,
        departureTime: '01:45 PM',
        arrivalTime: '04:05 PM',
        duration: '2h 20m',
        price: 115,
        classes: [
          { name: 'Standard', price: 115 },
          { name: 'Standard Premier', price: 175 },
          { name: 'Business Premier', price: 320 },
        ],
      },
    ];
  }
}

export const trainProvider: TrainProvider = new MockTrainProvider();

export async function searchTrains(params: TrainSearchParams): Promise<Train[]> {
  return trainProvider.search(params);
}
