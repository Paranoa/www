import SparkMD5 from 'spark-md5'

/**
    @param {File} file: file元素
    @param {int} chunkSize: 分片大小，影响allChunks参数的输出
    @param {int} offset: 偏移量，表示从该字节处开始读取文件

    @return {String} md5: 文件的md5码
    @return {[Blob]]} allChunks: 以chunkSize分片的Blob数组
**/
export default function ({ file, chunkSize=2 * 1024 * 1024, offset=0 }) {
    // 偏移量超出文件大小, 直接抛出错误
    if (offset >= file.size) {
        return Promise.reject('offset too large')
    }

    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        chunks = Math.ceil((file.size - offset) / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader(),
        allChunks = []

    return new Promise((resolve, reject) => {
        fileReader.onload = function (e) {
            spark.append(e.target.result)
            currentChunk++

            if (currentChunk < chunks) {
                loadNext()
            } else {
                const md5 = spark.end()
                resolve({
                    md5,
                    allChunks
                })
            }
        }

        fileReader.onerror = function (error) {
            reject(error)
        }

        function loadNext() {
            var start = currentChunk * chunkSize + offset,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize

            var chunk = blobSlice.call(file, start, end)
            allChunks.push(chunk)
            fileReader.readAsArrayBuffer(chunk)
        }

        loadNext()
    })
}