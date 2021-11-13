import UI_InterfaceClass from "../UI/UI_Interface.js";
export class CommandHelperClass {

}

export class UI_CommandHelperClass extends CommandHelperClass {
    constructor() {
        super();
        this.UI_Interface = new UI_InterfaceClass()
    }
}

