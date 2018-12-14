(function process(){
    function RequestPagingStorage(blockCount, method, sInstructions){
        this.block = [];
        for (let i = 0; i < blockCount; i++){
            this.block.push(null);
        }
        this.instructions = sInstructions.split(" ").map(function (item) {
            return {
                content: parseInt(item),
                block: Math.floor(parseInt(item)/10)
            };
        });
        this.curReqId = 0;
        this.lossCount = 0;
        this.method = method;
    }
    RequestPagingStorage.prototype.getRequest = function getRequest(){
        console.log("********** No."+(this.curReqId+1)+" **********");
        let curInstr = this.instructions[this.curReqId];
        console.log(curInstr);
        let curReq =  curInstr.content;
        let curBlock = curInstr.block;
        let book = 0;
        for (let i = 0; i < this.block.length; i++){
            if (this.block[i] && this.block[i].content == curBlock){
                this.block[i].accessedTime ++;
                console.log("Current address: " + curBlock + "\n\n");
                book++;
                break;
            }else if(this.block[i] == null){
                this.block[i] = {
                    content: curBlock,
                    next: 99999,
                    accessedTime: 1
                };
                console.log("Add to memory, current address: " + curBlock + "\n\n");
                book++;
                break;
            }
        }
        if (!book){
            //缺页次数增加
            this.lossCount++;

            let resultItem = null;
            switch (this.method){
                case "OPT":
                    resultItem = this.opt();
                    break;
                case "FIFO":
                    resultItem = this.fifo();
                    break;
                case "LRU":
                    resultItem = this.lru();
            }

            //页面置换
            this.block[resultItem].content = this.instructions[this.curReqId].block;
            this.block[resultItem].next = 99999;
            this.block[resultItem].accessedTime = 1;
            console.log("Loss Page! Loss times:" + this.lossCount + "\n");
            console.log("Current address: " + curBlock + "\n\n");
        }
        this.curReqId++;
    };
    RequestPagingStorage.prototype.opt = function opt(){
        let i = (this.curReqId+1);
        let equalty = [];
        equalty.length = this.block.length;
        equalty.count = 0;
        while(equalty.count < this.block.length && i != this.instructions.length){
            for (let j = 0; j < this.block.length; j++){
                if (!equalty[j] && this.instructions[i].block == this.block[j].content){
                    this.block[j].next = i;
                    equalty[j] = true;
                    equalty.count ++;
                }
            }
            i++;
        }
        let maxItem = null;
        let maxNum = 0;
        for (let k = 0; k < this.block.length; k++){
            if (this.block[k].next > maxNum){
                maxItem = k;
                maxNum = this.block[k].next;
            }
        }
        return maxItem;
    };
    RequestPagingStorage.prototype.fifo = function fifo(){
        return this.lossCount%4;
    };
    RequestPagingStorage.prototype.lru = function lru(){
        let minItem = null;
        let minNum = 0;
        for (let k = 0; k < this.block.length; k++){
            if (this.block[k].accessedTime < minNum){
                minItem = k;
                minNum = this.block[k].accessedTime;
            }
        }
        return minNum;
    };
    RequestPagingStorage.prototype.start = function start () {
        while (this.curReqId != this.instructions.length){
            this.getRequest();
        }
        console.log("----------------------------\n");
        console.log("缺页总数为 " + this.lossCount + ", 缺页率为 " + this.lossCount/this.instructions.length);
    };
    const oButton = document.getElementById("submit");
    const oOption = document.getElementById("option");
    const oMemoryBlock = document.getElementById("memoryBlock");
    const oInstructions = document.getElementById("instruction");
    oButton.onclick = function(){
        let requestPS = new RequestPagingStorage(parseInt(oMemoryBlock.value),oOption.value,oInstructions.value);
        requestPS.start();
    };
})();
