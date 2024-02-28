import { Requirement } from "$models/Requirement";

export class JobOffer {
     type: number; // Dev, Manager, Cleaner
     name: string;
     price: number;
     requirements: Requirement[] = []

     constructor(type: number, name: string, price: number) {
        this.type = type;
        this.name = name;
        this.price = price;
     }
}