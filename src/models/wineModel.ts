import { Service } from "./serviceModel"

export interface Wine {
    _id?: string,
    owner: string,
    name: string,
    price: number,
    color: string,
    brand: string,
    grapetype: string,
    habilitado: boolean
    notes: Service[],
    year: number,
    experience: string,
}

