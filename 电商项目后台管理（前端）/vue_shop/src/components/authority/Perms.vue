<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="permsList" border stripe>
                <el-table-column type="index" label="#" align="center" />
                <el-table-column label="权限名称" prop="name" align="center" />
                <el-table-column label="路径" prop="path" align="center" />
                <el-table-column label="权限等级" prop="level" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                        <el-tag
                            v-else-if="scope.row.level == '1'"
                            type="success"
                            >二级</el-tag
                        >
                        <el-tag v-else type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            permsList: []
        }
    },
    created() {
        // 获取所有权限
        this.getPermsList()
    },
    methods: {
        getPermsList() {
            let req = this.$http
            req.get('/getAllPerms', {
                headers: req.requestHeaders()
            }).then((res) => {
                if (res.status !== 200 || res.data.status !== 200) {
                    return this.$message.errorMessage('获取权限信息失败!')
                }
                this.permsList = res.data.data
                // console.log(res)
            })
        }
    }
}
</script>

<style lang="less" scoped>
</style>