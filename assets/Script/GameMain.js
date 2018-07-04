// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Const = require('./Const.js')

cc.Class({
    extends: cc.Component,


    properties: {
        menuState:cc.Component,
        stageState:cc.Component,        
        playState:cc.Component,
        _states:[],
        _currState:null,
        _stage:-1,
        _score:0,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        require("./Globle.js");
        Globle.gameMain = this;
        this._states[Const.gameState.kMenu] = this.menuState;
        this._states[Const.gameState.kStage] = this.stageState;
        this._states[Const.gameState.kPlay] = this.playState;
        
 cc.info("-------------- gamemain --------------- ")
     },

    start () 
    {
        cc.info('222222222222222');
        
       // this.changeState(Const.gameState.kMenu)
    },

    
    changeState(state){
        cc.info("state  "+state);
        var setState = this._states[state];
        if(this._currState != null){
            this._currState.onExiter();
        }
        if(setState != undefined){
            setState.onEnter();
        }else{
            cc.info('setState null ' + state);
            
        }
        
    },
    // update (dt) {},
});
