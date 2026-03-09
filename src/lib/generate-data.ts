// Helper function to generate dates
function dateOffset(days: number, baseDate = new Date()): string {
  const date = new Date(baseDate);
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

// Generate 30 vehicles
const vehicleModels = [
  'Tata Prima 4028.S', 'Tata Prima 4928.S', 'Tata LPT 3118', 'Tata Signa 4018', 'Tata Ultra 1918',
  'Ashok Leyland 3518', 'Ashok Leyland 4020', 'Ashok Leyland 2518', 'Ashok Leyland 4920',
  'BharatBenz 3523R', 'BharatBenz 3528R', 'BharatBenz 2823R', 'BharatBenz 2828R',
  'Eicher Pro 6031', 'Eicher Pro 6035', 'Eicher Pro 2055', 'Eicher Pro 2095', 'Eicher Pro 2114',
  'Mahindra Blazo X 35', 'Mahindra Blazo X 28', 'Mahindra Blazo X 40', 'Mahindra Supro Profit Truck',
  'Volvo FMX 480', 'Volvo FMX 500', 'Scania P410', 'Scania P450', 'Scania G450'
];

const states = ['TN', 'KA', 'MH', 'KL', 'AP', 'TS', 'GJ', 'UP'];
const cities = ['Chennai', 'Bangalore', 'Mumbai', 'Hyderabad', 'Kochi', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Pune', 'Delhi', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kolkata'];

const generateVehicles = () => {
  const vehicles = [];
  for (let i = 1; i <= 30; i++) {
    const state = states[Math.floor(Math.random() * states.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const year = 2020 + Math.floor(Math.random() * 5);
    vehicles.push({
      id: i,
      regNo: `${state} ${String(Math.floor(Math.random() * 100)).padStart(2, '0')} ${['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP', 'QR', 'ST', 'UV', 'WX', 'YZ'][Math.floor(Math.random() * 13)]} ${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      model: vehicleModels[Math.floor(Math.random() * vehicleModels.length)],
      chassis: `MAT${Math.random().toString(36).substring(2, 14).toUpperCase()}`,
      engine: `${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.random().toString(36).substring(2, 10).toUpperCase()}${Math.floor(Math.random() * 99999)}`,
      driver: '',
      driverId: i <= 25 ? i : undefined,
      gpsId: `GPS-${String(i).padStart(3, '0')}`,
      fuelCard: `FC-${year}-${String(i).padStart(3, '0')}`,
      fastagId: `FT-${state}-${String(i).padStart(3, '0')}`,
      status: i <= 25 ? 'active' : 'inactive',
      kmReading: Math.floor(Math.random() * 200000),
      fuelLevel: Math.floor(Math.random() * 80) + 20,
      photo: '',
      documents: [
        { name: 'RC', expiry: dateOffset(Math.random() * 365 * 3 + 30), status: 'ok' },
        { name: 'FC', expiry: dateOffset(Math.random() * 365 * 2 + 30), status: Math.random() > 0.3 ? 'ok' : (Math.random() > 0.5 ? 'expired' : 'due') },
        { name: 'Insurance', expiry: dateOffset(Math.random() * 365 * 2 + 30), status: Math.random() > 0.3 ? 'ok' : (Math.random() > 0.5 ? 'expired' : 'due') },
        { name: 'Permit', expiry: dateOffset(Math.random() * 365 * 3 + 60), status: 'ok' },
        { name: 'National Permit', expiry: dateOffset(Math.random() * 365 * 2 + 60), status: 'ok' },
        { name: 'Road Tax', expiry: dateOffset(365), status: 'ok' },
        { name: 'PUC', expiry: dateOffset(Math.random() * 365 + 30), status: Math.random() > 0.3 ? 'ok' : (Math.random() > 0.5 ? 'expired' : 'due') },
      ],
      lastService: dateOffset(Math.floor(Math.random() * 90)),
      nextService: `${Math.floor(Math.random() * 200000) + 50000} KM`,
      location: `${city}, ${state === 'TN' ? 'Tamil Nadu' : state === 'KA' ? 'Karnataka' : state === 'MH' ? 'Maharashtra' : state === 'KL' ? 'Kerala' : state === 'AP' ? 'Andhra Pradesh' : state === 'TS' ? 'Telangana' : state === 'GJ' ? 'Gujarat' : state === 'UP' ? 'Uttar Pradesh' : 'West Bengal'}`,
      purchaseDate: `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    });
  }
  return vehicles;
};

// Generate 30 drivers
const driverNames = [
  'Rajan Kumar', 'Suresh Babu', 'Murugan S', 'Vijay R', 'Karthik M', 'Selvam P',
  'Mohan Raj', 'Krishnan K', 'Balu A', 'Siva P', 'Ramesh N', 'Prakash S',
  'Manikandan', 'Sathish Kumar', 'Deepak R', 'Naveen T', 'Vikram S',
  'Aravind K', 'Karthikeyan M', 'Sundar P', 'Raghu R', 'Muthu K',
  'Anand R', 'Praveen S', 'Srinivasan', 'Venkat R', 'Shankar K',
  'Dinesh M', 'Harish R', 'Kumaravel M'
];

const generateDrivers = () => {
  const drivers = [];
  for (let i = 1; i <= 30; i++) {
    const year = 2019 + Math.floor(Math.random() * 6);
    drivers.push({
      id: i,
      name: driverNames[i - 1],
      empId: `EMP-${String(i).padStart(3, '0')}`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      license: `TN${String(Math.floor(Math.random() * 100)).padStart(2, '0')}20${String(2020 + Math.floor(Math.random() * 6)).toString().slice(2, 4)}${String(Math.random().toString(36).substring(2, 7)).toUpperCase()}`,
      licenseExpiry: dateOffset(Math.random() * 730 + 30),
      insurance: ['HDFC', 'ICICI', 'SBI', 'LIC', 'BAJAJ', 'STAR', 'KOTAK', 'AXIS'][Math.floor(Math.random() * 8)] + '-DRV-' + String(i).padStart(3, '0'),
      insuranceExpiry: dateOffset(Math.random() * 365 * 2 + 60),
      status: i <= 25 ? 'active' : 'inactive',
      vehicle: i <= 25 ? '' : '',
      vehicleId: i <= 25 ? i : undefined,
      joinDate: `${year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      address: `${Math.floor(Math.random() * 200)}, ${['Anna Nagar', 'RS Puram', 'T. Nagar', 'Gandhipuram', 'Besant Nagar', 'Mylapore', 'Adyar', 'Kodambakkam', 'Velachery', 'Omr'][Math.floor(Math.random() * 10)]}, ${cities[Math.floor(Math.random() * cities.length)]} - ${Math.floor(Math.random() * 900000)}`,
      photo: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80`,
      trips: Math.floor(Math.random() * 500) + 50,
      kmDriven: Math.floor(Math.random() * 200000) + 20000,
      fuelEfficiency: (Math.random() * 2.5 + 3.5).toFixed(1),
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
      violations: Math.floor(Math.random() * 5),
      lastTrip: dateOffset(Math.floor(Math.random() * 7)),
      experience: `${2 + Math.floor(Math.random() * 13)} Years`,
    });
  }
  return drivers;
};

// Generate 100 fuel entries
const fuelVendors = ['HP Petrol Pump', 'BPCL', 'IOC', 'Shell', 'Essar', 'Reliance', 'Bharat Petroleum', 'Hindustan Petroleum'];

const generateFuelEntries = (vehicles, drivers) => {
  const entries = [];
  let id = 1;
  
  for (const vehicle of vehicles) {
    const driver = drivers.find(d => d.id === vehicle.driverId);
    const numEntries = Math.floor(Math.random() * 5) + 2;
    
    for (let i = 0; i < numEntries; i++) {
      const km = vehicle.kmReading - Math.floor(Math.random() * 5000);
      const fuel = Math.floor(Math.random() * 150) + 50;
      const cost = Math.floor(fuel * (90 + Math.random() * 20));
      
      entries.push({
        id: id++,
        vehicle: vehicle.regNo,
        vehicleId: vehicle.id,
        driver: driver?.name || 'Unassigned',
        driverId: driver?.id,
        date: dateOffset(Math.floor(Math.random() * 90)),
        km: km,
        fuel: fuel,
        cost: cost,
        kmpl: parseFloat((km / fuel).toFixed(1)),
        vendor: `${fuelVendors[Math.floor(Math.random() * fuelVendors.length)]}, ${vehicle.location.split(',')[0]}`,
      });
    }
  }
  
  return entries;
};

// Generate 50 trips
const generateTrips = (vehicles, drivers) => {
  const trips = [];
  let id = 1;
  
  for (let i = 0; i < 50; i++) {
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const driver = drivers.find(d => d.id === vehicle.driverId);
    const fromCity = cities[Math.floor(Math.random() * cities.length)];
    let toCity = cities[Math.floor(Math.random() * cities.length)];
    while (toCity === fromCity) {
      toCity = cities[Math.floor(Math.random() * cities.length)];
    }
    
    const distance = Math.floor(Math.random() * 2000) + 100;
    const freight = Math.floor(distance * (50 + Math.random() * 30));
    const fuelCost = Math.floor(distance * 25 + Math.random() * 10);
    const tollCost = Math.floor(distance * 3 + Math.random() * 2);
    const otherCost = Math.floor(distance * 2 + Math.random() * 1);
    
    trips.push({
      id: id++,
      vehicle: vehicle.regNo,
      vehicleId: vehicle.id,
      driver: driver?.name || 'Unassigned',
      driverId: driver?.id,
      from: fromCity,
      to: toCity,
      date: dateOffset(Math.floor(Math.random() * 90)),
      distance: distance,
      freight: freight,
      fuelCost: fuelCost,
      tollCost: tollCost,
      otherCost: otherCost,
      status: Math.random() > 0.3 ? 'active' : 'inactive',
    });
  }
  
  return trips;
};

// Generate 40 maintenance records
const maintenanceTypes = [
  'Engine oil change, Filter replacement',
  'Brake pad replacement, Wheel alignment',
  'AC service, Coolant flush',
  'Tyre rotation, Battery check',
  'Major service - 75,000 KM',
  'Clutch plate replacement',
  'Suspension overhaul',
  'Electrical system repair',
  'Transmission service',
  'Differential service'
];

const maintenanceVendors = [
  'Tata Authorized Service', 'Ashok Leyland Service Center', 'BharatBenz Service',
  'Eicher Pro Service Center', 'Volvo Trucks Service', 'Scania Service',
  'Sri Murugan Auto Works', 'Vel Auto Service', 'Ganesh Motors', 'Quick Fix Auto',
  'Chennai Truck Service', 'Coimbatore Motors', 'Madurai Auto Care'
];

const generateMaintenance = (vehicles) => {
  const records = [];
  let id = 1;
  
  for (const vehicle of vehicles) {
    const numRecords = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numRecords; i++) {
      const cost = Math.floor(Math.random() * 50000) + 2000;
      const nextKm = vehicle.kmReading + Math.floor(Math.random() * 20000) + 5000;
      
      records.push({
        id: id++,
        vehicle: vehicle.regNo,
        vehicleId: vehicle.id,
        date: dateOffset(Math.floor(Math.random() * 90)),
        work: maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)],
        vendor: maintenanceVendors[Math.floor(Math.random() * maintenanceVendors.length)],
        cost: cost,
        gst: Math.floor(cost * 0.18),
        status: Math.random() > 0.3 ? 'approved' : 'pending',
        nextKm: nextKm,
      });
    }
  }
  
  return records;
};

