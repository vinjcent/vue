<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getCommoditiesList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getCommoditiesList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddCommoPage" plain>添加商品</el-button>
                </el-col>
            </el-row>

            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="#" align="center" />
                <el-table-column label="商品名称" prop="commodityName" />
                <el-table-column
                    label="商品价格(元)"
                    prop="commodityPrice"
                    align="center"
                    width="95px"
                />
                <el-table-column
                    label="商品重量"
                    prop="commodityWeight"
                    align="center"
                    width="70px"
                />
                <el-table-column
                    label="创建时间"
                    prop="createTime"
                    align="center"
                    width="185px"
                >
                    <!-- <template slot-scope="scope">
                        {{ scope.row.createTime | dataFormat }}
                    </template> -->
                </el-table-column>
                <el-table-column label="操作" align="center" width="130px">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-edit"
                        ></el-button>
                        <el-button
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            @click="removeById(scope.row.id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background
            >
            </el-pagination>

        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 查询参数对象
            queryInfo: {
                query: '',
                pageNum: 1,
                pageSize: 10
            },
            // 商品列表
            goodsList: [],
            // 查询商品总数
            total: 0
        }
    },
    created() {
        this.getCommoditiesList()
    },
    methods: {
        // 根据分页获取对应的商品列表
        async getCommoditiesList() {
            const { data: res } = await this.$http.get('/getAllCommodities', {
                params: {
                    query: this.queryInfo.query,
                    pageNum: this.queryInfo.pageNum,
                    pageSize: this.queryInfo.pageSize
                }
            })
            if (res.status !== 200) {
                return this.$message.errorMessage('获取商品列表失败!')
            }
            // console.log(res)
            // 赋值商品列表数据
            this.goodsList = res.data
            // 赋值商品列表总记录数
            this.total = res.total
        },
        // 监听分页大小
        handleSizeChange(newPageSize) {
            this.queryInfo.pageSize = newPageSize
            this.getCommoditiesList()
        },
        // 监听分页页数
        handleCurrentChange(newPageNum) {
            this.queryInfo.pageNum = newPageNum
            this.getCommoditiesList()
        },
        // 根据id删除商品
        async removeById(id) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该商品,是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch((err) => err)
            // 用户取消了该操作
            if (confirmResult !== 'confirm') {
                return this.$message.infoMessage('已取消删除!')
            }

            const { data: res } = await this.$http.delete(`/deleteCommo/${id}`)
            if (res.status !== 200) {
                return this.$message.errorMessage('删除商品失败!')
            }
            this.$message.successMessage('删除商品成功!')
            this.getCommoditiesList()
        },
        // 
        goAddCommoPage() {
            this.$router.push('/commodities/add')
        }
    },
    computed: {}
}
</script>
<style lang='less' scoped>
</style>


