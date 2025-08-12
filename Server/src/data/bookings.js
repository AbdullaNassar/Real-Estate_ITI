export const bookings = [
  {
    _id: "66b8b4d8f92c9a001f6e0001",
    guest: "66b8b4d8f92c9a001f1e0003", // Mohamed Ali
    listing: "66b8b4d8f92c9a001f4c0001", // Luxury Apartment in Zamalek with Nile View
    checkIn: new Date("2024-01-10"),
    checkOut: new Date("2024-01-17"),
    totalPrice: 8400, // 7 nights * 1200 EGP
    paymentStatus: "paid",
    paymentMethod: "stripe",
    createdAt: new Date("2024-01-08"),
  },
  {
    _id: "66b8b4d8f92c9a001f6e0002",
    guest: "66b8b4d8f92c9a001f1e0004", // Sara Khaled
    listing: "66b8b4d8f92c9a001f4c0001", // Luxury Apartment in Zamalek with Nile View
    checkIn: new Date("2024-02-15"),
    checkOut: new Date("2024-02-22"),
    totalPrice: 8400, // 7 nights * 1200 EGP
    paymentStatus: "paid",
    paymentMethod: "paypal",
    createdAt: new Date("2024-02-12"),
  },
  {
    _id: "66b8b4d8f92c9a001f6e0003",
    guest: "66b8b4d8f92c9a001f1e0005", // Abd Alrahman
    listing: "66b8b4d8f92c9a001f4c0003", // Beachfront Chalet in North Coast Marina
    checkIn: new Date("2024-03-05"),
    checkOut: new Date("2024-03-12"),
    totalPrice: 12600, // 7 nights * 1800 EGP
    paymentStatus: "paid",
    paymentMethod: "stripe",
    createdAt: new Date("2024-03-01"),
  },
  {
    _id: "66b8b4d8f92c9a001f6e0004",
    guest: "66b8b4d8f92c9a001f1e0003", // Mohamed Ali
    listing: "66b8b4d8f92c9a001f4c0005", // Luxury Penthouse in Heliopolis
    checkIn: new Date("2024-01-20"),
    checkOut: new Date("2024-01-27"),
    totalPrice: 14000, // 7 nights * 2000 EGP
    paymentStatus: "paid",
    paymentMethod: "stripe",
    createdAt: new Date("2024-01-18"),
  },
  {
    _id: "66b8b4d8f92c9a001f6e0005",
    guest: "66b8b4d8f92c9a001f1e0004", // Sara Khaled
    listing: "66b8b4d8f92c9a001f4c0007", // Seaside Villa in Hurghada with Private Beach
    checkIn: new Date("2024-02-10"),
    checkOut: new Date("2024-02-17"),
    totalPrice: 21000, // 7 nights * 3000 EGP
    paymentStatus: "paid",
    paymentMethod: "paypal",
    createdAt: new Date("2024-02-05"),
  },
  {
    _id: "66b8b4d8f92c9a001f6e0006",
    guest: "66b8b4d8f92c9a001f1e0005", // Abd Alrahman
    listing: "66b8b4d8f92c9a001f4c0009", // Comfortable Room in Maadi
    checkIn: new Date("2024-03-01"),
    checkOut: new Date("2024-03-08"),
    totalPrice: 2100, // 7 nights * 300 EGP
    paymentStatus: "paid",
    paymentMethod: "stripe",
    createdAt: new Date("2024-02-28"),
  },
  {
    _id: "66b8b4d8f92c9a001f6e0007",
    guest: "66b8b4d8f92c9a001f1e0003", // Mohamed Ali
    listing: "66b8b4d8f92c9a001f4c0010", // Luxor Temple View Apartment
    checkIn: new Date("2024-02-25"),
    checkOut: new Date("2024-03-03"),
    totalPrice: 5600, // 7 nights * 800 EGP
    paymentStatus: "paid",
    paymentMethod: "stripe",
    createdAt: new Date("2024-02-22"),
  },
  // Additional bookings for variety
  {
    _id: "66b8b4d8f92c9a001f6e0008",
    guest: "66b8b4d8f92c9a001f1e0004", // Sara Khaled
    listing: "66b8b4d8f92c9a001f4c0002", // Modern Villa in New Cairo with Pool
    checkIn: new Date("2024-04-15"),
    checkOut: new Date("2024-04-20"),
    totalPrice: 12500, // 5 nights * 2500 EGP
    paymentStatus: "pending",
    paymentMethod: "stripe",
    createdAt: new Date("2024-04-10"),
  },
  {
    _id: "66b8b4d8f92c9a001f6e0009",
    guest: "66b8b4d8f92c9a001f1e0005", // Abd Alrahman
    listing: "66b8b4d8f92c9a001f4c0004", // Cozy Studio in Downtown Alexandria
    checkIn: new Date("2024-05-01"),
    checkOut: new Date("2024-05-05"),
    totalPrice: 2400, // 4 nights * 600 EGP
    paymentStatus: "paid",
    paymentMethod: "paypal",
    createdAt: new Date("2024-04-28"),
  },
  {
    _id: "66b8b4d8f92c9a001f6e0010",
    guest: "66b8b4d8f92c9a001f1e0003", // Mohamed Ali
    listing: "66b8b4d8f92c9a001f4c0008", // Modern Townhouse in Sheikh Zayed
    checkIn: new Date("2024-06-10"),
    checkOut: new Date("2024-06-17"),
    totalPrice: 10500, // 7 nights * 1500 EGP
    paymentStatus: "failed",
    paymentMethod: "stripe",
    createdAt: new Date("2024-06-08"),
  },
  {
    _id: "66b8b4d8f92c9a001f6e0011",
    guest: "66b8b4d8f92c9a001f1e0004", // Sara Khaled
    listing: "66b8b4d8f92c9a001f4c0006", // Traditional Duplex in Islamic Cairo
    checkIn: new Date("2024-07-01"),
    checkOut: new Date("2024-07-05"),
    totalPrice: 3600, // 4 nights * 900 EGP
    paymentStatus: "pending",
    paymentMethod: "paypal",
    createdAt: new Date("2024-06-28"),
  },
  {
    _id: "66b8b4d8f92c9a001f6e0012",
    guest: "66b8b4d8f92c9a001f1e0005", // Abd Alrahman
    listing: "66b8b4d8f92c9a001f4c0003", // Beachfront Chalet in North Coast Marina
    checkIn: new Date("2024-08-15"),
    checkOut: new Date("2024-08-22"),
    totalPrice: 12600, // 7 nights * 1800 EGP
    paymentStatus: "paid",
    paymentMethod: "stripe",
    createdAt: new Date("2024-08-10"),
  },
];
