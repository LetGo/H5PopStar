var Const = require('./Const.js')

//var Block = require("./Block.js")

cc.Class({
    extends: cc.Component,

    properties: {
        blocksPrefab : {
            default: [],
            type: [cc.Prefab]     // type 同样写成数组，提高代码可读性
        },     
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    update (dt) {

    },

    onEnter(){
        // var self = this;
        // cc.loader.loadRes("Prefabs/block_0", function (err, prefab) {
        //     var newNode = cc.instantiate(prefab);
        //     newNode.parent = self.node;
        // });
        this.creatBlocks()
    },

    rand ( n ){
         return ( Math.floor ( Math.random ( ) * n + 1 ) );
    },

    creatBlocks(){

         cc.info("Const.LEFT_MARGIN  "+ Const.LEFT_MARGIN);
         cc.info("Const.kBlockWidth  "+ Const.kBlockWidth);
         
        var max_row = Const.MAX_ROW; //最大行
        var max_col = Const.MAX_COLUMN;//最大列
        for(var i = max_row - 1; i > 0; --i){
            for(var j = 0; j < max_col; ++j){
                this.createBlockAtRow(i, j, this.rand(Const.blockColor.kMaxBlockColor - 1));
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

            cc.info(row+"  "+ column);
            
            var pos = self.originBlockPositionAtRow(row,column);
            block.setPosition(pos) 
            cc.info(pos);
    },


   originBlockPositionAtRow(row, column ){
	    return new cc.Vec2(Const.LEFT_MARGIN + Const.kBlockWidth * (column + 0.5), Const.BOTTOM_MARGIN + Const.kBlockHeight * (row + 0.5));
    },
});
