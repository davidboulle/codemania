export class TeamBoost {
        name: String;
        room: number = -1;
        employees: number = -1;
        manager: number = -1;
        projects: number = -1;
        lines: number = -1;
        balance: number = -1;
        unlocks: number = -1; // Specific unlock sinon décliner en bonus


        constructor(name: string) {
            this.name = name;
        }
}