// Generate 30 FASTags (one per vehicle)
const fastagBanks = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'Canara Bank', 'Bank of Baroda', 'Punjab National Bank'];

const generateFASTags = (vehicles, drivers) => {
  const fastags = [];
  
  for (const vehicle of vehicles) {
    const driver = drivers.find(d => d.id === vehicle.driverId);
    const balance = Math.floor(Math.random() * 9000) + 100;
    const status = balance < 500 ? (balance < 200 ? 'critical' : 'warning') : 'ok';
    
    fastags.push({
      id: vehicle.id,
      fastagId: vehicle.fastagId,
      vehicle: vehicle.regNo,
      vehicleId: vehicle.id,
      driver: driver?.name || 'Unassigned',
      driverId: driver?.id,
      balance: balance,
      threshold: 500,
      status: status,
      lastToll: dateOffset(Math.floor(Math.random() * 7)),
      monthlyToll: Math.floor(Math.random() * 12000) + 2000,
      bank: fastagBanks[Math.floor(Math.random() * fastagBanks.length)],
    });
  }
  
  return fastags;
};

// Generate 100 tyres (8-10 per vehicle)
const tyrePositions = ['Front LHS', 'Front RHS', 'Axle LHS Inner', 'Axle LHS Outer', 'Axle RHS Inner', 'Axle RHS Outer', 'Spare 1', 'Spare 2'];
const tyreSizes = ['295/80 R22.5', '10.00 R20', '11.00 R20', '315/80 R22.5', '275/80 R22.5'];
const tyreBrands = ['MRF', 'Apollo', 'CEAT', 'Bridgestone', 'JK Tyre', 'BKT', 'Continental'];

