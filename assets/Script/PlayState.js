var Const = require('./Const.js')

//var Block = require("./Block.js")

cc.Class({
    extends: cc.Component,

    properties: {
   
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },
    
    onEnter(){
        this.owner = Globle.gameMain;

        this.node.opacity = 255;
        Globle.gameMain.hasTouchTriggered = true;
        this.owner = Globle.gameMain;

        this.owner.creatBlocks()
    },

    onUpdate (dt) {
        var owner = this.owner;
        if( owner.hasTouchTriggered){

            if(owner.isAllBlockCalmDown()){
                cc.info("updateBlocks............end.......................");
                if(!owner.isAnySolution()){
                    owner.changeState(Const.gameState.kResult);
                }

                owner.hasTouchTriggered = false;
            }else{
                owner.updateBlocks(dt);
                owner.checkBlanks(false);
                owner.fillEmptyColumns();
            }
        }
    },

    onExit(){
        this.node.opacity = 0;
    },





    //













});
