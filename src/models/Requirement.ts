import { Company } from "./Company";

export class Requirement {
    name: string;
    eligibility: boolean = false;
    bonus: number = -1;

        constructor(name: string) {
            this.name = name;
        }
}