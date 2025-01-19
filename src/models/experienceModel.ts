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
    averageRating: number,
    reviews: Review[];  // Aquí cambiamos de string[] a Review[]
    date: string,
    services: Service[],
    image: string,
}

export interface Review {
    id: string;
    user: string; // ID del usuario
    value: number; // Puntuación entre 0-5
    comment: string; // El comentario de la reseña
}
