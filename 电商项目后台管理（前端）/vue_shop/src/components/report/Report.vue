<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 2. 为Echarts准备一个具备大小(宽高)的Dom -->
            <div id="main" style="width: 750px; height: 400px"></div>
        </el-card>
    </div>
</template>
<script>
// 1. 导入echarts
import * as echarts from 'echarts';

export default {
    data() {
        return {}
    },
    created() {},
    // 3. 只要执行到mounted函数时,页面上的元素已经被渲染完毕了
    mounted() {
        var myChart = echarts.init(document.getElementById('main'))

        // 发起请求...

        // 4. 准备数据和配置项
        // 使用lodash合并对象 const result = lodash.merge(data,model)
        var option = {
            title: {
                text: '用户来源'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#E9EEF3'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                data: ['销量']
            },
            xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
                boundaryGap: true
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }
            ]
        }

        // 5. 使用刚指定的配置项和数据显示图表
        myChart.setOption(option)
    },
    methods: {},
    computed: {}
}
</script>
<style lang='less' scoped>
</style>