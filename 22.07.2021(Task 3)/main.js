function calculateTimeForCopy(totalCopies, firstOneCopyTime, secondOneCopyTime) {
    let copyCenter = {};
    copyCenter.totalTime = 0;
    copyCenter.fastestPrinterTime = 0;
    copyCenter.slowestPrinterTime = 0;
    copyCenter.slowestCopiesCount = 1;
    copyCenter.leftCopies = 0;

    if(firstOneCopyTime <= secondOneCopyTime){
        copyCenter.totalTime += firstOneCopyTime;
        copyCenter.fastestPrinterTime = firstOneCopyTime;
        copyCenter. slowestPrinterTime = secondOneCopyTime;
    }else{
        copyCenter.totalTime += secondOneCopyTime;
        copyCenter.fastestPrinterTime = secondOneCopyTime;
        copyCenter.slowestPrinterTime = firstOneCopyTime;
    }
    totalCopies--;

    copyCenter.leftCopies = totalCopies;
    for(let time = 1; time < Math.ceil(totalCopies / copyCenter.fastestPrinterTime); time += copyCenter.fastestPrinterTime){
        copyCenter.leftCopies--;
        if((time / copyCenter.slowestPrinterTime) >= copyCenter.slowestCopiesCount){
            copyCenter.leftCopies--;
            copyCenter.slowestCopiesCount++;
        }
        if(copyCenter.leftCopies <= 0){
            copyCenter.totalTime += time;
        }
    }
    return copyCenter.totalTime;
}

console.time("start");
console.log(calculateTimeForCopy(4, 1, 1));
console.timeEnd("start")