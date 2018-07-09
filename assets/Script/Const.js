

var GameState ={
    kMenu:0,
    kStage:1,
    kPlay:2,
    kResult:3,
    kGameOver:4,
};

var BlockColor={};
BlockColor.kRed = 0; 
BlockColor.kGreen = 1;
BlockColor.kBlue = 2;
BlockColor.kYellow = 3;
BlockColor.kPurple = 4;
BlockColor.kMaxBlockColor = 5;

var BlockState ={
    kNormal:0,
    kDestroy:1,
    kMove:2,
};

var Const ={
    ClearScore:[
        1000,
        3000,
        6000,
        8000,
        10000,
        13000,
        15000,
        17000,
        20000,
    ],

    FPS:50,
    kMaxStage:9,
    kScreenWidth:640,
    kScreenHeight:960,
   
    kBlockWidth:64,
    kBlockHeight:64,


    LEFT_MARGIN:0,
    BOTTOM_MARGIN:0,

    MAX_COLUMN:10,
    MAX_ROW:10,
    kPlateWidth:0,//(kBlockWidth * MAX_COLUMN),
    kPlateHeight:0,//(kBlockHeight * MAX_ROW),

    MAX_BONUS:2000,

    JUMP_DURATION:0.16,
    BLOCK_ROTATE_INTERVAL:0.12,
    kMaxParticleEmitter:15,
    
    gameState:GameState,
    blockColor:BlockColor,
    blockState:BlockState,

    init:function(){
        this.kPlateWidth = (this.kBlockWidth * this.MAX_COLUMN);
        this.kPlateHeight = (this.kBlockHeight * this.MAX_ROW);
        this.LEFT_MARGIN = (this.kScreenWidth - this.kPlateWidth) * 0.5;
        this.BOTTOM_MARGIN = this.LEFT_MARGIN + 30;
        this.POS_SCOREBOARD = new cc.Vec2(320,862);

        cc.info("-------------- this.BOTTOM_MARGIN --------------- "+this.BOTTOM_MARGIN )
    },
};

Const.init()

module.exports = Const;