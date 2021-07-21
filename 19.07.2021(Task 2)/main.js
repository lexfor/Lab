function change(number) {
    let variant;
    return function () {
        if(number % 5 === 0 && number !== 0){
            number /= 5;
            variant = 1;
            return number;
        }
        if(number % 7 === 0 && number !== 0){
            number -= 7;
            variant = 2;
            return number;
        }
        switch (variant){
            case 1:
                number+= 3;
                return number;
            case 2:
                number+= 1;
                return number;
            default:
                number +=2;
                return number;
        }
    }
}

function start() {
    let func = change(+document.getElementById("number").value);
    for(let i = 0;i < 20;i++){
        console.log(func());
    }
}