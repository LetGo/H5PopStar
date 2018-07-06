
var Const = require('./Const.js')

cc.Class({
    extends: cc.Component,

    properties: {
        
        newGameBtn:{
            default:null,
            type:cc.Button,
        }
    },

    onLoad () {
        this.state = Const.gameState.kMenu;        
        this.newGameBtn.node.on(cc.Node.EventType.TOUCH_END,this.onNewGame,this);            
    },

    onNewGame(event){
        this.newGameBtn.node.runAction(cc.blink(0.8,10));
        Globle.gameMain.changeState(Const.gameState.kStage);
    },

    start () 
    {

    },

    onEnter(param)
    {
        this.node.opacity = 255;
        cc.info("menu onEnter ")
    },

    onExit(param){
        this.node.opacity = 0;
    },
    onUpdate(dt){

    },
});
