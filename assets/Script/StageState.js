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
        Globle.gameMain.initStage();
        stageLable.string = "关卡" +  (Globle.gameMain.stage + 1);
        stageLable.node.position = new cc.Vec2(500,0);

        //var easy1 = new cc.easeOut(1.5,new Vec2(500,0),0.15);
    },

    onExit(){

    },
    onUpdate(dt){

    },
    // update (dt) {},
});
