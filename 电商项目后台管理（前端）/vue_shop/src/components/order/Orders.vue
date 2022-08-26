<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片试图区域 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input
                        placeholder="请输入内容"
                        class="input-with-select"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                        ></el-button> </el-input
                ></el-col>
            </el-row>

            <!-- 表格区域 -->
            <el-table :data="ordersList" border stripe>
                <el-table-column type="index" label="#" align="center" />
                <el-table-column
                    label="订单编号"
                    prop="orderNumber"
                    align="center"
                />
                <el-table-column
                    label="订单价格($)"
                    prop="orderPrice"
                    align="center"
                />
                <el-table-column
                    label="是否付款"
                    prop="payStatus"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-tag
                            type="success"
                            v-if="scope.row.payStatus === '1'"
                            >已付款</el-tag
                        >
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="是否发货"
                    prop="sendStatus"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-tag
                            type="success"
                            v-if="scope.row.sendStatus === '1'"
                            >已发货</el-tag
                        >
                        <el-tag type="danger" v-else>未发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="下单时间"
                    prop="createTime"
                    align="center"
                />
                <el-table-column label="操作" prop="orderNumber" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            class="el-icon-edit"
                            size="mini"
                            @click="showEditAddrBox"
                        >
                        </el-button>
                        <el-button
                            type="success"
                            class="el-icon-location"
                            size="mini"
                            @click="showProgressBox(scope.row.id)"
                        >
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>

            <!-- 修改地址的对话框 -->
            <el-dialog
                title="修改地址"
                :visible.sync="addressVisible"
                width="50%"
                @close="addressDialogClosed"
            >
                <el-form
                    :model="addressForm"
                    :rules="addressFormRules"
                    ref="addressFormRef"
                    label-width="100px"
                >
                    <el-form-item label="省市区/县" prop="address">
                        <el-cascader
                            :options="cityData"
                            v-model="addressForm.address"
                            :props="addressProp"
                            @change="handleChange"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="detailedAddress">
                        <el-input
                            v-model="addressForm.detailedAddress"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addressVisible = false"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>

            <!-- 展示物流进度的对话框 -->
            <el-dialog
                title="物流进度"
                :visible.sync="progressVisible"
                width="50%"
            >
                <!-- timeline 时间线 -->
                <el-timeline>
                    <el-timeline-item
                        v-for="(activity, index) in progressesList"
                        :key="index"
                        :timestamp="activity.time"
                    >
                        {{ activity.context }}
                    </el-timeline-item>
                </el-timeline>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
import cityData from './citydata.js'
export default {
    data() {
        return {
            queryInfo: {
                query: '',
                pageNum: 1,
                pageSize: 10
            },
            // 订单列表总数
            total: 0,
            // 订单列表
            ordersList: [],
            // 控制修改地址的对话框
            addressVisible: false,
            // 控制物流的对话框
            progressVisible: false,
            addressForm: {
                address: [],
                detailedAddress: ''
            },
            // 地址表单校验规则对象
            addressFormRules: {
                address: [
                    {
                        required: true,
                        message: '请选择省市区县!',
                        trigger: 'blur'
                    }
                ],
                detailedAddress: [
                    {
                        required: true,
                        message: '请填写详细地址!',
                        trigger: 'blur'
                    }
                ]
            },
            // 城市数据
            cityData: cityData,
            // 物流进度列表
            progressesList: [],
            addressProp: {
                label: 'label', // 看到的属性,列表中对象属性的名称
                value: 'value', // 选中的值
                children: 'children', // 父子节点的嵌套
                expandTrigger: 'hover' // 悬浮时展开
            }
        }
    },
    created() {
        this.getOrdersList()
    },
    methods: {
        // 获取订单列表
        async getOrdersList() {
            const { data: res } = await this.$http.get('/getAllOrders', {
                params: {
                    query: this.queryInfo.query,
                    pageNum: this.queryInfo.pageNum,
                    pageSize: this.queryInfo.pageSize
                }
            })
            if (res.status !== 200) {
                return this.$message.errorMessage('获取订单列表失败!')
            }
            this.total = res.total
            this.ordersList = res.data
            console.log(res.data)
        },
        // 监听分页大小事件
        handleSizeChange(newPageSize) {
            this.queryInfo.pageSize = newPageSize
            this.getOrdersList()
        },
        // 监听页码值事件
        handleCurrentChange(newPageNum) {
            this.queryInfo.pageNum = newPageNum
            this.getOrdersList()
        },
        // 展示修改地址的对话框
        showEditAddrBox() {
            this.addressVisible = true
        },
        // 关闭地址对话框
        addressDialogClosed() {
            this.$refs.addressFormRef.resetFields()
        },
        // 根据订单id查询物流进度
        async showProgressBox(id) {
            const { data: res } = await this.$http.get(
                `/getAllProgresses/${id}/order`
            )
            if (res.status !== 200) {
                return this.$message.errorMessage('获取物流进度失败!')
            }
            // 赋值进度数组
            this.progressesList = res.data
            this.progressVisible = true
        },
        // 地址级联选择触发事件
        handleChange() {
            console.log(this.addressForm.address)
        }
    },
    computed: {}
}
</script>
<style lang='less' scoped>
.el-cascader {
    width: 100%;
}
</style>