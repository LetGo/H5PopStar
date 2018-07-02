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
        _states:[],
        _currState:null,
        _stage:-1,
        _score:0,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        require("./Globle.js");
        Globle.gameMain = this;
        this.states[Const.gameState.kMenu] = this.menuState;
        cc.info('1111111111111111');
     },

    start () 
    {
        cc.info('222222222222222');
        
        this.changeState(Const.gameState.kMenu)
    },

    
    changeState(state){
        cc.info("state  "+state);
        var setState = this.states[state];
        if(_currState != null){
            _currState.onExiter();
        }
        if(setState != undefined){
            setState.onEnter();
        }else{
            cc.info('setState null ' + state);
            
        }
        
    },
    // update (dt) {},
});
