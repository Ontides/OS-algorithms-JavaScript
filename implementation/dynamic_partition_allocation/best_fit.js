"use strict";
const MemoryAlloc = (()=>{
    /**
     * 内存分配构造函数
     * @param initialMemory 初始内存
     * @param start 内存开始地址
     * @param end 内存截止地址
     * @constructor
     */
    function MemoryAlloc(initialMemory, start, end){
        this.count = 1;
        this.freeSpace = [{
            start : start,
            end: end,
            length: initialMemory
        }];
        this.taskSpace = [];
    }

    /**
     * 操作控制器
     * @param method 分配或释放
     * @param taskId 作业id
     * @param space 分配或释放的大小
     */
    MemoryAlloc.prototype.getConsole = function(method, taskId, space){
        //根据第一个参数是否是数组来判断是批量作业处理还是单个作业处理
        if (Array.isArray(arguments[0])){
            for (let i = 0 ; i < arguments[0].length; i++){
                this.getConsole.apply(this, arguments[0][i]);
            }
        }else{
            if (method == "alloc"){
                this.alloc(taskId, space);
            }else if (method == "free"){
                this.free(taskId, space);
            }else{
                console.log("Input Error!");
            }
        }
        //排序
        this.sortFreeSpace();
    };

    /**
     * 分配内存方法
     * @param taskId 作业的id
     * @param space 作业需要的内存大小
     */
    MemoryAlloc.prototype.alloc = function(taskId, space){
        //打印当前的操作数
        console.log("No."+ this.count++ +"\n");
        for (var i = 0; i < this.freeSpace.length; i++){
            if (this.freeSpace[i].length >= space){
                break;
            }
        }
        if (this.freeSpace[i].length == space){
            this.taskSpace[this.taskSpace.length].start = this.freeSpace[i].start;
            this.taskSpace[this.taskSpace.length].end = this.freeSpace[i].end;
            this.freeSpace.splice(i,1);
        }else{
            this.taskSpace[this.taskSpace.length] = {
                start: this.freeSpace[i].start,
                end: this.freeSpace[i].start + space - 1,
                length: space,
                id: taskId
            };
            this.freeSpace[i].start = this.freeSpace[i].start + space;
            this.freeSpace[i].length = this.freeSpace[i].end - this.freeSpace[i].start + 1;
        }
        this.print();
    };

    //对空闲的空间进行排序
    MemoryAlloc.prototype.sortFreeSpace = function sortFreeSpace(){
        this.freeSpace.sort(function(before,after){
            return before.length - after.length;
        });
    };


    /**
     * 释放内存方法
     * @param taskId 作业的id
     * @param space 作业需要的内存大小
     */
    MemoryAlloc.prototype.free = function(taskId, space){
        console.log("No."+ this.count++ +"\n");
        for (var i = 0; i < this.taskSpace.length; i++){
            if (this.taskSpace[i].id == taskId){
                break;
            }
        }
        let flag = 0;
        for (var j = 0; j < this.freeSpace.length; j++){
            if (this.freeSpace[j].start == (this.taskSpace[i].end+1)){
                this.freeSpace[j].start = this.taskSpace[i].start;
                this.freeSpace[j].length = this.freeSpace[j].length + this.taskSpace[i].length;
                flag ++;
            }
            if (this.freeSpace[j].end == (this.taskSpace[i].start - 1)){
                this.freeSpace[j].end = this.taskSpace[i].end;
                this.freeSpace[j].length = this.freeSpace[j].length + this.taskSpace[i].length;
                flag ++;
            }
        }
        if (!flag){
            this.freeSpace[this.freeSpace.length] = {
                start: this.taskSpace[i].start,
                end: this.taskSpace[i].end,
                length: this.taskSpace[i].length
            };
        }
        this.taskSpace.splice(i, 1);
        this.print();
    };

    //打印内存使用信息
    MemoryAlloc.prototype.print = function(){
        this.printFreeArea();
        this.printTaskArea();
        console.log("\n");
    };

    //打印空闲内存区域
    MemoryAlloc.prototype.printFreeArea = function(){
        for (let i = 0; i < this.freeSpace.length; i++){
            console.log("Free Space" + (i+1) + ": start with "+ this.freeSpace[i].start + ", end with " + this.freeSpace[i].end + " and spaceVolume is " + this.freeSpace[i].length + "\n");
        }
    };
    //打印被作业占用的内存区域
    MemoryAlloc.prototype.printTaskArea = function(){
        for (let i = 0; i < this.taskSpace.length; i++){
            console.log("Task Space" + this.taskSpace[i].id + ": start with "+ this.taskSpace[i].start + ", end with " + this.taskSpace[i].end + " and spaceVolume is " + this.taskSpace[i].length + "\n");
        }
    };

    return MemoryAlloc;
})();

//Test
(() => {
    let myMemoryAlloc = new MemoryAlloc(640, 0, 639);

    myMemoryAlloc.getConsole([
        ["alloc", 1, 130],
        ["alloc", 2, 60],
        ["free", 2, 60],
        ["alloc", 4, 200],
        ["alloc", 3, 100],
        ["free", 1, 130]
    ]);
    myMemoryAlloc.getConsole("alloc", 5, 140);
    myMemoryAlloc.getConsole("alloc", 6, 60);
    myMemoryAlloc.getConsole("alloc", 7, 50);
    myMemoryAlloc.getConsole("free", 6, 60);
})();