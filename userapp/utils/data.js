export const categories = [
    {
        id: 'bedsitters',
        name: 'Bedsitters',
    },
    {
        id: 'studio',
        name: 'Studio',
    },
    {
        id: 'one-bedroom',
        name: '1 Bedroom',
    },
    {
        id: 'two-bedroom',
        name: '2 Bedroom',
    },
    {
        id: 'three-bedroom',
        name: '3 Bedroom',
    },
    {
        id: 'maisonette',
        name: 'Maisonette',
    },
];



export const houses = [
    {
        id: 1,
        apartmentname: "Abbi Apartment",
        price: 30000,
        location: "Kilimani",
        bathrooms: 1,
        bedrooms: 2,
        garages: 2,
        type: "two-bedroom",
        rating: 4.5,
        mainimage: require("../assets/images/house1.jpeg"),
        images: [
            "../assets/images/house1.jpeg",
            "../assets/images/house1-2.jpeg",
            "../assets/images/house1-3.jpeg"
        ]
    },
    {
        id: 2,
        apartmentname: "Skyline Residences",
        price: 45000,
        location: "Westlands",
        bathrooms: 2,
        bedrooms: 3,
        garages: 1,
        type: "three-bedroom",
        rating: 4.8,
        mainimage: require("../assets/images/house2.jpeg"),
        images: [
            "../assets/images/house2.jpeg",
            "../assets/images/house2-2.jpeg",
            "../assets/images/house2-3.jpeg",
            "../assets/images/house2-4.jpeg"
        ]
    },
    {
        id: 3,
        apartmentname: "Cozy Haven Studio",
        price: 18000,
        location: "Kileleshwa",
        bathrooms: 1,
        bedrooms: 1,
        garages: 0,
        type: "studio",
        rating: 4.2,
        mainimage: require("../assets/images/house3.jpeg"),
        images: [
            "../assets/images/house3.jpeg",
            "../assets/images/house3-2.jpeg"
        ]
    },
    {
        id: 4,
        apartmentname: "Palm Court Maisonette",
        price: 65000,
        location: "Lavington",
        bathrooms: 3,
        bedrooms: 4,
        garages: 2,
        type: "maisonette",
        rating: 4.9,
        mainimage: require("../assets/images/house1.jpeg"),
        images: [
            "../assets/images/house4.jpeg",
            "../assets/images/house4-2.jpeg",
            "../assets/images/house4-3.jpeg"
        ]
    },
    {
        id: 5,
        apartmentname: "Urban Nest Bedsitter",
        price: 15000,
        location: "South B",
        bathrooms: 1,
        bedrooms: 1,
        garages: 0,
        type: "bedsitters",
        rating: 4.0,
        mainimage: require("../assets/images/house2.jpeg"),
        images: [
            "../assets/images/house5.jpeg",
            "../assets/images/house5-2.jpeg"
        ]
    },
];