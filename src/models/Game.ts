import { Company } from '$models/Company'

export class Game {
    company: Company;

    constructor(company: Company) {
        this.company = company;
    }
}