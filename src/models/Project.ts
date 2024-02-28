import { ProjectFile } from "$models/ProjectFile";

export class Project {
     name: string;
     files: ProjectFile[] = [];
     complete: Boolean = false;

     constructor(name: string) {
        this.name = name
     }

}