const generateTyres = (vehicles) => {
  const tyres = [];
  let id = 1;
  
  for (const vehicle of vehicles) {
    const numTyres = 8 + Math.floor(Math.random() * 2);
    const changeKm = vehicle.kmReading - Math.floor(Math.random() * 50000);
    
    for (let i = 0; i < numTyres; i++) {
      const mileage = 60000 + Math.floor(Math.random() * 60000);
      const cost = Math.floor(Math.random() * 15000) + 15000;
      const wear = Math.min(100, Math.round(((vehicle.kmReading - changeKm) / mileage) * 100));
      
      tyres.push({
        id: id++,
        vehicle: vehicle.regNo,
        vehicleId: vehicle.id,
        tyreNo: `TYR-${String(id).padStart(3, '0')}`,
        position: tyrePositions[i % tyrePositions.length],
        size: tyreSizes[Math.floor(Math.random() * tyreSizes.length)],
        brand: tyreBrands[Math.floor(Math.random() * tyreBrands.length)],
        changeDate: dateOffset(Math.floor(Math.random() * 180)),
        changeKm: changeKm,
        currentKm: vehicle.kmReading,
        cost: cost,
        mileage: mileage,
        cpkm: parseFloat((cost / mileage).toFixed(2)),
      });
    }
  }
  
  return tyres;
};

