
cc.Class({
    extends: cc.Component,

    properties: {
        newGameBtn:{
            default:null,
            type:cc.Button,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       
        //这里一定要用self，因为注册里的this代表的就不是这个this了
        var self = this;
        self.newGameBtn.node.on(cc.Node.EventType.TOUCH_END,function(event){
             self.newGameBtn.node.runAction(cc.blink(0.8,10))
        });
            
    },

    start () {

    },

    // update (dt) {},
});
