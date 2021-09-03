const path = require('path')

module.exports = {
    entry: {
        main: path.resolve(__dirname, './Project/api/queueService.js'),
    },
    output: {
        path: path.resolve(__dirname, './Project/public'),
        filename: 'bundle.js',
    },
}
