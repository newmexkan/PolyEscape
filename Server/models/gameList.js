/**
 * Created by Julien on 18/01/2018.
 */

"use strict";

module.exports = class GameList {

    constructor() {
        this.list = [];
    }

    /**
     * Get game by name
     * @param name
     */
    get(name){
        let gameId = this.list.findIndex(i => i.getName() === name.toLowerCase());
        return this.list[gameId];
    }

    /**
     *
     * @param name
     */
    hasGameNamed(name){
        return (this.list.findIndex(i => i.getName() === name.toLowerCase()) !== -1);
    }

    /**
     * Push a game
     * @param game : the game to push
     */
    push(game) {
        this.list.push(game);
    }

    /**
     * Pop a game
     * @param gameName : the game's name
     * @return 0 if the game has been removed, -1 else
     */
    pop(gameName) {
        let index = this.list.findIndex(i => i.getName() === gameName.toLowerCase());
        if (index > -1) {
            this.list.splice(index, 1);
            return 0;
        }
        else return -1;
    }

    /**
     * Get the last index
     */
    getLastIndex(){
        return this.list.length;
    }

}