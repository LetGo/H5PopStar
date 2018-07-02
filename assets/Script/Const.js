

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
    MAX_COLUMN:10,
    MAX_ROW:10,
    gameState:GameState,
    blockColor:BlockColor,
};


module.exports = Const;