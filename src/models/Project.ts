import { ProjectFile } from "$models/ProjectFile";

export class Project {
     name: string;
     author: string;
     files: ProjectFile[] = [];
     complete: Boolean = false;

     constructor(name: string, author: string) {
        this.name = name
        this.author = author
     }
}