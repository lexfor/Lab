function crasher(a) {
    delete a.bla;
}

const a = {
    bla: 'bla',
};

// начало блока изменений
function modifyCrasher() {
    let b = {};
    Object.assign(b,a);
    crasher(b);
}
// конец блока изменений

console.log(a);