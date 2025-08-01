// servicesInfo.ts
export type DataPlan = {
    id: number;
    name: string;
    price: number;
  };
  
  export type DataPlans = {
    [key: string]: DataPlan[]; // Allows dynamic indexing by string keys
  };
  
  export const dataPlans: DataPlans = {
    MTN: [
      { id: 1, name: '1GB', price: 300 },
      { id: 2, name: '2GB', price: 600 },
      { id: 6, name: '3GB', price: 900 },
      { id: 7, name: '4GB', price: 1200 },
      { id: 3, name: '5GB', price: 1500 },
      { id: 8, name: '10GB', price: 3000 },
      { id: 9, name: '15GB', price: 4200 },
      { id: 10, name: '20GB', price: 5600 },
    ],
    AIRTEL: [
      { id: 24, name: '1GB', price: 350 },
      { id: 25, name: '2GB', price: 700 },
      { id: 26, name: '5GB', price: 1700 },
      { id: 27, name: '10GB', price: 3500 },
      { id: 28, name: '15GB', price: 4500 },
      { id: 29, name: '20GB', price: 6000 },
    ],
    GLO: [
      { id: 17, name: '1GB', price: 350 },
      { id: 11, name: '2GB', price: 700 },
      { id: 31, name: '3GB', price: 1050 },
      { id: 32, name: '5GB', price: 1600 },
      { id: 33, name: '10GB', price: 3000 },
    ],
    '9 MOBILE': [
      { id: 18, name: '1.5GB', price: 850 },
      { id: 21, name: '4.5GB', price: 1700 },
      { id: 22, name: '11GB', price: 3400 },
      { id: 23, name: '15GB', price: 4400 },
    ],
  };
  