/**
 * Created by Julien on 14/01/2018.
 */
"use strict";

module.exports = class Player {

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
