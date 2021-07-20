function Beginner(){
    setAllLevel.call(null, 5);
}

function Good_driver(){
    setAllLevel.call(null, 3);
}

function Maniac(){
    setAllLevel.call(null, 1);
}

function setAllLevel(level){
    setABS(level);
    setTraction(level);
    setStability(level);
}



function setABS(num) { console.log(`ABS:${num}`) }
function setTraction(num) { console.log(`Traction Control:${num}`) }
function setStability(num) { console.log(`Stability Control:${num}`) }