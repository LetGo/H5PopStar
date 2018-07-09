
var Const = require('./Const.js')

cc.Class({
    extends: cc.Component,


    properties: {
        menuState:cc.Component,
        stageState:cc.Component,        
        playState:cc.Component,
        resultState:cc.Component,
        overState:cc.Component,

        blocksPrefab : {
            default: [],
            type: [cc.Prefab]     // type 同样写成数组，提高代码可读性
        },  
        blockRoot:{
            default:null,
            type:cc.Node,
        },
        targetScoreLable:{
            default:null,
            type:cc.Label,
        },
        stageLable:{
            default:null,
            type:cc.Label,
        },  
        currScoreLable:{
            default:null,
            type:cc.Label,
        },   
        hightScoreLable:{
            default:null,
            type:cc.Label,
        },
        title:{
            default:null,
            type:cc.Sprite,    
        },  
        tip:{
            default:null,
            type:cc.Sprite,    
        },          
        _states:[cc.Component],
        _currState:null,
        stage:{
            get(){
                return this._stage;
            },
            set(value){
                this._stage = value;
            },
        },
        score:{
            get(){
                return this._score;
            },
            set(value){
                this._score = value;
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
        numBlocksRemaining:{
            get(){
                return this._numBlocksRemaining;
            },
            set(value){
                this._numBlocksRemaining = value;
            },
        },
        bonusGained:{
            get(){
                return this._bonusGained;
            },
            set(value){
                this._bonusGained = value;
            },
        },
        scoreBeforeResult:{
            get(){
                return this._scoreBeforeResult;
            },
            set(value){
                this._scoreBeforeResult = value;
            },
        },
        didDisplayStageClear:{
            get(){
                return this._didDisplayStageClear;
            },
            set(value){
                this._didDisplayStageClear = value;
            },
        },
        visualScore:{
            get(){
                return this._visualScore;
            },
            set(value){
                this._visualScore = value;
            },
        },
        isShuffle:{
            get(){
                return this._isShuffle;
            },
            set(value){
                this._isShuffle = value;
            },
        },
        resumedGame:{
            get(){
                return this._resumedGame;
            },
            set(value){
                this._resumedGame = value;
            }
        },
        showPopup:{
            get(){
                return this._showPopup;
            },
            set(value){
                this._showPopup = value;
            },
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        require("./Globle.js");
        Globle.gameMain = this;
        
        var max_row = Const.MAX_ROW; //最大行
        var max_col = Const.MAX_COLUMN;//最大列        
        this.blocks = new Array();
        for(var i=0;i<max_row;i++){          
            this.blocks[i] = new Array(i);    
            for(var j=0;j<max_col;j++){      
                this.blocks[i][j] = null;
            }
        }

        this.unUseBlockdic = new Array();
        this.unUseBlockdic[Const.blockColor.kRed] = new Array();
        this.unUseBlockdic[Const.blockColor.kBlue] = new Array();
        this.unUseBlockdic[Const.blockColor.kGreen] = new Array();
        this.unUseBlockdic[Const.blockColor.kPurple] = new Array();
        this.unUseBlockdic[Const.blockColor.kYellow] = new Array();

        
        this.init();

        this._states[Const.gameState.kMenu] = this.menuState;
        this._states[Const.gameState.kStage] = this.stageState;
        this._states[Const.gameState.kPlay] = this.playState;
        this._states[Const.gameState.kResult] = this.resultState;
        this._states[Const.gameState.kGameOver] = this.overState;
        

        cc.info("-------------- gamemain --------------- "+ this.stageState);
     },

     init(){
        this.__isHammerPayment = false;//锤子使用幸运星不足时用
        this.__isHammerPaymentLayer = false;
        this._isCheckEnable = false;
        this.isBuy = false;

        this.loadItemInfo();

        this._emitterIndex = 0;
        this._score = 0;
        this._currTime = 45;
        this._visualScore = 0;
        this._stage = -1;
        this._frameCnt = 0;
        this._resumedGame = false;
        this._clearScore = new Array();
        this._clearScore[0] = 1000;
        this._clearScore[1] = 3000;
        this._clearScore[2] = 6000;
        this._clearScore[3] = 8000;
        this._clearScore[4] = 10000;
        this._clearScore[5] = 13000;
        this._clearScore[6] = 15000;
        this._clearScore[7] = 17000;
        this._clearScore[8] = 20000;
        this._hintTime = 0;
        this._showPopup = false;
        this._numBlocksRemaining = 0;

        //TODO
        this._hiScore = 1000;

        this.hightScoreLable.string = "最高分: " + this._hiScore;


        this._emitters = new Array();
        //TODO
        for (let index = 0; index < Const.kMaxParticleEmitter; index++) {
            
           // var emitter = new cc.ParticleSystem()
            
        }

        this._destroyBlocks = new Array();

     },

    start () 
    {
        // for (let index = 0; index < this._states.length; index++) {
        //     const element = this._states[index];
        //     if(element != null){
        //         cc.info("============= "+element);
        //         element.onExit();
        //     }
        // }
        this.changeState(Const.gameState.kMenu)
    },

    //TODO
    loadItemInfo(){

    },

    //TODO
    createFireworksPool(){

    },

    changeState(stateIndex){
        cc.info("state  "+stateIndex);
        var setState = this._states[stateIndex];
   
        if(this._currState != null){
            this._currState.onExit();
        }
        if(setState != null){
            setState.onEnter();
        }else{
            cc.error('setState null ' + stateIndex);
            
        }
        this._currState = setState;
    },

    initStage(){
        if(this._resumedGame){
            this._resumedGame = false;
        }else{
            this._stage++;
        }

        this._hasTouchTriggered = true;
        this._didDisplayStageClear = false;
        this.clear();
        this.updateScore();
        this.initStageLabels();

    },
    resetGame()
    {
        this._score = 0;
        
        this._visualScore = 0;
        this._updateHiScore = false;
        this._stage = -1;
        
        this.updateScore();
       
        this.clear();
  
    },
    hideScoreBoard(){

        this.stageLable.enabled = false;
        this.currScoreLable.enabled = false;
        this.targetScoreLable.enabled = false;
    },
    showScoreBoard(){
        this.stageLable.enabled = true;
        this.currScoreLable.enabled = true;
        this.targetScoreLable.enabled = true;
    },

    addTitle(){
        this.title.enabled = true;
        this.tip.enabled = true;
    },
    showTitle(){
        this.title.node.runAction(new cc.fadeIn(1));
        this.tip.node.runAction(new cc.fadeIn(1));
    },

    removeTitle(){
        this.title.enabled = false;
        this.tip.enabled = false;
    },

    hideTitle()
    {
        this.title.node.runAction(new cc.fadeOut(1));
        this.tip.node.runAction(new cc.fadeOut(1));
    },
    goToGamePlay()
    {
        this.showHighScore(false);	
    },
    showHighScore(show)
    {
        this.hightScoreLable.enabled = show;
    }, 
    update (dt) {
        if(this._currState != null){
            this._currState.onUpdate(dt);
        }else {
            cc.info('this._currState null ');
        }
        this.updateScore();

        this._frameCnt++;
    },

    destroyRemainingBlocks(){
        return this.playState.destroyRemainingBlocks();
    },

    getBonus( blocks)
    {
        var bonus = Const.MAX_BONUS - blocks * blocks * 20;
        if( bonus < 0 ) bonus = 0;

        return bonus;
    },

    destroyBlocksImmediately(){
        this.playState.destroyBlocksImmediately();
    },

    isStageCleared(){
        return this._score >= this.getClearScore();
    },

    displayStageClear(){
        cc.info("displayStageClear");
    },

    initStageLabels(){
        this.stageLable.string = "关卡:" + (this._stage + 1) ;
        this.targetScoreLable.string = "目标分数:"+ this.getClearScore();
    }, 

    updateScore()
    {
        if(isNaN(this._score)){
            cc.error("this.this._score  ......................")
        }        
        if( this._score == 0 ) {
            this._visualScore = 0;
        } else {
            var step = (this._score - this._visualScore) * 0.04;
            if(Math.abs(step) < 0.05) {
                step = 0.05 * ((step > 0)?1:-1);
            }
            this._visualScore += step;
            if (Math.abs(this._score-this._visualScore) < 0.1) {
                this._visualScore = this._score;
                if(isNaN(this._visualScore)){
                    cc.error("this._visualScore  ..........2222222222............")
                }                
            }
        }
        this.currScoreLable.string = Math.floor(this._visualScore)+"";
        if(isNaN(this._visualScore)){
            cc.error("this._visualScore  ......................")
        }
    },

    getClearScore()
    {
        if(this._stage < Const.kMaxStage)
        {
            return Const.ClearScore[this._stage];
        }

        var gap = 4000;
        return Const.ClearScore[Const.kMaxStage-1] + gap * (this._stage - Const.kMaxStage + 1);
    },

    //----------------------block----------------------
    clear() {
        for( var i = Const.MAX_ROW - 1; i >= 0; --i ) {
            for( var j = 0; j < Const.MAX_COLUMN; ++j ) {
                if( this.blocks[i][j] != null ) {
                    
                    this.blocks[i][j].node.destroy();
                    //removeChild(_blocks[i][j], false);

                    this.blocks[i][j] = null;
                }
            }
        }
    },
    creatBlocks(){        
       var max_row = Const.MAX_ROW; //最大行
       var max_col = Const.MAX_COLUMN;//最大列
       for(var i = max_row - 1; i >= 0; --i){
           for(var j = 0; j < max_col; ++j){
               var block = this.createBlockAtRow(i, j, this.rand(100000) % Const.blockColor.kMaxBlockColor);
               block.movePos = block.position;
               block.position = new cc.Vec2(block.position.x,block.position.y + 400 + i * 60 + j * 5 + this.rand( 50 ) );
               block.state = Const.blockState.kMove;
           }
       }
    },

    rand( n ){
        return ( Math.floor ( Math.random ( ) * n + 1 ) );
    },

   createBlockAtRow(row,column,color){
        var block = this.getBlock(color)
        this.setBlockAtRow( row, column, block );
        var pos = this.originBlockPositionAtRow(row,column);
        block.setPosition(pos) 
        return block;
    },

    getBlock(color){
        var array = this.unUseBlockdic[color];
        if(array != null){
            if(array.length > 0){
                var block = array.pop();
                block.node.active = true;
                block.reset();
                return block;
            }else{
                var newNode = cc.instantiate(this.blocksPrefab[color]);
                newNode.parent = this.blockRoot;
                var block = newNode.getComponent("Block")
                block.playState = this;
                block.blockColor = color                
                return block;
            }
        }else{
            cc.error('getBlock error ' + color);
        }
    },

    destroyBlock(block){
        if(block == null){
            return;
        }
        block.node.active = false;
        var array = this.unUseBlockdic[block.blockColor];
        if(array != null){
            array.push(block);
        }else{
            this.unUseBlockdic[block.blockColor] = new Array();
            this.unUseBlockdic[block.blockColor].push(block);
        }
    },

    setBlockAtRow( row,  column, block){
        this.blocks[row][column] = block;
        if(block != null){
            block.setPos(row,column);
            block.node.active = true;
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

    destroyRemainingBlocks()
    {
        var delayGap;

        var cnt = 0;
        for (var i = Const.MAX_ROW - 1; i >= 0; --i)
        {
            for (var j = 0; j < Const.MAX_COLUMN; ++j)
            {
                var block = this.blocks[i][j];
                if (block != null)
                {
                    block.state = Const.blockState.kDestroy;
                    delayGap = 0.2;

                    block.destroyDelay = 1.0 + (delayGap * cnt);
                    block.node.runAction(cc.blink(1.0, 10));
                    ++cnt;
                }
            }
        }
        return cnt;
    },    

    destroyBlocksImmediately()
    {
        for( var i = Const.MAX_ROW - 1; i >= 0; --i )
        {
            for( var j = 0; j < Const.MAX_COLUMN; ++j )
            {
                var block = this.blocks[i][j];
                if (block == null) continue;

                block.destroyDelay = 0.2;
            }
        }
    },
    numberOfBlocks()
    {
        var cnt = 0;
        for( var i = Const.MAX_ROW - 1; i >= 0; --i )
        {
            for( var j = 0; j < Const.MAX_COLUMN; ++j )
            {
                if( this.blocks[i][j] != null )
                {
                    cnt++;
                }
            }
        }

        return cnt;
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
    //isAnySolution
    isAnySolution(){

        var numSameBlocks;
        for( var i = Const.MAX_ROW - 1; i >= 0; --i )
        {
            for( var j = 0; j < Const.MAX_COLUMN; ++j )
            {
                var block = this.blocks[i][j];
    
                if( block == null ) continue;
    
                this.resetvisitFlags();
                numSameBlocks = this.visitSameBlocksAtRow(block.row, block.column, block.blockColor, Const.blockState.kNormal, block.selectCount);
                if( numSameBlocks >= 2 )
                {
                    return true;
                }
            }
        }
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
                      //  cc.info("block index "+ block.row + "  " + block.column);
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
                        //cc.info("destroy block index"+ block.row + "  " + block.column);
                        //block.node.destroy();
                        this.destroyBlock(block);
                       // removeChild(block, true);

                        this.blocks[i][j] = null;
    
                        if( this.isStageCleared() && this._didDisplayStageClear == false ){
                            this.displayStageClear();
                        }
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
    
    backToMainMenu()
    {
        
        this.showHighScore(true);
    // #if !defined(WP8)
    //     endHammer();
    //     enableHammer(false);
    // #endif
    },    
});
