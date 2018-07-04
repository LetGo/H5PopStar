

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

var Const ={
    kScreenWidth:320,
    kScreenHeight:480,
   
    kBlockWidth:32,
    kBlockHeight:32,


    LEFT_MARGIN:0,
    BOTTOM_MARGIN:0,

    MAX_COLUMN:10,
    MAX_ROW:10,
    kPlateWidth:0,//(kBlockWidth * MAX_COLUMN),
    kPlateHeight:0,//(kBlockHeight * MAX_ROW),

    gameState:GameState,
    blockColor:BlockColor,

    init:function(){
        this.kPlateWidth = (this.kBlockWidth * this.MAX_COLUMN);
        this.kPlateHeight = (this.kBlockHeight * this.MAX_ROW);
        this.LEFT_MARGIN = (this.kScreenWidth - this.kPlateWidth) * 0.5;
        this.BOTTOM_MARGIN = this.LEFT_MARGIN +30;
        cc.info("-------------- Const.init  --------------- "+this.LEFT_MARGIN )
    },
};

Const.init()
 cc.info("-------------- Const.LEFT_MARGIN  --------------- "+Const.kScreenWidth )
module.exports = Const;