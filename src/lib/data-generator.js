// Data Generator for Fleet Management System
// Generates 30 items per module with proper ID-based relationships

const vehicleModels = [
  { make: 'Tata', models: ['Prima 4028.S', 'Prima 4928.S', 'LPT 3118', 'LPT 2516', 'Signa 4825', 'Ultra 2818.T', 'LPT 1916', 'Signa 4028.S'] },
  { make: 'Ashok Leyland', models: ['3518', '2825', '4020', '4940', '5525', '3718', '4225', 'Ecomet 1815'] },
  { make: 'BharatBenz', models: ['3523R', '2828.C', '3525', '2818.C', '2228.C', '3128.C', '4023.C', '2523.C'] },
  { make: 'Eicher', models: ['Pro 6031', 'Pro 6035', 'Pro 2095', 'Pro 2114XP', 'Pro 6046', 'Pro 6055', 'Pro 3015'] },
  { make: 'Mahindra', models: ['Blazo X 28', 'Blazo X 35', 'Truck 2416', 'Truck 4020', 'Truck 3520', 'Truck 2221'] },
  { make: 'Volvo', models: ['FMX 500', 'FMX 440', 'FMX 480', 'FMX 400', 'FMX 330'] },
  { make: 'Scania', models: ['P410', 'P440', 'G450', 'R500', 'R560'] },
  { make: 'MAN', models: ['TGS 28.480', 'TGS 33.480', 'TGS 41.480', 'TGX 18.480', 'TGX 28.480'] },
];

