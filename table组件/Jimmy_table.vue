<template>
    <div class='cpn-table'>
        <table cellspacing="0" cellpadding="0" border="0" :style='obj'>
            <tr v-for="(items,index) in tableData">
                <td class='table-title'>
                    <div class="cell" @click='getTableFloor(items[0].room_floor)'>{{items[0].room_floor}}楼</div>
                </td>
                <td v-for="item in items" @click='moreDetail(item.room_id)' :colspan='item.col'>
                    <div class="cell" :style="{background:styleObj[item.room_status-1]}" @click='getTableCell(item.room_floor,item.room_name_code,item.room_id)'>{{item.room_name_code}}</div>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
    // <td v-for="item in items" :colspan='item.col' :style="{background:styleObj[item.room_status-1]}">
    //     <el-popover ref="popover1" placement="top-start" :title="item.status" width="100" trigger="hover" :content="item.name">
    //         <div class="cell" slot='reference' @click='moreDetail(item.room_id)'>{{item.room_real_code}}</div>
    //     </el-popover>
    // </td>
    export default{
        data:function(){
            return{
                styleObj:['#ddd','#66ccff','#ffcc66','#99cc66'],
                cellData:[],
                floorData:[],
                obj:{
                    border: "1px solid #aaa",
                    margin: this.newMode ? '' : '0 auto',
                },
            }
        },
        props:['tableData','newMode','clickMode'],
        methods:{
            moreDetail:function(id){
                if(this.newMode || this.clickMode){
                    return ;
                }
                window.location.href='./ldmg_new_room_detail.html?room_id=' + id;
            },
            getTableCell:function(floor,num,id){
                if(this.clickMode){
                    this.$emit('getRoomCode',num,id);
                    return ;
                }
                if(!this.newMode){
                    return ;
                }
                this.handleClick(event.target,this.cellData,false);
                this.$emit('clickTableCell',floor,num);
            },
            getTableFloor:function(floor){
                if(!this.newMode){
                    return ;
                }
                this.handleClick(event.target,this.floorData,true);
                this.$emit('clickTableFloor',floor);
            },
            handleClick:function(tar,ar,iter){
                if(!this.newMode){
                    return ;
                }
                var i = ar.indexOf(tar);
                if(~i){
                    ar[i].style.background = iter ? '#fff' : '#ddd';
                    ar.splice(i,1);
                }else{
                    tar.style.background = iter ? '#efefef' : '#fff';
                    ar.push(tar);
                }
            },
            clearFloorData:function(){
                if(!this.newMode){
                    return ;
                }
                this.floorData.forEach(function(v){
                    v.style.background = '#fff';
                });
                this.floorData = [];
            },
            clearCellData:function(){
                if(!this.newMode){
                    return ;
                }
                this.cellData.forEach(function(v){
                    v.style.background = '#ddd';
                });
                this.cellData = [];                
            }
        },
        created:function(){
            
        }
    }
</script>
<style lang="less">
    .cpn-table{
        user-select:none;
        padding:50px 0;
        text-align:center;
    }
    tr{
        overflow: hidden;
        width: 100%;
        max-width: 100%;
        background-color: #fff;
        border: 1px solid #aaa;
        font-size: 14px;
        color: #1f2d3d;
        >.table-title{
            background:#fff;
        }
        >td{
            box-sizing: border-box;
            position: relative;
            height: 40px;
            min-width: 48px;
            text-overflow: ellipsis;
            vertical-align: middle;
            border-top: 1px solid #aaa;
            border-right: 1px solid #aaa;
            border-bottom: 1px solid #aaa;
            text-align: center;
            margin-top:-1px;
            .cell{
                height:40px;
                padding: 0 7px;
                box-sizing: border-box;
                text-overflow: ellipsis;
                white-space: normal;
                word-break: break-all;
                line-height: 40px;
            }
        }           
    }
</style>