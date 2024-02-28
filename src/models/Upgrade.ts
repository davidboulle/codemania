export class Upgrade {
    name: string;
    level: number = 0;
    price: number = 0;
    bonusProductivityGlobal: number = 0;
    bonusProductivityDevelopper: number = 0;
    bonusProductivityManager: number = 0;
    bonusOfficeCoolness: number = 0;
    bonusOfficeSize: number = 0;
    // Other bonuses

        constructor(name: string) {
            this.name = name;
        }
}