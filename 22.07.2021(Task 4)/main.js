function createSquare(N) {
    let resultArr = [];
    let M = N * (N * N + 1) / 2;
    const max = N * N;
    const position = (max + 1) / 2;
    let nums = [];
    for(let i = 1;i <= max; i++){
        nums.push(i);
    }
    for(let i = 0; i < N; i++){
        resultArr.push([]);
        for(let j = 0; j < N; j++){
            resultArr[i].push(0);
        }
    }
    if(N % 2 !== 0){
        resultArr[ Math.floor(N / 2)][Math.floor(N / 2)] = position;
        nums.splice(nums.indexOf(position),1);
        resultArr[0][0] = position + N;
        nums.splice(nums.indexOf(position + N),1);
        resultArr[0][N - 1] = position - 1;
        nums.splice(nums.indexOf(position - 1),1);
        resultArr[N - 1][0] = position + 1;
        nums.splice(nums.indexOf(position + 1),1);
        resultArr[N - 1][N - 1] = position - N;
        nums.splice(nums.indexOf(position - N),1);
    }
    setNums(resultArr,nums,M, N);
    return resultArr;
}

function setNums(array, nums, M, N) {
    for(let i = 0; i < N; i++){
        for(let j = 0; j < N; j++){
            for(let k of nums){
                if(array[i][j] === 0){
                    let temp = [];
                    Object.assign(temp,nums);
                    let tempArr = [];
                    Object.assign(tempArr,array);
                    temp.splice(temp.indexOf(k),1);
                    tempArr[i][j] = k;
                    if(setNums(tempArr,temp,M,N)){
                        console.log("1");
                        array[i][j] = k;
                        nums.splice(nums.indexOf(k),1);
                    }else{
                        console.log(array);
                    }
                }
            }
        }
        if(nums.length === 0){
            return array[i].reduce((sum, current) => sum + current, 0) === M;
        }
    }
}

console.time("start");
console.log(createSquare(3));
console.timeEnd("start");