<template>
    <div class="upload-content">
        <div class="upload-title">{{title}}</div>
        <el-upload
        :action='action'
        list-type="picture-card"
        :on-remove="remove"
        :on-success='success'
        :on-progress='progress'
        :disabled='isMax'
        :jimmy-ibd-class='hide_class'
        :jimmy-remove-tip='!delMode'
        :file-list='list'>
        <i class="el-icon-plus"></i>
        </el-upload>
    </div>
</template>
<script>
    export default {
        data: function() {
            return {
                hide_class:'',
                isMax:false,
                action:'',
            }
        },
        props: [
            'title',    // 标题
            'list', // 已上传图片集合
            'index',    // 索引
            'num',  // 上传上限
            'delMode', // true为关闭提示功能
        ],
        computed:{

        },
        watch:{
            list:function(){
                if(this.list.length === this.num){
                    this.hide_class = 'hide';
                }
            }
        },
        methods: {
            remove:function(file, fileList) {
                this.hide_class = '';
                this.$emit('upload_rev',file);
            },
            success:function(response, file, fileList){
                this.isMax = false;
                this.hide_class = '';
                if(response.code !== 0){
                    this.$message.error(response.message);
                    fileList.pop();
                    return ;
                }
                var isLt5M = file.size / 1024 / 1024 < 5;
                if(!isLt5M){
                    this.$message.error('上传图片大小不能超过 5MB!');
                    fileList.pop();
                    return ;
                }
                if(!response.data.file){
                    this.$message.error('上传失败');
                    fileList.pop();
                    return ;
                }
                if(this.num && fileList.length === this.num){
                    this.hide_class = 'hide';
                }
                file.url = response.data.file.url;
                if(this.index){
                    file.img_type = this.index;
                }
                this.$emit('upload_suc',file,fileList,this.index);
            },
            progress:function(){
                // 由于上传过程与上限判断存在时间差 一次仅允许上传一张
                this.isMax = true;
            }
        },created:function(){
            
        }
    }
</script>
<style lang="less">
    .upload-content {
        padding-bottom: 20px;
        >.upload-title {
            font-size: 16px;
            padding-bottom: 10px;
            color: #333;
        }
    }
</style>
