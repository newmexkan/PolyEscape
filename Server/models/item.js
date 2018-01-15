"use strict";

module.exports = class Item {

    constructor(name, pathImg) {
        this.name = name;
        this.pathImg = pathImg;
    }
    getName() {
        return this.name;
    }
    getPathImg() {
        return this.pathImg;
    }
}