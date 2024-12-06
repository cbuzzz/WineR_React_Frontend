export interface Service {
    icon: string; // Icon representation (e.g., emoji or URL)
    label: string; // Label describing the service (e.g., "Parking")
}

export interface Experience {
    _id?: string,
    title: string,
    owner: string,
    participants: string[],
    description: string,
    price: number,
    location: string,
    contactnumber: number,
    contactmail: string,
    rating: number,
    reviews: string[],
    date: string,
    services: Service[],
}
