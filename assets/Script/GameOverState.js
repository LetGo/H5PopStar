
var Const = require('./Const.js')
cc.Class({
    extends: cc.Component,

    properties: {
        lable:{
            default:null,
            type:cc.Label,
        },
    },


  
    start () {
        this.lable.enabled = false;
    },

    onEnter(){
        this.owner =  Globle.gameMain;
        this.owner.showPopup = true;

        this.lable.enabled = true;
        this.lable.string = "游戏结束";
        this.lable.node.scale = 0.5;
        var rot = new cc.rotateBy(0.5,360);
        var scale = new cc.scaleTo(0.5,1);
        var delay = new cc.delayTime(6);
        var fade = new cc.fadeOut(1);
        this.lable.node.runAction(rot);
        this.lable.node.runAction(scale);
        this.lable.node.runAction(new cc.sequence(delay,fade));                
        this._delay = 7.0;
    },

    onExit(){
        this.owner.backToMainMenu();
        this.owner.showPopup = false;
    },

    onUpdate(dt){

        this._delay -= dt;
        if(  this._delay <= 0 )
        {
            this.owner.changeState(Const.gameState.kMenu);
        }        
    },   
});
