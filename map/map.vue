<template>
    <div class="map-container">
        <div id="map-content"></div>
        <div class="btn-list">
            <div class='btn-items'>
                <p class='filter-item' key-word="地铁站,公交站">公交站</p>
                <p class='filter-item'>学校</p>
                <p class='filter-item'>医疗</p>
                <p class='filter-item'>商场</p>
                <p class='filter-item'>生活</p>
                <p class='filter-item'>其他</p>
            </div>
            <div id="result">
                <div class="map-items">
                    <div class="map-item-list" v-for="(item,index) in items" :class='{on:itemIter == index}' @click='markerChange(index)' :key='index'>
                        <i class='map-item-icon' :style='styleObj(index)'></i>
                        <div class="map-item-text">
                            <p class='map-item-title'>
                                <span>{{item.title}}</span>
                                <span class='distance'>{{item.distance}}米</span>
                            </p>
                            <p class='map-item-tip'>{{item.address}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    data(){
        return {
            items:[],
            itemIter:null,
            map:{},
            prev_index:null,
            red_marker_el:[],
            blue_marker_el:[]
        }
    },
    props:['point'],
    methods:{
        styleObj(i){
            return 'background-position:-5.5px ' +(-27.5 + -25.5 * i) + 'px';
        },
        markerChange(i){
            this.itemIter = i;
            this.emitChangeEvent(i+1);
        },
        emitChangeEvent(i){
            if(this.prev_index === null){
                this.prev_index = i-1;
            } else{
                this.red_marker_el[this.prev_index].show();
                this.blue_marker_el[this.prev_index].hide();
                this.prev_index = i-1;
            }
            var tarEl =  $('.map-item-list').eq(i-1);

            // 地图点重绘
            this.red_marker_el[i-1].hide();
            this.blue_marker_el[i-1].show();

            // 变色
            tarEl.children().eq(0).css('backgroundPositionX','-24.5px');
            tarEl.siblings().each((i,v)=>{
                $(v).children().eq(0).css('backgroundPositionX','-5.5px');
            });
            tarEl.addClass('on').siblings().removeClass('on');
            // 滑动
            var outerScroll = $('#map-content')[0].offsetTop;
            
            var HEIGHT = 333,
                view_scroll_len = $('#result').scrollTop(),
                cur_tar_scroll = tarEl[0].offsetTop - outerScroll - 41,
                el_len = tarEl[0].clientHeight;
            
            // 向下滚动逻辑
            if(cur_tar_scroll + el_len > HEIGHT + view_scroll_len){
                $('#result').animate({scrollTop:cur_tar_scroll + el_len - HEIGHT});
            }
            // 向上滚动逻辑
            if(cur_tar_scroll < view_scroll_len){
                $('#result').animate({scrollTop:cur_tar_scroll});
            }
        },
        generateIconMarker(obj,i){
            var marker = this.generateRedIcon(obj,i),
                marker_hide = this.generateBlueIcon(obj,i);

            marker.addEventListener('click',(evnet)=>{
                console.clear();
                let i = Math.floor(($(event.target).index()+1) / 2);
                
                this.emitChangeEvent(i);
            });

            marker_hide.hide();

            this.blue_marker_el.push(marker_hide);
            this.red_marker_el.push(marker);
            this.map.addOverlay(marker_hide);
            this.map.addOverlay(marker);
        },
        generateRedIcon(obj,i){
            return new BMap.Marker(new BMap.Point(obj.lng, obj.lat), {
                icon: new BMap.Icon(obj.url, new BMap.Size(18, 26),{
                    offset: new BMap.Size(10, 26),
                    imageOffset: new BMap.Size(-7, -27.5 - i * 25.5)
                })
            });
        },
        generateBlueIcon(obj,i){
            return new BMap.Marker(new BMap.Point(obj.lng, obj.lat), {
                icon: new BMap.Icon(obj.url, new BMap.Size(20, 26),{
                    offset: new BMap.Size(10, 26),
                    imageOffset: new BMap.Size(-24.5, -27.5 - i * 25.5)
                })
            });
        }
    },
    mounted(){
        // 地图生成
        var map = new BMap.Map("map-content", {
            enableMapClick: false
        });
        this.map = map;
        var ROOT_POINT = new BMap.Point(this.point[0], this.point[1]);
        map.centerAndZoom(ROOT_POINT, 16);
        map.addControl(new BMap.NavigationControl());
        map.addControl(new BMap.ScaleControl());
        map.enableScrollWheelZoom();
        // 圆圈
        var circle = new BMap.Circle(ROOT_POINT, 500, {
            fillColor: '#fff',
            strokeColor: "#80bfde",
            strokeWeight: 2,
            strokeOpacity: 0.1,
            enableMassClear:false,
        });
        map.addOverlay(circle);
        // 自定义中心点
        var marker = new BMap.Marker(ROOT_POINT, {
            icon: new BMap.Icon(require("../../assets/poi.png"), new BMap.Size(20,20), {
                imageSize: new BMap.Size(15, 20)
            }),
            enableClicking: false,
            enableMassClear:false,
        });
        map.addOverlay(marker);

        var local = new BMap.LocalSearch(map, {
            renderOptions: {
                autoViewport: false,
                selectFirstResult: false
            },
            onSearchComplete: (result) => {
                // 判断状态是否正确
                if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                    let len = result.getCurrentNumPois(),rsl = [];
                    if(!len){return;}
                    for(let i=0;i<len;i++){
                        rsl.push(result.getPoi(i));
                    }
                    this.red_marker_el = [];
                    this.blue_marker_el = [];
                    
                    rsl.forEach((el,i) => {
                        this.generateIconMarker({
                            lat:el.point.lat,
                            lng:el.point.lng,
                            url:require('../../assets/order.png'),
                        },i);
                        el.distance = (map.getDistance(ROOT_POINT,new BMap.Point(el.point.lng, el.point.lat)))|0;
                    });
                    this.items = rsl;
                }
            }
        });
        // 右侧点击刷新面板重新填充数据
        $('.filter-item').on('click', (e) => {
            var tar = e.target;
            this.itemIter = null;
            this.items = [];
            map.clearOverlays();
            $(tar).addClass('on').siblings().removeClass('on');
            local.searchNearby(tar.textContent, ROOT_POINT, 500);
        });
        $('.filter-item').eq(0).click();
    }
}
</script>

