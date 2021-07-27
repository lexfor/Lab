function calculateMaxBookPages(chapterPages, maxBooksCount) {
    let pagesAmount = chapterPages.reduce((sum, current) => sum + current, 0);
    let maxPagesForBook = pagesAmount / maxBooksCount;
    let books = [];

    let isAnswer = false;
    while (!isAnswer){
        isAnswer = true;
        let lastBook = chapterPages.reduce((pagesInCurrentBook, pagesInCurrentChapter) => {
            pagesInCurrentBook += pagesInCurrentChapter;
            if(pagesInCurrentBook <= maxPagesForBook){
                return pagesInCurrentBook;
            }else{
                pagesInCurrentBook -= pagesInCurrentChapter;
                if(books.length + 1 === maxBooksCount) {
                    books.length = 0;
                    isAnswer = false;
                    return 0;
                }else{
                    books.push(pagesInCurrentBook);
                    return pagesInCurrentChapter;
                }
            }
        },0);

        if(isAnswer){
            books.push(lastBook);
        }else{
            maxPagesForBook++;
        }
    }
    return Math.max(...books);
}

console.time("start");
console.log(calculateMaxBookPages([1, 2, 1], 2));
console.timeEnd("start");