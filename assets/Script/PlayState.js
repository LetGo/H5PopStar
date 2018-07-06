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
        this._accumBlockRoation = 0;
        this._score = 0;
        this._stage = 0;
        this._didDisplayStageClear = false;
    },

    start () {

    },

    
    onUpdate (dt) {
        if( Globle.gameMain.hasTouchTriggered){

            if(this.isAllBlockCalmDown()){
                cc.info("updateBlocks............end.......................");
                if(!this.isAnySolution()){
                    //Globle.gameMain.changeState(Const.gameState.kResult);
                }

                Globle.gameMain.hasTouchTriggered = false;
            }else{
                this.updateBlocks(dt);
                this.checkBlanks(false);
                this.fillEmptyColumns();
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

    onExit(){

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
            block.playState = this;
            block.blockColor = color;
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
        for( var i = max_col - 1; i >= 1; --i )
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
            if( this.blocks[row][c] != null )
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
            if( this.blocks[r][column] != null )
            {
                return false;
            }
        }
    
        return true;
    } ,   
    //
    isMovingColumn(column)
    {
        for( var r = 0; r < Const.MAX_ROW; ++r )
        {
            if( this.blocks[r][column] && this.blocks[r][column].state != Const.blockState.kNormal )
            {
                return true;
            }
        }
        return false;
    },

    //
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
                        if( block.destroyDelay > 0 )
                        {
                            block.destroyDelay = block.destroyDelay - dt;
                            break;
                        }

                        if( !destroySounPlayed )
                        {
                           // SoundManager::sharedManager()->playSound(SoundManager::SOUND_ID_POP_STAR, 0.9f + 0.15f * (block->destroySeq()-1));
                            destroySounPlayed = true;
                        }
                        this._score += block.subScore;
    
                        if( block.subScore > 0 )
                        {
    //                        CCPoint pos = ccp(_scoreBoard->getPosition().x, _scoreBoard->getPosition().y - 30);
                            //CCPoint pos = ccp(POS_SCOREBOARD.x, POS_SCOREBOARD.y - 30);
                            block.createSubScoreTo(Const.POS_SCOREBOARD);
                        }
    
                        // create particles
                        //createBlockParticlesAt(block->getPosition(), block->blockColor());
    
                        if( block.row + 1 < Const.MAX_ROW )
                        {
                            var row = block.row;
                            var column = block.column;
                            var pSelectBlock = this.blocks[row+1][column];
                            this.addPopForce(pSelectBlock, 400);
                        }					
    
                        block.onDeselect();
                        cc.info("destroy block index"+ block.row + "  " + block.column);
                        block.node.destroy();
                       // removeChild(block, true);

                        this.blocks[i][j] = null;
    
                        if( this.isStageCleared() && this._didDisplayStageClear == false )
                            this.displayStageClear();
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
    //
    checkBlanks(recheck)
    {
        for( var c = 0;  c < Const.MAX_COLUMN; ++c )
        {
            for( var r = 0; r < Const.MAX_ROW; ++r )
            {
                if( this.blocks[r][c] != null && this.blocks[r][c].state != Const.blockState.kNormal )
                    return;
            }
        }
    
        for( var c = 0;  c < Const.MAX_COLUMN; ++c )
        {
            var moveDelay = 0;
            for( var r = 0; r < Const.MAX_ROW; ++r )
            {
                if( this.blocks[r][c] == null )
                {
                    for( var i = r + 1; i < Const.MAX_ROW; ++i )
                    {
                        if( this.blocks[i][c] != null && this.blocks[i][c].state == Const.blockState.kNormal )
                        {
                            if(recheck)
                            {
                                this.blocks[i][c].node.stopAllActions();
                                this.blocks[i][c].node.runAction(new cc.moveTo(0.15,this.originBlockPositionAtRow(r,c)));
                            } else {
                                this.blocks[i][c].state = Const.blockState.kMove;
                                this.blocks[i][c].movePos = this.originBlockPositionAtRow(r, c);
                                //_blocks[i][c]._destroyDelay = moveDelay;
                                this.blocks[i][c].velocity = 0;
                                moveDelay += (1.0 / Const.FPS);
                            }
                            this.setBlockAtRow(r, c, this.blocks[i][c]);
                            this.setBlockAtRow(i, c, null);
    // #ifndef LANG_TH
    //                         UndoRecoder recoder(i,c,r,c);
    //                         _recoderManager->AddTrandlateBlock(recoder,recheck);
    // #endif
                            break;
                        }
                    }
                }
            }
        }
    
    },
    //
    fillEmptyColumns()
    {
        for( var c = 0; c < Const.MAX_COLUMN; ++c )
        {
            if( this.isEmptyColumn(c) )
            {
                for( var cc = c + 1; cc < Const.MAX_COLUMN; ++cc )
                {
                    if( this.isMovingColumn(cc) ) return;
                }

                for( var cc = c + 1; cc < Const.MAX_COLUMN; ++cc )
                {
                    if( this.isEmptyColumn(cc) ) continue;

                    for( var r = 0; r < Const.MAX_ROW; ++r )
                    {
                        if( this.blocks[r][cc] != null )
                        {
                            this.blocks[r][cc].state = Const.blockState.kMove;
                            this.blocks[r][cc].movePos = this.originBlockPositionAtRow(r, c);
                            this.blocks[r][cc].destroyDelay = 0;
                            this.setBlockAtRow(r, c, this.blocks[r][cc]);
                            this.setBlockAtRow(r, cc, null);
        // #ifndef LANG_TH
        // 						UndoRecoder recoder(r,cc,r,c);
        // 						_recoderManager->AddTrandlateBlock(recoder,false);	
        // #endif
                        }
                    }
                    break;
                }
            }
        }
    },

    //isAnySolution
    isAnySolution(){


        return false;
    },

    onSelect(selectBlock)
    {
        for( var i = Const.MAX_ROW - 1; i >= 0; --i )
        {
            for( var j = 0; j < Const.MAX_COLUMN; ++j )
            {
                if (this.blocks[i][j] != null)
                    this.blocks[i][j].onDeselect();
            }
        }
        if(selectBlock == null){

            return;
        }

        var isSelectionTouch = false;
        if(selectBlock.selectCount == 0){
            this.resetSelectCount();
        }

        this.resetvisitFlags();

        this._accumBlockRoation = 0;
        //递归遍历寻找目标附近相同颜色方块
        var blockCount = this.visitSameBlocksAtRow(selectBlock.row, selectBlock.column, selectBlock.blockColor, Const.blockState.kNormal, selectBlock.selectCount + 1);
        if( blockCount <= 1 )
		{
			this.resetSelectCount();
			//removeChildByTag(TAG_SELECTED_BLOCKS , true);
		}else{
            var blocksToDestroy = new Array();
			for( var i = Const.MAX_ROW - 1; i >= 0; --i )
			{
				for( var j = 0; j < Const.MAX_COLUMN; ++j )
				{
					var block = this.blocks[i][j];

                    if (block == null) continue;

					if( block.selectCount == 1 )
					{
						block.onSelect(blockCount);
						isSelectionTouch = true;
					}
					else if( block.selectCount >= 2 )
					{
						block.onSelect(blockCount);
						blocksToDestroy.push(block);
					}
				}
            }    
                    
            if(isSelectionTouch ){
                cc.info(blockCount+"连消 " +  this.getScore(blockCount));
            }else{

                Globle.gameMain.hasTouchTriggered = true;

                var length = blocksToDestroy.length;
                for(var i = 0; i< length; ++i){
                    var temp = blocksToDestroy[i];
                    var index = this.rand(length - 1);
                    blocksToDestroy[i] = blocksToDestroy[index];
                    blocksToDestroy[index] = temp;
                }

                for(var i = 0; i< length; ++i){
                    var block = blocksToDestroy[i];
                    if(block != null){
                        block.selectCount = 0;
                        block.state = Const.blockState.kDestroy;
                        block.destroyDelay = Const.BLOCK_ROTATE_INTERVAL * i;
                        block.subScore = this.getScore(i + 1) - this.getScore(i);
                        block.destroySeq = i; 
                        cc.info("block index "+ block.row + "  " + block.column);
                    }else{
                        cc.info("block null " + i);
                    }
                }

                this.doCheers(blockCount,Const.BLOCK_ROTATE_INTERVAL * (blockCount - 1));
                this.displayGainingScore(blockCount,selectBlock.position,Const.BLOCK_ROTATE_INTERVAL *(blockCount - 1) );
            }
        }
    },

    //
    doCheers( numBlocks,  delay){

    },
    displayGainingScore( numBlocks,  pos,  delay){

    },
    getScore( blocks)
    {
        return blocks * blocks * 5;
    },
    //
    resetSelectCount()
    {
        for( var i = 0; i < Const.MAX_ROW; ++i )
        {
            for( var j = 0; j < Const.MAX_COLUMN; ++j )
            {
                if(this.blocks[i][j] == null) continue;
    
                this.blocks[i][j].selectCount = 0;
            }
        }
    },

    resetvisitFlags()
    {
        for( var i = 0; i < Const.MAX_ROW; ++i )
        {
            for( var j = 0; j < Const.MAX_COLUMN; ++j )
            {
                if(this.blocks[i][j] == null) continue;
                this.blocks[i][j].visited = false;
            }
        }
    },

    visitSameBlocksAtRow(row,  column,  color,  state,  selectCount)
    {
        var _blocks = this.blocks;
        if( _blocks[row][column] == null ) return 0;
        if( _blocks[row][column].visited == true ) return 0;
        _blocks[row][column].visited = true;
    
        if( _blocks[row][column].state != state ) return 0;
        if( _blocks[row][column].blockColor != color ) return 0;
    
        var count = 1;
        _blocks[row][column].selectCount = selectCount;
    
    
        if( column - 1 >= 0 && _blocks[row][column-1] && _blocks[row][column-1].visited == false )
            count += this.visitSameBlocksAtRow(row, column -1, color, state, selectCount);
    
        if( column + 1 < Const.MAX_COLUMN && _blocks[row][column+1] && _blocks[row][column+1].visited == false )
            count += this.visitSameBlocksAtRow(row, column + 1, color, state, selectCount);
    
        if( row - 1 >= 0 && _blocks[row-1][column] && _blocks[row-1][column].visited == false)
            count += this.visitSameBlocksAtRow(row - 1, column, color, state, selectCount);
    
        if( row + 1 < Const.MAX_ROW && _blocks[row+1][column] && _blocks[row+1][column].visited == false )
            count += this.visitSameBlocksAtRow(row + 1, column, color, state, selectCount);
    
        return count;
    },

    addPopForce(block,curAccel)
    {
        if( block == null || block.row >= Const.MAX_ROW ) return;
        if( block.state != Const.blockState.kNormal ) return;

        //	const float DELAY_GAP = 0.06f;
        //	const float ACCEL_GAP = 30.f;

        if( block.accel == 0 )
        {
            block.accel =curAccel;// + ACCEL_GAP;
            //		block._moveDelay = curDelay + DELAY_GAP;
        }

        if( block.row + 1 < Const.MAX_ROW )
        {
            var row = block.row;
            var column = block.column;
            var upBlock = this.blocks[row + 1][column];
            if (upBlock == null) return;

            this.addPopForce(upBlock, block.accel);
        }
    },
    isStageCleared()
    {
        return this._score >= this.getClearScore();
    },

    getClearScore()
    {
        if(this._stage < Const.kMaxStage)
        {
            return Const.ClearScore[this._stage];
        }

        // 테이블을 벗어나면 4000씩 올라감
        //int tmpGap = 4000;

        var gap = 4000;
        return Const.ClearScore[Const.kMaxStage-1] + gap * (this._stage - Const.kMaxStage + 1);
    },

    displayStageClear(){

    },
});