const states = [
  { code: 'TN', name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Erode', 'Tiruchirappalli', 'Vellore'] },
  { code: 'KA', name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli', 'Belgaum', 'Mangalore', 'Dharwad', 'Tumkur'] },
  { code: 'MH', name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Kolhapur'] },
  { code: 'DL', name: 'Delhi', cities: ['Delhi', 'New Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Faridabad'] },
  { code: 'GJ', name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh'] },
  { code: 'AP', name: 'Andhra Pradesh', cities: ['Hyderabad', 'Vijayawada', 'Visakhapatnam', 'Tirupati', 'Warangal', 'Kakinada'] },
  { code: 'UP', name: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Meerut', 'Ghaziabad'] },
  { code: 'RJ', name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar'] },
  { code: 'WB', name: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Kharagpur'] },
  { code: 'MP', name: 'Madhya Pradesh', cities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas'] },
];

const firstNames = ['Rajan', 'Suresh', 'Murugan', 'Vijay', 'Karthik', 'Selvam', 'Ramesh', 'Krishnan', 'Mohan', 'Sathish', 'Dinesh', 'Mani', 'Ravi', 'Kumar', 'Prakash', 'Sundar', 'Venkat', 'Nathan', 'Shankar', 'Srinivasan', 'Balaji', 'Deepak', 'Sridhar', 'Madhavan', 'Karthikeyan', 'Narayanan', 'Ganesh', 'Subramanian', 'Kannan', 'Rathinam'];
const lastNames = ['Kumar', 'Babu', 'S', 'R', 'M', 'P', 'N', 'K', 'G', 'S', 'D', 'M', 'R', 'P', 'S', 'V', 'S', 'B', 'D', 'K', 'N', 'S', 'G', 'S'];

const tyreBrands = ['MRF', 'CEAT', 'Apollo', 'JK Tyre', 'Bridgestone', 'Michelin', 'Goodyear', 'Pirelli', 'Continental', 'Yokohama'];
const tyrePositions = ['Front LHS', 'Front RHS', 'Axle LHS Inner', 'Axle LHS Outer', 'Axle RHS Inner', 'Axle RHS Outer', 'Spare'];
const tyreSizes = ['295/80 R22.5', '10.00 R20', '11.00 R20', '12.00 R24', '315/80 R22.5', '385/65 R22.5'];

const fuelVendors = ['HP Petrol Pump', 'BPCL', 'IOC', 'Shell', 'Reliance Petrol', 'Essar Petrol', 'Bharat Petroleum', 'Hindustan Petroleum', 'Mogha Petrolubricants', 'Indian Oil'];
const maintenanceVendors = ['Tata Authorized Service', 'Ashok Leyland Authorized', 'BharatBenz Workshop', 'Eicher Motors', 'Mahindra Service Center', 'Volvo Trucks Service', 'Scania Service Center', 'MAN Trucks India', 'Local Garage', 'Quick Fix Auto', 'Sri Murugan Auto Works', 'Vel Auto Service', 'Ganesh Motors', 'Tata Motors Care', 'Maruti Suzuki Service'];

const documentTypes = ['RC', 'FC', 'Insurance', 'Permit', 'National Permit', 'Road Tax', 'PUC', 'Fitness Certificate'];

const banks = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India', 'IndusInd Bank'];

const cities = states.flatMap(s => s.cities.map(c => ({ city: c, state: s.code, stateName: s.name })));

// Generate vehicles
const generateVehicles = () => {
  const vehicles = [];
  for (let i = 1; i <= 30; i++) {
    const modelIndex = Math.floor(Math.random() * vehicleModels.length);
    const { make, models } = vehicleModels[modelIndex];
    const model = models[Math.floor(Math.random() * models.length)];
    const cityIndex = Math.floor(Math.random() * cities.length);
    const { city, state, stateName } = cities[cityIndex];
    
    const year = Math.floor(Math.random() * 10) + 2015;
    const regNumber = `${state} ${String(Math.floor(Math.random() * 99)).padStart(2, '0')} ${['AB', 'CD', 'EF', 'GH', 'IJ', 'KL', 'MN', 'OP', 'QR', 'ST'][Math.floor(Math.random() * 10)]} ${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    
    const driverId = Math.floor(Math.random() * 30) + 1;
    const kmReading = Math.floor(Math.random() * 200000) + 10000;
    const fuelLevel = Math.floor(Math.random() * 100);
    const status = Math.random() > 0.2 ? 'active' : 'inactive';
    
    // Generate documents with realistic expiry dates
    const documents = documentTypes.map((doc, idx) => {
      const baseDate = new Date();
      const expiryDate = new Date(baseDate.setFullYear(baseDate.getFullYear() + Math.floor(Math.random() * 5) + 1));
      const isExpired = new Date() > expiryDate;
      const isDueSoon = !isExpired && (expiryDate.getTime() - new Date().getTime()) < 30 * 24 * 60 * 60 * 1000;
      
      return {
        name: doc,
        expiry: expiryDate.toISOString().split('T')[0],
        status: isExpired ? 'expired' : isDueSoon ? 'due' : 'ok',
      };
    });
    
    const purchaseDate = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];
    const lastService = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const nextServiceKm = kmReading + Math.floor(Math.random() * 10000) + 5000;
    
    vehicles.push({
      id: i,
      regNo: regNumber,
      model: `${make} ${model}`,
      chassis: `MAT${String(Math.random()).substring(2, 14).toUpperCase()}${String(i).padStart(5, '0')}`,
      engine: `4928CRDL${String(Math.random()).substring(2, 14).toUpperCase()}${String(i).padStart(5, '0')}`,
      driver: `Driver ${driverId}`,
      driverId,
      gpsId: `GPS-${String(i).padStart(3, '0')}`,
      fuelCard: `FC-2024-${String(i).padStart(3, '0')}`,
      fastagId: `FT-${state}-${String(i).padStart(3, '0')}`,
      status,
      kmReading,
      fuelLevel,
      photo: '',
      documents,
      lastService,
      nextService: `${nextServiceKm.toLocaleString()} KM`,
      location: `${city}, ${stateName}`,
      purchaseDate,
    });
  }
  return vehicles;
};

// Generate drivers
const generateDrivers = () => {
  const drivers = [];
  for (let i = 1; i <= 30; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const cityIndex = Math.floor(Math.random() * cities.length);
    const { city, state, stateName } = cities[cityIndex];
    
    const year = Math.floor(Math.random() * 15) + 2010;
    const joinDate = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];
    const licenseIssue = new Date(year, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const licenseExpiry = new Date(licenseIssue.setFullYear(licenseIssue.getFullYear() + 5));
    
    const vehicleId = i;
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
    const vehicleReg = vehicleIndex >= 0 ? vehicles[vehicleIndex].regNo : 'Not Assigned';
    
    const trips = Math.floor(Math.random() * 500) + 50;
    const kmDriven = Math.floor(Math.random() * 300000) + 10000;
    const fuelEfficiency = (4 + Math.random() * 2).toFixed(1);
    const rating = (3 + Math.random() * 2).toFixed(1);
    const violations = Math.floor(Math.random() * 5);
    const experience = Math.floor(Math.random() * 15) + 1;
    
    const lastTrip = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    drivers.push({
      id: i,
      name: `${firstName} ${lastName}`,
      empId: `EMP-${String(i).padStart(3, '0')}`,
      phone: `+91 ${Math.floor(Math.random() * 90000000000) + 7000000000}`,
      license: `${state}${String(licenseIssue.getFullYear()).substring(2, 4)}${String(Math.random()).substring(2, 7).padStart(7, '0')}`,
      licenseExpiry: licenseExpiry.toISOString().split('T')[0],
      insurance: `${['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'PNB', 'BOB', 'Canara'][Math.floor(Math.random() * 8)]}-DRV-${String(i).padStart(3, '0')}`,
      insuranceExpiry: new Date(licenseExpiry.setFullYear(licenseExpiry.getFullYear() + 1)).toISOString().split('T')[0],
      status: Math.random() > 0.15 ? 'active' : 'inactive',
      vehicle: vehicleReg,
      vehicleId,
      joinDate,
      address: `${Math.floor(Math.random() * 500)} ${['Main St', 'Market Rd', 'Temple St', 'Gandhi Road', 'Anna Nagar', 'RB Road', 'MG Road', 'Civil Lines'][Math.floor(Math.random() * 8)]}, ${city} - ${Math.floor(Math.random() * 600000).toString()}`,
      photo: `https://images.unsplash.com/photo-${['1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e', '1472099645785-5658abf4ff4e', '1519085360753-af0119f7cbe7', '1560250097-0b93528c311a', '1566492031773-4f4e44671857'][Math.floor(Math.random() * 6)]}?w=150&q=80`,
      trips,
      kmDriven,
      fuelEfficiency,
      rating: parseFloat(rating),
      violations,
      lastTrip,
      experience: `${experience} Years`,
    });
  }
  return drivers;
};

// Generate vehicles first (needed for other modules)
const vehicles = generateVehicles();
const drivers = generateDrivers();

// Generate fuel entries
const generateFuelEntries = () => {
  const entries = [];
  for (let i = 1; i <= 30; i++) {
    const vehicleIndex = Math.floor(Math.random() * vehicles.length);
    const vehicle = vehicles[vehicleIndex];
    const driver = drivers.find(d => d.id === vehicle.driverId);
    
    const date = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000);
    const km = vehicle.kmReading - Math.floor(Math.random() * 5000);
    const fuel = Math.floor(Math.random() * 150) + 30;
    const cost = fuel * (Math.floor(Math.random() * 30) + 80);
    const kmpl = parseFloat((km / fuel).toFixed(1));
    
    entries.push({
      id: i,
      vehicle: vehicle.regNo,
      vehicleId: vehicle.id,
      driver: driver?.name || 'Unknown',
      driverId: driver?.id,
      date: date.toISOString().split('T')[0],
      km,
      fuel,
      cost,
      kmpl,
      vendor: fuelVendors[Math.floor(Math.random() * fuelVendors.length)],
    });
  }
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate trips
const generateTrips = () => {
  const trips = [];
  const citiesList = cities;
  
  for (let i = 1; i <= 30; i++) {
    const vehicleIndex = Math.floor(Math.random() * vehicles.length);
    const vehicle = vehicles[vehicleIndex];
    const driver = drivers.find(d => d.id === vehicle.driverId);
    
    const fromCityIndex = Math.floor(Math.random() * citiesList.length);
    const toCityIndex = Math.floor(Math.random() * citiesList.length);
    const fromCity = citiesList[fromCityIndex];
    const toCity = citiesList[toCityIndex];
    
    const distance = Math.floor(Math.random() * 2500) + 200;
    const freight = Math.floor(distance * (Math.floor(Math.random() * 30) + 50));
    const fuelCost = Math.floor(distance * (Math.floor(Math.random() * 8) + 12));
    const tollCost = Math.floor(distance * (Math.floor(Math.random() * 3) + 1));
    const otherCost = Math.floor(Math.random() * 3000) + 500;
    
    const date = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000);
    
    trips.push({
      id: i,
      vehicle: vehicle.regNo,
      vehicleId: vehicle.id,
      driver: driver?.name || 'Unknown',
      driverId: driver?.id,
      from: fromCity.city,
      to: toCity.city,
      date: date.toISOString().split('T')[0],
      distance,
      freight,
      fuelCost,
      tollCost,
      otherCost,
      status: Math.random() > 0.3 ? 'active' : 'inactive',
    });
  }
  return trips.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate maintenance records
const generateMaintenance = () => {
  const maintenance = [];
  const workDescriptions = [
    'Engine oil change, Filter replacement',
    'Brake pad replacement, Wheel alignment',
    'AC service, Coolant flush',
    'Tyre rotation, Battery check',
    'Clutch plate replacement',
    'Suspension overhaul',
    'Gearbox oil change',
    'Major service - 50,000 KM',
    'Electrical system check',
    'Wiper and lights replacement',
    'Fuel pump replacement',
    'Turbocharger service',
    'Differential oil change',
    'Power steering service',
    'Alternator replacement',
    'Starter motor repair',
    'Radiator replacement',
  ];
  
  for (let i = 1; i <= 30; i++) {
    const vehicleIndex = Math.floor(Math.random() * vehicles.length);
    const vehicle = vehicles[vehicleIndex];
    
    const date = new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000);
    const work = workDescriptions[Math.floor(Math.random() * workDescriptions.length)];
    const vendor = maintenanceVendors[Math.floor(Math.random() * maintenanceVendors.length)];
    const cost = Math.floor(Math.random() * 30000) + 5000;
    const gst = Math.floor(cost * 0.18);
    const nextKm = vehicle.kmReading + Math.floor(Math.random() * 10000) + 5000;
    
    maintenance.push({
      id: i,
      vehicle: vehicle.regNo,
      vehicleId: vehicle.id,
      date: date.toISOString().split('T')[0],
      work,
      vendor,
      cost,
      gst,
      status: Math.random() > 0.3 ? 'approved' : 'pending',
      nextKm,
    });
  }
  return maintenance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate FASTag entries
const generateFASTags = () => {
  const fastags = [];
  
  for (let i = 1; i <= 30; i++) {
    const vehicleIndex = Math.floor(Math.random() * vehicles.length);
    const vehicle = vehicles[vehicleIndex];
    const driver = drivers.find(d => d.id === vehicle.driverId);
    
    const balance = Math.floor(Math.random() * 8000) + 100;
    const threshold = Math.floor(Math.random() * 1000) + 500;
    const status = balance >= threshold ? 'ok' : balance > threshold * 0.5 ? 'warning' : 'critical';
    
    const lastToll = new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthlyToll = Math.floor(Math.random() * 10000) + 2000;
    
    fastags.push({
      id: i,
      fastagId: `FT-${vehicle.state || 'TN'}-${String(i).padStart(3, '0')}`,
      vehicle: vehicle.regNo,
      vehicleId: vehicle.id,
      driver: driver?.name || 'Unassigned',
      driverId: driver?.id,
      balance,
      threshold,
      status,
      lastToll,
      monthlyToll,
      bank: banks[Math.floor(Math.random() * banks.length)],
    });
  }
  return fastags;
};

// Generate tyre records
const generateTyres = () => {
  const tyres = [];
  
  for (let i = 1; i <= 30; i++) {
    const vehicleIndex = Math.floor(Math.random() * vehicles.length);
    const vehicle = vehicles[vehicleIndex];
    
    const tyreNo = `TYR-${String(i).padStart(3, '0')}`;
    const position = tyrePositions[Math.floor(Math.random() * tyrePositions.length)];
    const size = tyreSizes[Math.floor(Math.random() * tyreSizes.length)];
    const brand = tyreBrands[Math.floor(Math.random() * tyreBrands.length)];
    
    const changeKm = vehicle.kmReading - Math.floor(Math.random() * 50000);
    const currentKm = vehicle.kmReading;
    const cost = Math.floor(Math.random() * 20000) + 10000;
    const mileage = Math.floor(Math.random() * 60000) + 40000;
    const cpkm = parseFloat((cost / mileage).toFixed(2));
    
    const changeDate = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000);
    
    tyres.push({
      id: i,
      vehicle: vehicle.regNo,
      vehicleId: vehicle.id,
      tyreNo,
      position,
      size,
      brand,
      changeDate: changeDate.toISOString().split('T')[0],
      changeKm,
      currentKm,
      cost,
      mileage,
      cpkm,
    });
  }
  return tyres.sort((a, b) => a.vehicleId - b.vehicleId || a.id - b.id);
};

// Generate alerts
const generateAlerts = () => {
  const alerts = [];
  const alertMessages = {
    critical: [
      '{vehicle} — Insurance expires in 5 days',
      '{driver} — DL expired, immediate action required',
      '{vehicle} — FC expired, cannot operate',
      '{vehicle} — Permit expired, cannot operate',
      'Emergency: {vehicle} breakdown reported',
      'Critical: {vehicle} engine overheating',
    ],
    warning: [
      '{driver} — DL expires in 15 days',
      '{vehicle} — FASTag balance low (₹{amount})',
      '{vehicle} — Service due at {km} KM',
      '{vehicle} — Fuel level critically low ({fuel}%)',
      '{vehicle} — PUC expires soon',
      '{driver} — Exceeding weekly driving hours',
    ],
    info: [
      '{vehicle} — Completed trip to {location}',
      '{driver} — Reported trip successfully',
      '{vehicle} — Maintenance scheduled',
      'New driver {driver} added to fleet',
      '{vehicle} — Assigned to new route',
      'Monthly report generated successfully',
    ],
  };
  
  for (let i = 1; i <= 30; i++) {
    const type = ['critical', 'warning', 'info'][Math.floor(Math.random() * 3)];
    const messages = alertMessages[type];
    const msgTemplate = messages[Math.floor(Math.random() * messages.length)];
    
    const vehicleIndex = Math.floor(Math.random() * vehicles.length);
    const vehicle = vehicles[vehicleIndex];
    const driver = drivers.find(d => d.id === vehicle.driverId);
    
    let msg = msgTemplate
      .replace('{vehicle}', vehicle.regNo)
      .replace('{driver}', driver?.name || 'Unknown Driver')
      .replace('{location}', cities[Math.floor(Math.random() * cities.length)].city)
      .replace('{km}', (vehicle.kmReading + Math.floor(Math.random() * 10000)).toLocaleString())
      .replace('{fuel}', vehicle.fuelLevel)
      .replace('{amount}', Math.floor(Math.random() * 500) + 100);
    
    const hoursAgo = Math.floor(Math.random() * 720) + 1;
    const time = hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`;
    
    alerts.push({
      id: i,
      type,
      msg,
      time,
      read: Math.random() > 0.5,
    });
  }
  return alerts.sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.time) - new Date(a.time);
  });
};

// Generate inventory
const generateInventory = () => {
  const inventory = [];
  const categories = [
    'Lubricants',
    'Brakes',
    'Filters',
    'Fluids',
    'Tyres',
    'Electrical',
    'Accessories',
    'Parts',
  ];
  const itemsByCategory = {
    'Lubricants': ['Engine Oil 15W-40', 'Engine Oil 10W-30', 'Gear Oil', 'Brake Fluid', 'Power Steering Fluid', 'Transmission Oil', 'Differential Oil', 'Hydraulic Oil', 'Engine Flush', 'Coolant'],
    'Brakes': ['Brake Pads', 'Brake Shoes', 'Brake Discs', 'Brake Drums', 'Brake Lines', 'Brake Calipers', 'Master Cylinder', 'Wheel Cylinders'],
    'Filters': ['Air Filter', 'Oil Filter', 'Fuel Filter', 'Hydraulic Filter', 'Cabin Air Filter', 'Engine Filter'],
    'Fluids': ['Coolant', 'Brake Fluid', 'Power Steering Fluid', 'Transmission Fluid', 'Differential Oil', 'Windshield Washer', 'AC Gas'],
    'Tyres': ['Tyre Tube', 'Valve Stem', 'Wheel Weight', 'Tyre Repair Kit', 'Puncture Kit', 'Valve Core'],
    'Electrical': ['Headlight Bulb', 'Tail Light', 'Indicator Bulb', 'Fog Light', 'Battery', 'Alternator', 'Starter Motor', 'Wiper Motor'],
    'Accessories': 'Side Mirror, Floor Mat, Seat Cover, Sun Visor, Tool Kit, First Aid Kit, Fire Extinguisher'.split(', '),
    'Parts': ['Clutch Plate', 'Gearbox Gears', 'Differential Gears', 'Axle Shaft', 'Universal Joint', 'CV Joint', 'Wheel Hub', 'Bearings'],
  };
  const unitsByCategory = {
    'Lubricants': 'L',
    'Brakes': 'sets',
    'Filters': 'pcs',
    'Fluids': 'L',
    'Tyres': 'pcs',
    'Electrical': 'pcs',
    'Accessories': 'pcs',
    'Parts': 'pcs',
  };
  
  for (let i = 1; i <= 30; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const items = Array.isArray(itemsByCategory[category]) ? itemsByCategory[category] : [itemsByCategory[category]];
    const item = items[Math.floor(Math.random() * items.length)];
    
    const quantity = Math.floor(Math.random() * 100) + 5;
    const minStock = Math.floor(quantity * 0.2) + 5;
    const unit = unitsByCategory[category];
    const location = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D', 'Main Store', 'Regional Store'][Math.floor(Math.random() * 6)];
    
    inventory.push({
      id: i,
      name: item,
      category,
      quantity,
      unit,
      minStock,
      location,
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: quantity <= minStock ? (quantity <= minStock * 0.5 ? 'critical' : 'low') : 'ok',
    });
  }
  return inventory;
};

module.exports = {
  vehicles,
  drivers,
  fuelEntries: generateFuelEntries(),
  trips: generateTrips(),
  maintenance: generateMaintenance(),
  fastags: generateFASTags(),
  tyres: generateTyres(),
  alerts: generateAlerts(),
  inventory: generateInventory(),
};