// Generate 50 alerts
const alertTypes = ['critical', 'warning', 'info'];
const alertMessages = [
  (vehicle, days) => `${vehicle} — Insurance expires in ${days} days`,
  (driver, days) => `Driver ${driver} — DL expires in ${days} days`,
  (vehicle, balance) => `${vehicle} — FASTag balance low (₹${balance})`,
  (vehicle, km) => `${vehicle} — Service due at ${km.toLocaleString()} KM`,
  (vehicle, fuel) => `${vehicle} — Low fuel level (${fuel}%)`,
  (vehicle) => `${vehicle} — PUC expired`,
  (driver) => `Driver ${driver} — High violation count`,
  (vehicle, doc) => `Document ${doc} expiring for ${vehicle}`,
];

const generateAlerts = (vehicles, drivers) => {
  const alerts = [];
  let id = 1;
  
  for (let i = 0; i < 50; i++) {
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const driver = drivers.find(d => d.id === vehicle.driverId);
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const msgGenerator = alertMessages[Math.floor(Math.random() * alertMessages.length)];
    
    let msg = '';
    if (type === 'critical') {
      msg = msgGenerator(vehicle.regNo, Math.floor(Math.random() * 7));
    } else if (type === 'warning') {
      if (Math.random() > 0.5) {
        msg = alertMessages[1](driver?.name || 'Unknown', Math.floor(Math.random() * 30));
      } else {
        msg = alertMessages[2](vehicle.regNo, Math.floor(Math.random() * 500));
      }
    } else {
      msg = alertMessages[Math.floor(Math.random() * 3 + 1)](vehicle.regNo, Math.random() > 0.5 ? Math.floor(Math.random() * 100) : 'near');
    }
    
    alerts.push({
      id: id++,
      type: type,
      msg: msg,
      time: `${Math.floor(Math.random() * 720) + 1}h ago`,
      read: Math.random() > 0.6,
    });
  }
  
  return alerts;
};

