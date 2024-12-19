import { Service } from "./serviceModel"

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
    averagerating: number,
    reviews: string[],
    date: string,
    services: Service[],
}
