export class UserAgent {
    constructor() {
        this.agent = navigator;
    }
}

export class ClipboardClass extends UserAgent {
    constructor() {
        super();
        this.clipboard = this.agent.clipboard;
    }
    write(text) {
        this.clipboard.writeText(text).then(this.successfulWriteAction).catch(this.failedWriteAction);
    }
    successfulWriteAction = () => {
        alert('Copied link!')
    }
    failedWriteAction = () => {
        alert('Not copied! Try again.')
    }
}