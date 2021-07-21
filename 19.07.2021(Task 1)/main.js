function setBeginnerMode(){
    const level = 5;
    setAllLevel(level);
}

function setGoodDriverMode(){
    const level = 3;
    setAllLevel(level);
}

function setManiacMode(){
    const level = 1;
    setAllLevel(level);
}

function setAllLevel(level){
    setABS(level);
    setTraction(level);
    setStability(level);
}



function setABS(num) { console.log(`ABS:${num}`) }
function setTraction(num) { console.log(`Traction Control:${num}`) }
function setStability(num) { console.log(`Stability Control:${num}`) }