
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
        hasTouchTriggered:{
            get(){
                return this._hasTouchTriggered;
            },
            set(value){
                this._hasTouchTriggered = value;
            },
        },
        frameCnt:{
            get(){
                return this._frameCnt;
            },
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        require("./Globle.js");
        Globle.gameMain = this;
        this._states[Const.gameState.kMenu] = this.menuState;
        this._states[Const.gameState.kStage] = this.stageState;
        this._states[Const.gameState.kPlay] = this.playState;
        
        this.hasTouchTriggered = false;
        this._frameCnt = 0;
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
        this._currState = setState;
    },

    update (dt) {
        if(this._currState != null){
            this._currState.onUpdate(dt);
        }else {
            cc.info('this._currState null ');
        }
        this._frameCnt++;
    },
});
