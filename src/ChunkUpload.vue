<template>
    <div class="button">
        <el-button :class="className">
            <template v-if="fileName">{{ fileName }}</template>
            <template v-else>
                <slot></slot>
            </template>
        </el-button>
        <input class="file-input" ref="fileInput" :accept="acceptType" type="file" @change="change($event)">
    </div>
</template>
<script>
/**
    @prop {String} acceptType: 同input accept属性
    @prop {String} className: 将反映到el-button的class上
    @prop {Number} chunkSize: 分片大小，默认为2M

    @event change: input change
    @event success: 上传成功
    @event error: 上传过程发生错误
    @event progress: 回调上传进度(0~1)
**/
import chunkFile from 'src/utils/chunkFile'
import { quickChunkUploadGetUrl, quickChunkUpload } from 'src/api/getData-yhj'
export default {
    props: {
        acceptType: {
            type: String,
            default: ''
        },
        className: {
            type: String
        },
        chunkSize: {
            type: Number,
            default: 2 * 1024 * 1024
        }
    },
    data () {
        return {
            fileName: ''
        }
    },
    methods: {
        change (event) {
            if (event.target.files.length) {
                const file = event.target.files[0]
                if (this.isFileTypeValid(file, this.acceptType)) {
                    this.fileName = file.name
                } else {
                    event.preventDefault()
                    this.$emit('error', new Error('文件类型不合法'))
                    return
                }
            } else {
                this.fileName = ''
            }
            this.$emit('change', event)
        },
        upload (event) {
            const file = this.$refs.fileInput.files[0]
            if (!file) {
                this.$emit('error', new Error('未选择文件'))
                return
            }
            let chunks = []     // 全部分片
            let uploadData = null     // 申请上传地址信息
            
            chunkFile({     // 获取文件md5
                file
            }).then(({ md5 }) => {   // 获取上传链接与offset信息
                return quickChunkUploadGetUrl({
                    params: [{
                        fileMd5: md5,
                        fileName: file.name,
                        fileSize: file.size,
                    }]
                })
            }).then(res => {       // 根据offset信息获取文件分片
                uploadData = res.data.result[0]

                if (uploadData.url) {   // 有url,继续上传流程
                    return chunkFile({
                        file,
                        chunkSize: this.chunkSize,
                        offset: uploadData.offset || 0
                    })
                } else if(uploadData.uuid) {    // 有uuid, 以reject状态跳出流程，触发progress为1
                    this.$emit('progress', 1)
                    return Promise.reject({
                        message: '文件已上传',
                        uuid: uploadData.uuid
                    })
                }
            }).then(({ allChunks }) => {    // 分片上传文件
                chunks = allChunks

                let offset = uploadData.offset  // 用于保存每次upload之后的offset值
                this.$emit('progress', (offset / file.size).toFixed(2))
                // 单个分片上传方法
                const uploadChunk = (url, chunk) => {
                    const formData = new FormData()
                    formData.append(offset, chunk, file.name)
                    return new Promise((resolve, reject) => {
                        quickChunkUpload({
                            url,
                            params: formData
                        }).then(res => {
                            const data = res.data
                            if (data && data.offset !== 0) {    // 为0的offset表示上传失败或者文件校验错误 
                                offset = data.offset    // 更新下一次upload时的offset值
                                resolve(data)
                            } else {
                                reject(data)
                            }
                        }).catch(err => reject(err))
                    })
                }

                // 递归调用分片上传
                const upload = (url, chunks) => {
                    console.log(chunks)
                    return uploadChunk(url, chunks.pop()).then(res => {
                        this.$emit('progress', (offset / file.size).toFixed(2))
                        if(!chunks.length) {
                            return res;
                        }
                        return upload(url, chunks)
                    })
                }

                chunks.reverse()
                return upload(uploadData.url, chunks)
            }).then(res => {    // 上传完成
                this.$emit('success', {
                    type: 'success',
                    uuid: res.uuid,
                    file
                })
            }).catch(err => {   // 异常捕获
                if (err.message === '文件已上传') {  // 文件已上传依然触发success事件
                    this.$emit('success', {
                        type: 'already',
                        uuid: err.uuid,
                        file
                    })
                } else {
                    this.$emit('error', err)
                }
            })
        },
        isFileTypeValid (file, accept) {
            const extName = file.name.substring(file.name.lastIndexOf('.'))
            const accepts = accept.split(',').map(s => s.trim())
            for (const type of accepts) {
                if (type.startsWith('.')) {
                    if (type === extName) {
                        return true
                    }
                } else {
                    if (new RegExp(type).test(file.type)) {
                        return true
                    }
                }
            }
            return false
        }
    },
    created () {
        this.$on('startUpload', this.upload)
    }
}
</script>
<style scoped>
    .button { position: relative; display: inline-block; }
    .file-input { position: absolute; width: 100%; height: 100%; left: 0; top: 0; opacity: 0; cursor: pointer; font-size: 0 }
</style>