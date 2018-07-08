
var Const = require('./Const.js')
cc.Class({
    extends: cc.Component,

    properties: {
        stageLable:{
            default:null,
            type:cc.Label,
        },  
        targetLable:{
            default:null,
            type:cc.Label,
        },
        _delay:{
            default:4,
            type:cc.Integer,
        },          
    },

    start(){
        this.stageLable.enabled = false;
        this.targetLable.enabled = false;
    },

    onEnter(){
        this.node.opacity = 255;
        this.stageLable.enabled = true;
        this.targetLable.enabled = true;
        Globle.gameMain.initStage();

        this.stageLable.string = "关卡" +  (Globle.gameMain.stage + 1);
        this.stageLable.node.position = new cc.Vec2(500,0);

        this.targetLable.string = "目标分数 " + Globle.gameMain.getClearScore();
        this.targetLable.enabled = false;

        var move = new cc.moveTo(1,new cc.Vec2(0,0));
        var easy1 = move.easing(cc.easeOut(0.15));
        var delay = new cc.delayTime(2.0);
        var move2 = new cc.moveTo(1,new cc.Vec2(-420,0));
        var easy2 = move2.easing(cc.easeOut(0.15));
        
        var seq = new cc.sequence(easy1,delay,easy2);

        this.stageLable.node.runAction(seq);

        var seq2 = new cc.sequence(new cc.delayTime(1),cc.callFunc(this.showTargetScore,this));
        this.node.runAction(seq2);

        cc.info("stage onEnter ")
    },


    showTargetScore(){
        this.targetLable.enabled = true;
        this.targetLable.node.position = new cc.Vec2(500,-50);

        var move = new cc.moveTo(1,new cc.Vec2(0,this.targetLable.node.position.y));
        var easy1 = move.easing(cc.easeOut(0.15));
        var delay = new cc.delayTime(1.0);
        var move2 = new cc.moveTo(1,new cc.Vec2(-520,this.targetLable.node.position.y));
        var easy2 = move2.easing(cc.easeOut(0.15));
        
        var seq = new cc.sequence(easy1,delay,easy2);     
        this.targetLable.node.runAction(seq);
    },

    onExit(){
        this.node.opacity = 0;
        cc.info("stage onExit");
    },


    onUpdate(dt){
        this._delay -= dt;
        if (this._delay <= 0){
            Globle.gameMain.changeState(Const.gameState.kPlay);
        }
    },
});
