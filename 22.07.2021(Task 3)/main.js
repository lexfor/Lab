function calculateTimeForCopy(totalCopies, firstOneCopyTime, secondOneCopyTime) {
    let totalTime = 0;
    let fastestPrinterTime, slowestPrinterTime;
    let slowestCopiesCount;
    let leftCopies;

    if(firstOneCopyTime <= secondOneCopyTime){
        totalTime += firstOneCopyTime;
        fastestPrinterTime = firstOneCopyTime;
        slowestPrinterTime = secondOneCopyTime;
    }else{
        totalTime += secondOneCopyTime;
        fastestPrinterTime = secondOneCopyTime;
        slowestPrinterTime = firstOneCopyTime;
    }
    totalCopies--;

    slowestCopiesCount = 1;
    leftCopies = totalCopies;
    for(let time = 1; time < Math.ceil(totalCopies / fastestPrinterTime); time += fastestPrinterTime){
        leftCopies--;
        if((time / slowestPrinterTime) >= slowestCopiesCount){
            leftCopies--;
            slowestCopiesCount++;
        }
        if(leftCopies <= 0){
            totalTime += time;
        }
    }
    return totalTime;
}

console.time("start");
console.log(calculateTimeForCopy(4, 1, 1));
console.timeEnd("start")