export class Tab {
    path: string;
    name = 'New file';
    content = '';
    progress = '';
    constructor(path: string) {
        this.path = path;
        let file = path.split('/').at(-1);
        console.log;
        if (typeof file != 'undefined' && file.length > 0) {
            this.name = file;
        }
    }
}