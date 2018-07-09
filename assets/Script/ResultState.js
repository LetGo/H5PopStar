
var Const = require('./Const.js')

cc.Class({
    extends: cc.Component,

    properties: {
        remainLable:{
            default:null,
            type:cc.Label,
        },
        bonusLLabel:{
            default:null,
            type:cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.isPaying = false;
        this.remainLable.enabled = false;
        this.bonusLLabel.enabled = false;

    },

    onEnter(){

        this.remainLable.enabled = true;
        this.bonusLLabel.enabled = true;        
        this.node.opacity = 255;
        this._isAddBonusState = false;
        this._showBonusDelay = 1;
        this._resultDelay = 0.5;
        this._addBonusDelay = 0.5;
        this._immediateDestroy = false;
        this._isPopupState = false;
        this._isShowPopup = false;
        
        this.bonusLLabel.node.scale = 0.35;
        this.bonusLLabel.string = "";

        var owner =Globle.gameMain; 
        var cnt = owner.destroyRemainingBlocks();
        this.remainLable.string = "剩余 " +cnt+ " 个星星";

        this.remainLable.node.runAction(new cc.blink(1,10));

       
        owner.numBlocksRemaining = cnt;

        this._curBlocksRemaining = cnt;

        owner.bonusGained =  owner.getBonus(cnt);

        owner.scoreBeforeResult = owner.score;

    },

    onExit(){
        this.node.opacity = 0;
    },

    onUpdate(dt){

        if(this._isPopupState)
            return;
        var owner = Globle.gameMain; 
        owner.updateBlocks(dt);

        var numBlocks = owner.numberOfBlocks();
        var minusCnt = owner.numBlocksRemaining - numBlocks;
        var bonusGained = owner.getBonus(minusCnt);
        cc.info(numBlocks + " minusCnt " + minusCnt+" " + bonusGained);

        if (bonusGained < 0){
            bonusGained = 0;
        }

        var _bonusLabel = this.bonusLLabel;

        if(!this._isAddBonusState){
            if (this._curBlocksRemaining != numBlocks)
            {
                this._curBlocksRemaining = numBlocks;

                _bonusLabel.string = "奖励  "+ bonusGained;
                _bonusLabel.node.runAction(new cc.sequence(new cc.scaleTo(0.05,1.2),new cc.scaleTo(0.05,1)));
               // _bonusLabel->resetTransformAnchor();
            }
    
            // destroy all blocks immediately if too much blocks remaining
            if( bonusGained == 0 && !this._immediateDestroy )
            {
                owner.destroyBlocksImmediately();
                this._immediateDestroy = true;
            }
    
            if( numBlocks == 0 )
            {
                this._showBonusDelay -= dt;
                if( this._showBonusDelay <= 0 )
                {
                    this._isAddBonusState = true;
                    cc.info(" bonusGained " + bonusGained);
                    if( bonusGained > 0 )
                    {
                        var move = new cc.moveTo(0.3,new cc.Vec2(_bonusLabel.node.position.x,100));
                        var easy1 = move.easing(cc.easeOut(0.3));
                        _bonusLabel.node.runAction(easy1);
                        _bonusLabel.node.runAction(new cc.scaleTo(0.3,1));
    
                        //owner->createFireworks(5 + 20 * bonusGained/ Const.MAX_BONUS, 0);
                        //owner->playApplauseSound();
                    }
                    else
                    {
                        this._addBonusDelay = 0;
                    }
                }
            }
        }else{
            this._addBonusDelay -= dt;
            if(  this._addBonusDelay <= 0 )
            {
                if( owner.bonusGained > 0 )
                {
                    var amountAdding = Math.ceil(owner.bonusGained * 0.15);
                    if( amountAdding < 1 )
                    {
                        amountAdding = owner.bonusGained;
                    }
    
                    // add bonus score
                    owner.score = owner.score + amountAdding;
                    owner.bonusGained = owner.bonusGained - amountAdding;
                    cc.info('owner.bonusGained '+ owner.bonusGained)
                    
                    _bonusLabel.string = "奖励  "+ owner.bonusGained;
    
                    owner.updateScore();
    
                    if( owner.isStageCleared() && owner.didDisplayStageClear == false ){
                        owner.displayStageClear();
                    }
                }
            }

            if( owner.bonusGained <= 0 && owner.visualScore == owner.score && !this.isPaying)
            {
                this._resultDelay -= dt;
                if( this._resultDelay <= 0 )
                {
                    if( owner.isStageCleared())
                    {
                        cc.info(" 通关成功");
                        if (!this._isShowPopup)
                        {
                            var stage = owner.stage +1;

                            if(stage <= 30 || (stage <= 100 && stage % 5 == 0))
                            {
                                // CCString *eve = CCString::createWithFormat("完成关卡%d ",stage);
                                // MainLayer::trackEvent(eve->getCString());
                            } else if(stage > 100){
                                //MainLayer::trackEvent("完成关卡101以后 ");
                            }
                            this._retryCount = 0;

                            owner.changeState(Const.gameState.kStage);
 
                        }
                    }else{
                        cc.info(" 通关失败");
                        owner.changeState(Const.gameState.kGameOver);
                    }
                }
            }else{
                //TODO
                cc.info(" 通关失败" + owner.bonusGained +"  " + owner.visualScore +"  " + owner.score);
                owner.changeState(Const.gameState.kGameOver);
            }
        }
    },

});
