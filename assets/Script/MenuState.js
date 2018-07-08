
var Const = require('./Const.js')

cc.Class({
    extends: cc.Component,

    properties: {
        menus:{
            default:null,
            type:cc.Node,
        },
        newGameBtn:{
            default:null,
            type:cc.Button,
        }
    },

    onLoad () {
        this.state = Const.gameState.kMenu;        
        this.newGameBtn.node.on(cc.Node.EventType.TOUCH_END,this.onNewGame,this);            
    },

    start(){
        this.owner = Globle.gameMain;
    },

    onNewGame(event){
        if(this._exit)
            return;
        this.newGameBtn.node.runAction(cc.blink(0.8,10));
        this.hideSprites();

        this.owner.resumedGame = false;
        this.owner.resetGame();

        this._exit = true;
        this._newGame = true;

    },

    onEnter(param)
    {
        this.owner = Globle.gameMain;

        this._exit = false;
        this._newGame = false;
        this._delay = 1.0;

        this.node.opacity = 255;

        this.owner.hideScoreBoard();
        this.owner.addTitle();
        this.owner.showTitle();
        this.menus.runAction(cc.fadeIn(1));
        cc.info("menu onEnter ")
    },

    onExit(param){
        this.node.opacity = 0;
        this.owner = Globle.gameMain;
        this.owner.showScoreBoard();     
        this.owner.removeTitle();
           
    },

    onUpdate(dt){
        if (this._exit){
            this._delay -= dt;

            if(this._delay < 0){
                if(this._newGame){
                    this.owner.changeState(Const.gameState.kStage)
                }else{

                }
            }
        }
    },

    hideSprites(){
        this.owner.hideTitle();
        this.owner.goToGamePlay();
        this.menus.runAction(cc.fadeOut(1));
    }
});
