var Const = require('./Const.js')

cc.Class({
    extends: cc.Component,

    properties: {
        color:{
            get(){
                return this._color;
            },
            set(value){
                this._color = value;
            },
        },
        movePos:{
            get(){
                return this._movePos;
            },
            set(value){
                this._movePos = value;
            },
        },
        
        position:{
            get(){
                return this.node.position;
            },
            set(value){
                this.node.position = value;
            },
        },

        state:{
            get(){
                return this._state;
            },
            set(value){
                this._state = value;
            },
        },
        row:{
            get(){
                return this._row;
            },
            set(value){
                this._row = value;
            },
        },
        column:{
            get(){
                return this._column;
            },
            set(value){
                this._column = value;
            },
        },

        prevYPos:{
            get(){
                return this._prevYPos;
            },
            set(value){
                this._prevYPos = value;
            },
        },
        selectCount:{
            get(){
                return this._selectCount;
            },
            set(value){
                this._selectCount = value;
            },
        },
        selected:{
            get(){
                return this._selected;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this._selected = false;
        this._destroyDelay =0;
        this._velocity = 0;
        this._accel = 0;

        this.blockOutLine = cc.find("select",this.node).getComponent(cc.Sprite);
        if(this.blockOutLine != null){
            this.blockOutLine.enabled = false;
        }
     },

    start () {

    },

    setPosition(pos){
        this.node.position = pos;
    },

    setPos( r,  c){
        this.column = c;
        this.row = r;
    },

    update (dt) {
        if(this._selected){
            this.blockOutLine.node.position = new cc.Vec2(Const.kBlockWidth*0.5, Const.kBlockHeight * 0.5); 
        }
    },

    move(dt){
        if( this._destroyDelay > 0 )
        {
            this._destroyDelay -= dt;
            return;
        }
    
        this._velocity += ( -80 + this._accel );
        this._accel = 0;
        if( this._velocity < -1000 )
            this._velocity = -1000;
        if( this._velocity > 1000 )
            this._velocity = 1000;
    
    
        this._prevYPos = this.position.y;
    
    
    
        var dir = cc.pNormalize(cc.pSub(this._movePos, this.position));
        var dx = dir.x * Math.abs(this.position.x - this._movePos.x) * 0.25 * Const.FPS * dt;
        var dy =  this._velocity * dt;
        
        this.position = new cc.Vec2(this.position.x + dx,this.position.y + dy);
       
    
        if(this.position.y <= this._movePos.y )
        {
            this.position = new cc.Vec2(this.position.x + dx,  this._movePos.y);
        }
    
        if( Math.abs(this.position.x - this._movePos.x) < 1 && this.position.y <= this._movePos.y )
        {
            this.position = this._movePos;
            this._selectCount = 0;
            this._state = Const.blockState.kNormal;
        }
    },
    onDeselect()
    {
        if( this._selected )
        {
            this._selected = false;

            this.blockOutLine.enabled = false;
            this.blockOutLine.node.stopAllActions();
        }
    },
});
