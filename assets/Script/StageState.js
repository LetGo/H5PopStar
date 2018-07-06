// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        stageLable:{
            default:null,
            type:cc.Label,
        },  
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onEnter(){
        this.node.opacity = 255;
        
        Globle.gameMain.initStage();
        stageLable.string = "关卡" +  (Globle.gameMain.stage + 1);
        stageLable.node.position = new cc.Vec2(500,0);

        var easy1 = new cc.easeOut(0.15);
        var delay = new cc.delayTime(2.0);
        var easy2 = new cc.easeOut(0.15);
        
        var seq = new cc.sequence(easy1,delay,easy2);

        stageLable.node.runAction(seq);
    },

    onExit(){
        this.node.opacity = 0;
        cc.info("stage onExit");
    },
    onUpdate(dt){

    },
    // update (dt) {},
});
