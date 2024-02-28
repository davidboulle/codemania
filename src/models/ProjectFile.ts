export class ProjectFile {
    path: string;
    name: String = "untilted.txt";
    content: String = "";
    lines: number = 0;
    complete: Boolean = false;
    progress: string = "";
    
    constructor(path: string) {
        this.path = path;
        let file = path.split('/').at(-1);
        console.log;
        if (typeof file != 'undefined' && file.length > 0) {
            this.name = file;
        }
    }
}