/**
 * Created by Julien on 14/01/2018.
 */
"use strict";

class Player {
    _name;
    _id;

    constructor(id, name) {
        this._id = id;
        this._name = name;
    }
    get name() {
        return this._name;
    }
}