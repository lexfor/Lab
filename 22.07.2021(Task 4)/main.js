function createSquare(squareSize) {
    let resultArr = [];
    let elemSumm = squareSize * (squareSize * squareSize + 1) / 2;
    const max = squareSize * squareSize;
    const position = (max + 1) / 2;
    let nums = [];
    for(let i = 1;i <= max; i++){
        nums.push(i);
    }
    for(let i = 0; i < squareSize; i++){
        resultArr.push([]);
        for(let j = 0; j < squareSize; j++){
            resultArr[i].push(0);
        }
    }
    if(squareSize % 2 !== 0){
        resultArr[ Math.floor(squareSize / 2)][Math.floor(squareSize / 2)] = position;
        nums.splice(nums.indexOf(position),1);
        resultArr[0][0] = position + squareSize;
        nums.splice(nums.indexOf(position + squareSize),1);
        resultArr[0][squareSize - 1] = position - 1;
        nums.splice(nums.indexOf(position - 1),1);
        resultArr[squareSize - 1][0] = position + 1;
        nums.splice(nums.indexOf(position + 1),1);
        resultArr[squareSize - 1][squareSize - 1] = position - squareSize;
        nums.splice(nums.indexOf(position - squareSize),1);
    }
    setNums(resultArr,nums,elemSumm, squareSize);
    return resultArr;
}

function setNums(array, leftNums, elemSumm, squareSize) {
    if(checkSquare(array, elemSumm)){
        return array;
    }
    for(let i = 0; i < squareSize; i++){
        for(let j = 0; j < squareSize; j++){
            for(let k of leftNums){
                if(k === 0){
                    continue;
                }
                if(array[i][j] === 0){
                    array[i][j] = k;
                    let index = leftNums.indexOf(k);
                    let value = k;
                    leftNums[index] = 0;
                    if(setNums(array,leftNums,elemSumm,squareSize)){
                        return array;
                    }else{
                        array[i][j] = 0;
                        leftNums[index] = value;
                    }
                }
            }
        }
    }
}

function checkSquare(array, M) {
    for(let i = 0;i < array.length; i++){
        let res = array[i].reduce((sum,current) => sum + current,0);
        if(res !== M){
            return false;
        }
    }
    for(let i = 0; i < array.size;i++){
        let summ = 0;
        for(let j = 0; j < array.size();j++){
            summ += array[j][i];
        }
        if(summ !== M){
            return false;
        }
    }
    return true;
}

console.time("start");
console.log(createSquare(3));
console.timeEnd("start");