<style lang="less">
    // 地图
    #map-content {
        height: 372px;
        width: 602px;
        float: left;
    }

    // 地图上方按钮
    .btn-list {
        height: 372px;
        float: left;
        width: 378px;
        .btn-items {
            overflow: hidden;
            width: 100%;
            text-align: center;
            p {
                float: left;
                padding: 10px 5px;
                width: 16.6%;
                font-size: 14px;
                background-color: #f1f1f1;
                cursor: pointer;
                &.on{
                    background-color: #fff;
                    color:#88ba4a;
                }
            }
        }

        ::-webkit-scrollbar {
            width:12px; 
            height:16px; 
            overflow:visible;
        }
        ::-webkit-scrollbar-track {
            background-clip: padding-box;
            border: solid transparent;
            border-width: 0 0 0 7px;
            border-radius: 8px;
        }
        ::-webkit-scrollbar-track:hover {
            background-clip: padding-box;
            background-color: #dcdcdc;
            border: solid transparent;
        }
        ::-webkit-scrollbar-corner {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background-color:rgba(0,0,0,.25);
            background-clip:padding-box;
            border:solid transparent;
            min-height:28px;
            padding:100px 0 0;
            box-shadow:inset 1px 1px 0 rgba(0,0,0,.1),inset -1px -1px 0 rgba(0,0,0,.07);
            border-radius:8px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0,0,0,.3);
            background-position: -10px center;
        }
        ::-webkit-scrollbar-thumb:active {
            background-color: rgba(0,0,0,.4);
            background-position: -20px center;
        }
    }

    // 地图数据显示
    #result {
        height: 333px;
        transition: all .5s;
        overflow: auto;
        .map-items {
            padding: 0 40px;
            height: 100%;
            .map-item-list {
                overflow: hidden;
                padding:15px 0;
                border-bottom: #efefef dashed 1px;
                cursor: pointer;
                &:hover{
                    background-color: #fafafa;
                }
                &.on{
                    background-color: #fafafa;
                    .map-item-title{
                        color:#2b81ff;
                    }
                    .distance{
                        color:#2b81ff;
                    }
                }
            }
        }
    }

    .map-item-list{
        .map-item-icon{
            float: left;
            display: block;
            width: 20px;
            height: 26px;
            margin-top: 10px;
            line-height: 20px;
            text-align: center;
            background:url('../../assets/order.png') no-repeat;
        }
        .map-item-text{
            float: left;
            width: 84%;
            padding-top: 10px;
            padding-left: 10px;
            .map-item-title{
                font-size: 14px;
                line-height: 18px;
                font-weight: bold;
                .distance{
                    float:right;
                    font-weight:normal;
                    color:#2e2e2e;
                    font-size: 12px;
                }
            }
        }
        .map-item-tip{
            color:#aeaeae;
            line-height: 20px;
            padding:10px 0;
            font-size: 12px;
        }
    }
    
</style>

