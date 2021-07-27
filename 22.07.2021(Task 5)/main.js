function findKayakAmount(weights, kayakWeight) {
    let kayakAmount = 0;
    let maxCoupleWeight = 0;
    let coupleWeights = [];
    for(let i of weights){
        for(let j of weights){
            if(i === j){
                continue;
            }else{
                if(i + j < kayakWeight){
                    if(i + j > maxCoupleWeight){
                        coupleWeights.length = 0;
                        coupleWeights.push(i);
                        coupleWeights.push(j);
                        maxCoupleWeight = i + j;
                    }
                }
            }
        }
        if(maxCoupleWeight !== 0){
            weights.splice(weights.indexOf(coupleWeights[0]),1);
            weights.splice(weights.indexOf(coupleWeights[1]),1);
            maxCoupleWeight = 0;
            coupleWeights.length = 0;
            kayakAmount++;
        }
    }
    kayakAmount += weights.length;
    return kayakAmount;
}

console.time("start");
console.log(findKayakAmount([50, 74, 60, 82], 135));
console.timeEnd("start")