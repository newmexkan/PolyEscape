
"use strict";

module.exports = class SkillList {


    constructor() {
        this.list = [];
    }

    /**
     * Pick a skill
     * @param skillName : the skill we want to link to user
     * @param user : the user
     */
    pickSkill(skillName, user) {
        let skillId = this.list.findIndex(i => i.name === skillName);
        if(skillId !== -1){
            let userId = this.list[skillId].users.findIndex(i => i === user);
            if(userId === -1)
                this.list[skillId].users.push(user);
        }
        else{
        }
    }


    /**
     * Pop a user
     * @param skillName : the skill we want to unlink to user
     * @param user : the user's name
     * @return 0 if the user has been removed, -1 else
     */
    pop(skillName, user) {
        let skillId = this.list.findIndex(i => i.name === skillName);
        if (skillId > -1) {
            let userId = this.list[skillId].users.findIndex(i => i === user);
            if(userId !== -1) {
                this.list[skillId].users.splice(userId, 1);
                return 0;
            }
        }
        else return -1;
    }


}