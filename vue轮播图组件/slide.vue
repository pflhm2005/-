<template>
    <div class='slide-content'>
        <div class='slide-top'>
            <div class='big-pic'>
                <img :src='mainPic'/>
            </div>
        </div>
        <div class='slide-bottom'>
            <ul class='pic-list'>
                <div :style='transXObj' class='list-content clearfix'>
                    <li class='list-item' v-for="(item,index) in imgData" :key='index'><img @click='changeIter(index)' :class='{on:iter === index}' :src='item.url'/></img></li>
                </div>
            </ul>
            <div class='btn btn-left' @click='prev'><i class='el-icon-arrow-left'></i></div>
            <div class='btn btn-right'@click='next'><i class='el-icon-arrow-right'></i></div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['imgData','transX'],
        data() {
            return {
                iter: 0,
            }
        },
        computed: {
            mainPic: function() {
                if(this.imgData[this.iter]){
                    return this.imgData[this.iter].url;
                }
                return '../img/default.jpg';
            },
            transXObj: function() {
                if (this.iter > 2) {
                    return 'transform:translateX(-' + (this.iter - 2) * this.transX + 'px)';
                }
            }
        },
        methods: {
            changeIter: function(i) {
                this.iter = i;
            },
            prev: function() {
                if (this.iter === 0) {
                    return;
                }
                this.iter--;
            },
            next: function() {
                if (this.iter === this.imgData.length - 1) {
                    return;
                }
                this.iter++;
            }
        },
        created() {

        }
    }
</script>
<style lang='less'>
    .slide-content {
        user-select: none;
    }
    
    .big-pic {
        height: 400px;
        >img {
            width: 100%;
            height: 100%;
        }
    }
    
    .pic-list {
        margin: 0 40px;
        overflow: hidden;
    }
    
    .list-content {
        position: relative;
        transition: all .3s;
    }
    
    .list-item {
        float: left;
        width: 20%;
        height: 60px;
        padding: 0 5px;
        >img {
            width: 100%;
            height: 100%;
            cursor: pointer;
            opacity: .5;
            &.on {
                opacity: 1;
            }
        }
    }
    
    .slide-bottom {
        margin-top: 5px;
        position: relative;
    }
    
    .btn {
        position: absolute;
        background-color: rgba(0, 0, 0, .5);
        color: white;
        height: 100%;
        line-height: 60px;
        text-align: center;
        width: 5%;
        top: 0;
        transition: all .5s;
        cursor: pointer;
        &:hover {
            background-color: rgba(0, 0, 0, 1);
        }
    }
    
    .btn-right {
        right: 0;
    }
</style>