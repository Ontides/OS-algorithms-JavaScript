(function process(){
    function PCB(id, priority, cpuTime, allTime, startBlock, blockTime, state, nextPCB){
        this.id = id;
        this.priority = priority;
        this.cpuTime = cpuTime;
        this.allTime = allTime;
        this.startBlock = startBlock;
        this.blockTime = blockTime;
        this.state = state;
        this.nextPCB = nextPCB;
    }
    PCB.prototype.getCPU = function getCPU(){
        this.priority -= 3;
        this.cpuTime ++;
        switch (this.state){
            case "ready":
                this.allTime --;
                this.startBlock = this.startBlock == -1 ? this.startBlock : (this.startBlock-1);
                if (this.startBlock == 0){
                    this.state = "blocked";
                    this.startBlock = -1;
                }
                break;
            case "blocked":
                this.blockTime --;
                if (this.blockTime == 0){
                    this.state = "ready";
                }
                break;
        }
    };
    PCB.prototype.waitCPU = function waitCPU(){
        this.priority ++;
        if (this.state == "blocked"){
            this.blockTime --;
            if (this.blockTime == 0){
                this.state = "ready";
            }
        }
    };
    function getPCBLine(firstPCB){
        var pcbLine = [];
        var nextPCB = firstPCB;
        pcbLine.push(nextPCB);
        while(nextPCB.nextPCB != null){
            nextPCB = nextPCB.nextPCB;
            pcbLine.push(nextPCB);
        }
        return pcbLine;
    }
    function getMaxPriorityPCB(pcbLine){
        var pcb = null;
        var pcbNum = null;
        var maxPriority = 0;
        for (let i = 0; i < pcbLine.length; i++){
            if (pcbLine[i].state == "ready"){
                if (pcbLine[i].priority > maxPriority){
                    maxPriority = pcbLine[i].priority;
                    pcb = pcbLine[i];
                    pcbNum = i;
                }
            }
        }
        return [pcb, pcbNum];
    }
    function oneStep(status, pcbLine){
        console.log("___________第"+status.count+"步_____________");
        status.count++;
        var result = getMaxPriorityPCB(pcbLine);
        var pcb = result[0];
        console.log(pcb);//打印当前运行pcb
        var pcbNum = result[1];
        status.runningProg = pcbNum;//获取当前运行的进程id

        for (let i = 0; i < pcbLine.length; i++){
            if (i != pcbNum){
                pcbLine[i].waitCPU();
            }else{
                pcb.getCPU();
            }
        }
        if (pcb.allTime == 0){
            if (pcbLine.length == 1){
                console.log("处理完毕");
                status.result = false;
                return;
            }else if(pcbLine.length == 2){
                status.firstPCB = pcbLine[0] == pcb ? pcbLine[1] : pcbLine[0];
            }else{
                switch (pcbNum){
                    case 0:
                        status.firstPCB = pcbLine[1];
                        break;
                    case pcbLine.length-1:
                        pcbLine[pcbLine.length-2].nextPCB = null;
                        break;
                    default:
                        pcbLine[pcbNum-1].nextPCB = pcbLine[pcbNum+1];
                        break;
                }
            }
            pcb = null;
        }
    }
    (function startToProcess(){
        var pcb4 = new PCB(4, 0, 0, 4, -1, 0, "ready", null);
        var pcb3 = new PCB(3, 29, 0, 3, -1, 0, "ready", pcb4);
        var pcb2 = new PCB(2, 30, 0, 6, -1, 0, "ready", pcb3);
        var pcb1 = new PCB(1, 38, 0, 3, -1, 0, "ready", pcb2);
        var pcb0 = new PCB(0, 9, 0, 3, 2, 3, "ready", pcb1);
        var status = {
            firstPCB: pcb0,
            runningProg: null,
            readyQueue: [],
            blockQueue: [],
            currentQueue: null,
            count: 1,
            result: true
        };
        var pcbLine = getPCBLine(status.firstPCB);
        while (status.count != 30 && status.result){
            oneStep(status, pcbLine);
            pcbLine = getPCBLine(status.firstPCB);
            console.log("当前pcb个数： "+pcbLine.length);
            console.log(" RUNNING PROG:" + status.runningProg +"\n");
        }
    })();
})();
