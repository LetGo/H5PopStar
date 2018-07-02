
var StateMachine  = function(){

};

StateMachine.prototype =  {
    
    states:[],
    currState:undefined,

    ctor:function(){

    },

    addState:function(state,stateId){
        this.states[stateId] = state;
    },

    changeState:function(stateId){
        var state = this.states[stateId];
        if(state == this.currState){
            return;
        }

        if(this.currState != undefined){
            this.currState.onExit();
        }
        state.onEnter();
        this.currState = state;
    },

    update:function(dt){
        if(this.currState != undefined){
            this.currState.onUpdate(dt);
        }
    },

    getCurrStateId:function(){
        for(var i = 0;i < states.length;i++){
            if(this.currState == states[i]){
                return i;
            }
        }
        return -1;
    }
};