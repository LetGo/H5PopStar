var Const = require('./Const.js')

//var Block = require("./Block.js")

cc.Class({
    extends: cc.Component,

    properties: {
        blocksPrefab : {
            default: [],
            type: [cc.Prefab]     // type 同样写成数组，提高代码可读性
        },     
        blocks: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var max_row = Const.MAX_ROW; //最大行
        var max_col = Const.MAX_COLUMN;//最大列        
        this.blocks = new Array();
        for(var i=0;i<max_row;i++){          
            this.blocks[i] = new Array(i);    
            for(var j=0;j<max_col;j++){      
                this.blocks[i][j] = null;
            }
        }

    },

    start () {

    },

    onUpdate (dt) {
        if( Globle.gameMain.hasTouchTriggered){

            if(this.isAllBlockCalmDown()){
                cc.info("updateBlocks............end.......................");
                Globle.gameMain.hasTouchTriggered = false;
            }else{
                cc.info("updateBlocks............");
                this.updateBlocks(dt);
            }
        }
    },

    onEnter(){
        // var self = this;
        // cc.loader.loadRes("Prefabs/block_0", function (err, prefab) {
        //     var newNode = cc.instantiate(prefab);
        //     newNode.parent = self.node;
        // });
        Globle.gameMain.hasTouchTriggered = true;
        this.creatBlocks()
    },

    rand( n ){
         return ( Math.floor ( Math.random ( ) * n + 1 ) );
    },

    creatBlocks(){

         cc.info("Const.LEFT_MARGIN  "+ Const.LEFT_MARGIN);
         cc.info("Const.kBlockWidth  "+ Const.kBlockWidth);
         
        var max_row = Const.MAX_ROW; //最大行
        var max_col = Const.MAX_COLUMN;//最大列
        for(var i = max_row - 1; i >= 0; --i){
            for(var j = 0; j < max_col; ++j){
                var block = this.createBlockAtRow(i, j, this.rand(Const.blockColor.kMaxBlockColor - 1));
                block.movePos = block.position;
                block.position = new cc.Vec2(block.position.x,block.position.y + 400 + i * 60 + j * 5 + this.rand( 50 ) );
                block.state = Const.blockState.kMove;
            }
        }
    },

    createBlockAtRow(row,column,color){
        
        var self = this;
        // cc.loader.loadRes("Prefabs/block_"+color, function (err, prefab) {

        // });
            var newNode = cc.instantiate(this.blocksPrefab[color]);
            newNode.parent = self.node;
            var block = newNode.getComponent("Block")

           // cc.info(row+"  "+ column);
            this.setBlockAtRow( row, column, block );
            var pos = self.originBlockPositionAtRow(row,column);
            block.setPosition(pos) 
            return block;
    },

    setBlockAtRow( row,  column, block){
        this.blocks[row][column] = block;
        if(block != null){
            block.setPos(row,column);
        }
    },

    originBlockPositionAtRow(row, column ){
	    return new cc.Vec2(Const.LEFT_MARGIN + Const.kBlockWidth * (column + 0.5), Const.BOTTOM_MARGIN + Const.kBlockHeight * (row + 0.5));
    },

    isAllBlockCalmDown()
    {
        var max_row = Const.MAX_ROW; //最大行
        var max_col = Const.MAX_COLUMN;//最大列        
        for( var i = 0; i < max_row; ++i )
        {
            for( var j = 0; j < max_col; ++j )
            {
                var block = this.blocks[i][j];
                if( block == null ) continue;
                if( block.state != Const.blockState.kNormal ) 
                {
                    return false;
                }
            }
        }
    
        // when moving left
        for( var i = MAX_COLUMN - 1; i >= 1; --i )
        {
            if( !this.isEmptyColumn(i) && this.isEmptyColumn(i-1) )
                return false;
        }
    
        return true;
    },

    isEmptyRow(row)
    {
        var max_col = Const.MAX_COLUMN;//最大列  
        for( var c = 0; c < max_col; ++c )
        {
            if( this.blocks[row][c] != NULL )
            {
                return false;
            }
        }
    
        return true;
    },

    isEmptyColumn(column)
    {
        var max_row = Const.MAX_ROW; //最大行
        for( var r = 0; r < max_row; ++r )
        {
            if( this.blocks[r][column] != NULL )
            {
                return false;
            }
        }
    
        return true;
    } ,   
    
    updateBlocks(dt)
    {
        var destroySounPlayed = false;
        var landingSoundPlayed = false;
        var selectCancel = false;
    
    
        for( var i = 0; i < Const.MAX_ROW; ++i )
        {
            for( var j = 0; j < Const.MAX_COLUMN; ++j )
            {
                var block = this.blocks[i][j];
    
                if(block == null) continue;
    
                switch( block.state )
                {
                    case Const.blockState.kNormal:
                        break;
                    case Const.blockState.kDestroy:
    //                     if( block->destroyDelay() > 0 )
    //                     {
    //                         block->destroyDelay(block->destroyDelay() - dt);
    //                         break;
    //                     }
    //                 {
    //                     if( !destroySounPlayed )
    //                     {
    //                         SoundManager::sharedManager()->playSound(SoundManager::SOUND_ID_POP_STAR, 0.9f + 0.15f * (block->destroySeq()-1));
    //                         destroySounPlayed = true;
    //                     }
    //                     _score += block->subScore();
    
    //                     if( block->subScore() > 0 )
    //                     {
    // //                        CCPoint pos = ccp(_scoreBoard->getPosition().x, _scoreBoard->getPosition().y - 30);
    //                         CCPoint pos = ccp(POS_SCOREBOARD.x, POS_SCOREBOARD.y - 30);
    //                         block->createSubScoreTo(pos);
    //                     }
    
    //                     // create particles
    //                     createBlockParticlesAt(block->getPosition(), block->blockColor());
    
    //                     if( block->getPos().x + 1 < MAX_ROW )
    //                     {
    //                         int row = block->getPos().x;
    //                         int column = block->getPos().y;
    //                         Block* pSelectBlock = _blocks[row+1][column];
    //                         addPopForce(pSelectBlock, 400.f);
    //                     }					
    
    //                     block->onDeselect();
    //                     removeChild(block, true);
    //                     _blocks[i][j] = NULL;
    
    //                     if( isStageCleared() && _didDisplayStageClear == false )
    //                         displayStageClear();
    //                 }
                        break;
                    case Const.blockState.kMove:
                        block.move(dt);
                        var lastPlayedFrame = 0;
                        if( block.state == Const.blockState.kNormal && !landingSoundPlayed && Globle.gameMain.frameCnt - lastPlayedFrame >= 3 )
                        {
                            if( block.prevYPos != block.position.y )
                            {
                                //SoundManager::sharedManager()->playSound(SoundManager::SOUND_ID_LANDING);
                                landingSoundPlayed = true;
                                lastPlayedFrame = Globle.gameMain.frameCnt;
                            }
                        }
                        if( block.selected )
                            selectCancel = true;
                        break;
                }
            }
        }
    
        
        if( selectCancel )
        {
            for( var i = 0; i < Const.MAX_ROW; ++i )
            {
                for( var j = 0; j < Const.MAX_COLUMN; ++j )
                {
                    var block = this.blocks[i][j];
                    if (block == null) continue;
    
                    block.onDeselect();
                }
            }
        }
    },

});