// Generate 30 inventory items
const inventoryCategories = ['Lubricants', 'Filters', 'Brakes', 'Electrical', 'Accessories', 'Tyres', 'Fluids'];
const inventoryItems = {
  'Lubricants': ['Engine Oil 15W40', 'Engine Oil 10W30', 'Transmission Oil', 'Gear Oil', 'Differential Oil', 'Hydraulic Oil', 'Brake Fluid', 'Coolant', 'Power Steering Fluid'],
  'Filters': ['Air Filter', 'Oil Filter', 'Fuel Filter', 'Cabin Air Filter', 'Hydraulic Filter'],
  'Brakes': ['Brake Pads (Front)', 'Brake Pads (Rear)', 'Brake Shoes', 'Brake Liners', 'Brake Discs'],
  'Electrical': ['Headlight Bulb', 'Tail Light', 'Indicator', 'Battery', 'Alternator', 'Starter Motor', 'Spark Plug'],
  'Accessories': ['Wiper Blades', 'Mirror Set', 'Seat Cover', 'Floor Mat', 'Tool Kit'],
  'Tyres': ['Tube', 'Valve Stem', 'Wheel Nut', 'Rim'],
  'Fluids': ['Diesel', 'Brake Fluid', 'Coolant', 'Power Steering Fluid', 'Windshield Washer']
};

const generateInventory = () => {
  const items = [];
  let id = 1;
  
  for (const [category, itemNames] of Object.entries(inventoryItems)) {
    for (const itemName of itemNames) {
      const quantity = Math.floor(Math.random() * 200) + 5;
      const minStock = Math.floor(quantity * 0.2) + 5;
      
      items.push({
        id: id++,
        name: itemName,
        category: category,
        quantity: quantity,
        unit: ['L', 'pcs', 'sets', 'kits', 'ml'][Math.floor(Math.random() * 5)],
        minStock: minStock,
        location: ['Warehouse A', 'Warehouse B', 'Warehouse C'][Math.floor(Math.random() * 3)],
        lastUpdated: dateOffset(Math.floor(Math.random() * 30)),
        status: quantity <= minStock * 0.5 ? 'critical' : quantity < minStock ? 'low' : 'ok',
      });
    }
  }
  
  // Ensure we have at least 30 items
  while (items.length < 30) {
    const category = inventoryCategories[Math.floor(Math.random() * inventoryCategories.length)];
    items.push({
      id: id++,
      name: `Spare Item ${id}`,
      category: category,
      quantity: Math.floor(Math.random() * 100) + 10,
      unit: 'pcs',
      minStock: 20,
      location: 'Warehouse A',
      lastUpdated: dateOffset(Math.floor(Math.random() * 30)),
      status: 'ok',
    });
  }
  
  return items.slice(0, 30);
};

// Generate all data
console.log('Generating comprehensive demo data...');

const vehicles = generateVehicles();
console.log(`Generated ${vehicles.length} vehicles`);

// Update driver vehicles
const drivers = generateDrivers();
console.log(`Generated ${drivers.length} drivers`);

drivers.forEach(driver => {
  const vehicle = vehicles.find(v => v.id === driver.vehicleId);
  if (vehicle) {
    driver.vehicle = vehicle.regNo;
    vehicle.driver = driver.name;
  }
});

const fuelEntries = generateFuelEntries(vehicles, drivers);
console.log(`Generated ${fuelEntries.length} fuel entries`);

const trips = generateTrips(vehicles, drivers);
console.log(`Generated ${trips.length} trips`);

const maintenance = generateMaintenance(vehicles);
console.log(`Generated ${maintenance.length} maintenance records`);

const fastags = generateFASTags(vehicles, drivers);
console.log(`Generated ${fastags.length} FASTags`);

const tyres = generateTyres(vehicles);
console.log(`Generated ${tyres.length} tyre entries`);

const alerts = generateAlerts(vehicles, drivers);
console.log(`Generated ${alerts.length} alerts`);

const inventory = generateInventory();
console.log(`Generated ${inventory.length} inventory items`);

// Export as JSON
const data = { vehicles, drivers, fuelEntries, trips, maintenance, fastags, tyres, alerts, inventory };
console.log(JSON.stringify(data, null, 2));
