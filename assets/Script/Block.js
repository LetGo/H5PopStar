var Const = require('./Const.js')

cc.Class({
    extends: cc.Component,

    properties: {
        playState:{
            get(){
                return this._playState;
            },
            set(value){
                this._playState= value;
            },
        },
        blockColor:{
            get(){
                return this._blockColor;
            },
            set(value){
                this._blockColor = value;
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
        },
        velocity:{
            get(){
                return this._velocity;
            },
            set(value){
                this._velocity = value;
            },
        },
        destroyDelay:{
            get(){
                return this._destroyDelay;
            },
            set(value){
                this._destroyDelay = value;
            },
        },
        visited:{
            get(){
                return this._visited;
            },
            set(value){
                this._visited = value;
            }
        },
        subScore:{
            get(){
                return this._subScore;
            },
            set(value){
                this._subScore = value;
            },
        },
        destroySeq:{
            get(){
                return this._destroySeq;
            },
            set(value){
                this._destroySeq = value;
            },
        },
        accel:{
            get(){
                return this._accel;
            },
            set(value){
                this._accel = value;
            },
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.button = this.node.getComponent(cc.Button);
        this.node.on('click', this.onClickBlock, this);
        this.blockOutLine = cc.find("select",this.node).getComponent(cc.Sprite);
        this.reset();
     },

     reset(){
        this._selected = false;
        this._destroyDelay =0;
        this._velocity = 0;
        this._accel = 0;
        this._visited = false;
        this._column = 0;
        this._row =0; 
        this._selectCount = 0;
        this._state = Const.blockState.kNormal;
        this._subScore = 0;
        this._moveDelay = 0;
        this._destroySeq = 0;
        if(this.blockOutLine != null){
            this.blockOutLine.enabled = false;
        }  
        
     },

     onClickBlock(event){
        this.playState.onSelect(this);
     },

    start () {

    },

    setPosition(pos){
        this.node.position = pos;
    },

    setPos( r,  c){
        this._column = c;
        this._row = r;
    },

    // update (dt) {
    //     if(this._selected){
    //         this.blockOutLine.node.position = new cc.Vec2(0,0); 
    //     }
    // },

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

    onSelect(selectedBlockCount){
        this._selected = true;
        this.node.runAction(cc.jumpTo(Const.JUMP_DURATION,this.position,3,1));
        this.blockOutLine.enabled = true;
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

    createSubScoreTo( pos )
    {
        // display sub score image
    
        // CCString* labelName = CCString::createWithFormat("%d", _subScore );
    
        // //MovingLabel *label = [MovingLabel labelWithString:string position:self.position];
    
        // MovingLabel *label = MovingLabel::labelWithString( labelName, getPosition());
    
        // //[label setRGB:255 :255 :255];
        // label->setColor(ccc3(255,255,255));
    
        // label->setScale(0.5f);
    
        // //id scaleDownAction = [CCScaleTo actionWithDuration:1.0f scale:0.25f];
        // CCScaleTo* scaleDownAction = CCScaleTo::create(1.f, 0.25f);
    
        // //id moveDownAction = [EasyOut actionWithDuration:1.5f position:pos ratio:0.1f];
        // EasyOut* moveDownAction = EasyOut::create(1.f, pos, 0.1f);
    
        // //[label runAction: [CCSpawn actions:scaleDownAction, moveDownAction, nil]];
        // label->runAction(CCSpawn::create(scaleDownAction, moveDownAction, NULL));
    
        // //[g_mainLayer addChild: label z:1];
        // g_mainLayer->addChild(label, 1 );
    }    
});
