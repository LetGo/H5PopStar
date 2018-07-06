
var Const = require('./Const.js')

cc.Class({
    extends: cc.Component,


    properties: {
        menuState:cc.Component,
        stageState:cc.Component,        
        playState:cc.Component,
        _states:[],
        _currState:null,
        stage:{
            get(){
                return this.playState.stage;
            },
        },
        score:{
            get(){
                return this.playState.score;
            },
        },
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
        this._visualScore = 0;
        
        
        cc.info("-------------- gamemain --------------- ")
     },

    start () 
    {
        cc.info('222222222222222');
        
        this.changeState(Const.gameState.kMenu)
    },


    changeState(state){
        cc.info("state  "+state);
        var setState = this._states[state];
        if(this._currState != null){
            this._currState.onExit();
        }
        if(setState != undefined){
            setState.onEnter();
        }else{
            cc.info('setState null ' + state);
            
        }
        this._currState = setState;
    },

    initStage(){
        this._hasTouchTriggered = true;
        this.playState._didDisplayStageClear = false;
        this.playState.clear();
        this.playState.updateScore();
        this.playState.initStageLabels();

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
