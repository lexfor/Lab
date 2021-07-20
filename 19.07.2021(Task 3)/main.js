function crasher(a) {
    delete a.bla;
}

const a = {
    bla: 'bla',
};

// начало блока изменений
function temp() {
    let b = {};
    Object.assign(b,a);
    crasher(b);
    console.log(a);
}
// конец блока изменений

