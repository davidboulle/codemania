export class ProjectFile {
    path: string;
    name: String = "untilted.txt";
    content: String = "";
    lines: number = 0;
    complete: Boolean = false;
    progress: string = "";
    progressNext: string = "";
    
    constructor(path: string) {
        this.path = path;
        let file = path.split('/').at(-1);
        console.log;
        if (typeof file != 'undefined' && file.length > 0) {
            this.name = file;
        }
    }
    
	getNextWord(i: number): string {
		let word = ''
        let index: number = i
        let loops = 0
        let minSize = 10
        while (true) {
            let nextchar = this.content.charAt(index)

            if (word.length > minSize && word.replaceAll(" ", "").length != 0 && word.charAt(word.length) != " ") {
                if (nextchar == " ") break;
                if (nextchar == "\n") break;
            }
            
            word += this.content.charAt(index)
            index += 1
            loops += 1

            // safe break
            if (loops > 100) break
        }

        return word
	}

    isSameChar(c: string) {
        console.log(c + " <-> " + this.progress.charAt(this.progress.length -1))
        return c == this.progress.charAt(this.progress.length -1)
    }
}