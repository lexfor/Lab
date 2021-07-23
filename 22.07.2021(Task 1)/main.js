function switchLamps(N, P) {
    let lamps = [];

    for(let i = 0;i < N; i++){
        lamps[i] = -1;
    }

    for(let i of P){
        for(let j = i - 1; j < N; j += i){
            lamps[j] *= -1;
        }
    }

    lamps.sort();
    let numberOfActiveLamps = lamps.indexOf(1);
    numberOfActiveLamps = N - numberOfActiveLamps;
    return numberOfActiveLamps;
}

console.time("start");
console.log(switchLamps(172, [19, 2, 7, 13, 40, 23, 16, 1, 45, 9]));
console.timeEnd("start")