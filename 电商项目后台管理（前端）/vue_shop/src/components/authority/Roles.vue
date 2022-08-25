<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button @click="addDialogVisible = true"
                        >添加角色</el-button
                    >
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <!-- 行内容 -->
                        <el-row
                            :class="[
                                'bdbottom',
                                i1 === 0 ? 'bdtop' : '',
                                'vcenter'
                            ]"
                            v-for="(item1, i1) in scope.row.permissions"
                            :key="item1.id"
                        >
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <!-- tag标签 -->
                                <el-tag
                                    closable
                                    @close="removePermById(scope.row, item1.id)"
                                >
                                    {{ item1.name }}
                                </el-tag>
                                <!-- 一级权限的右箭头 -->
                                <i class="el-icon-caret-right"></i>
                            </el-col>

                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环 嵌套渲染二级权限 -->
                                <el-row
                                    :class="[
                                        i2 === 0 ? '' : 'bdtop',
                                        'vcenter'
                                    ]"
                                    v-for="(item2, i2) in item1.permissions"
                                    :key="item2.id"
                                >
                                    <!-- 二级权限列 -->
                                    <el-col :span="6">
                                        <!-- tag标签 -->
                                        <el-tag
                                            type="success"
                                            closable
                                            @close="
                                                removePermById(
                                                    scope.row,
                                                    item2.id
                                                )
                                            "
                                        >
                                            {{ item2.name }}
                                        </el-tag>
                                        <!-- 二级权限的右箭头 -->
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>

                                    <!-- 三级权限列 -->
                                    <el-col :span="18">
                                        <el-tag
                                            type="warning"
                                            v-for="(
                                                item3
                                            ) in item2.permissions"
                                            :key="item3.id"
                                            closable
                                            @close="
                                                removePermById(
                                                    scope.row,
                                                    item3.id
                                                )
                                            "
                                        >
                                            {{ item3.name }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>

                <!-- 索引列 -->
                <el-table-column type="index" label="#" align="center" />
                <el-table-column label="角色名称" prop="name" align="center" />
                <el-table-column
                    label="角色描述"
                    prop="description"
                    align="center"
                />
                <el-table-column label="操作" width="300px" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            icon="el-icon-edit"
                            @click="showEditDialog(scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                            @click="removeRoleById(scope.row.id)"
                            >删除</el-button
                        >
                        <el-button
                            type="warning"
                            size="mini"
                            icon="el-icon-setting"
                            @click="showSetPermDialog(scope.row)"
                            >分配权限</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色对话框区域 -->
        <el-dialog
            title="添加角色"
            :visible.sync="addDialogVisible"
            width="50%"
        >
            <!-- 内容主题区域 -->
            <el-form
                ref="addRoleFormRef"
                :model="role"
                :rules="roleFormRules"
                label-width="90px"
                label-position="left"
            >
                <el-form-item label="角色名" prop="name">
                    <el-input v-model="role.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                    <el-input v-model="role.description"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogClosed">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改角色信息对话框区域 -->
        <el-dialog
            title="修改角色信息"
            :visible.sync="editDialogVisible"
            width="50%"
        >
            <!-- 内容主题区域 -->
            <el-form
                ref="editRoleFormRef"
                :model="editRole"
                :rules="roleFormRules"
                label-width="90px"
                label-position="left"
            >
                <el-form-item label="角色名" prop="name">
                    <el-input v-model="editRole.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                    <el-input v-model="editRole.description"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setPermDialogVisible"
            width="50%"
            @close="setPermsDialogClosed"
        >
            <!-- 树形控件 -->
            <el-tree
                :data="permsList"
                :props="treeProps"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="defkeys"
                ref="treeRef"
            ></el-tree>

            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setPermDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="allotPerms()"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 当前即将分配角色的id
            roleId: '',
            // 角色列表
            rolesList: [],
            // 权限列表
            permsList: [],
            // 树形控件的额属性绑定对象
            treeProps: {
                label: 'name', // 列表中的每个权限名
                children: 'permissions' // 列表中的每个子权限名称
            },
            // 默认选中的节点id值数组
            defkeys: [],
            role: {
                name: '',
                description: ''
            },
            editRole: {},
            // 控制编辑角色对话框显示与隐藏
            editDialogVisible: false,
            // 控制添加角色对话框显示与隐藏
            addDialogVisible: false,
            // 控制分配权限角色对话框显示与隐藏
            setPermDialogVisible: false,
            roleFormRules: {
                name: [
                    {
                        required: true,
                        message: '角色名称不能为空!',
                        trigger: 'blur'
                    }
                ],
                description: [
                    {
                        required: true,
                        message: '角色描述不能为空!',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        // 获取所有角色列表
        getRolesList() {
            let req = this.$http
            req.get('/getRolesAllInfo')
                .then((res) => {
                    if (res.status !== 200 || res.data.status !== 200) {
                        return this.$message.errorMessage('获取角色信息失败!')
                    }
                    // 绑定数据
                    this.rolesList = res.data.data
                })
                .catch((err) => {})
        },
        getPermsList() {},
        // 显示编辑角色对话框
        showEditDialog(role) {
            this.editRole = role
            this.editDialogVisible = true
        },
        // 显示编辑角色对话框
        addDialogClosed() {
            this.addDialogVisible = false
            this.$refs.addRoleFormRef.resetFields()
        },
        // 添加角色
        addRole() {
            this.$refs.addRoleFormRef.validate((valid) => {
                if (!valid) return
                let req = this.$http
                req.post('/addRole', this.role)
                    .then((res) => {
                        if (res.status !== 200 || res.data.status !== 200)
                            return this.$message.errorMessage('添加角色失败!')
                        this.$message.successMessage('添加角色成功!')
                        // 重新获取角色列表
                        this.getRolesList()
                        this.addDialogVisible = false
                    })
                    .catch((err) => {})
            })
        },
        // 更新角色
        updateRole() {
            this.$refs.editRoleFormRef.validate((valid) => {
                if (!valid) return
                let req = this.$http
                req.put('/updateRole', this.editRole)
                    .then((res) => {
                        if (res.status !== 200 || res.data.status !== 200)
                            return this.$message.errorMessage(
                                '修改角色信息失败!'
                            )
                        this.$message.successMessage('修改角色信息成功!')
                        // 关闭修改对话框
                        this.editDialogVisible = false
                    })
                    .catch((err) => {})
            })
        },
        // 根据id删除角色
        removeRoleById(id) {
            // 询问用户是否删除
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let req = this.$http
                    req.delete('/deleteRole/' + id).then((res) => {
                        if (res.status !== 200 || res.data.status !== 200)
                            return this.$message.errorMessage('删除角色失败!')
                        this.$message.successMessage('删除角色成功!')
                        // 从新获取角色列表
                        this.getRolesList()
                    })
                })
                .catch(() => {
                    return this.$message.infoMessage('已取消删除!')
                })
        },
        // 根据角色id和权限id删除角色权限
        removePermById(role, permId) {
            // 询问用户是否删除
            this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let req = this.$http
                    req.delete(`/roles/${role.id}/perms/${permId}`).then(
                        (res) => {
                            if (res.status !== 200 || res.data.status !== 200)
                                return this.$message.errorMessage(
                                    '删除权限失败!'
                                )
                            this.$message.successMessage('删除权限成功!')
                            // 需要更新当前角色的权限数据
                            role.permissions = res.data.data
                        }
                    )
                })
                .catch(() => {
                    // 捕获取消错误
                    return this.$message.infoMessage('已取消删除!')
                })
        },
        // 展示分配权限的对话框
        showSetPermDialog(role) {
            this.roleId = role.id
            let req = this.$http
            // 获取所有关联权限的数据
            req.get('/getAllRelatedPerms')
                .then((res) => {
                    if (res.status !== 200 || res.data.status !== 200) {
                        return this.$message.errorMessage('获取角色信息失败!')
                    }
                    // 绑定数据
                    this.permsList = res.data.data
                })
                .catch((err) => {})
            this.getLeafKeys(role, this.defkeys)
            // 显示对话框
            this.setPermDialogVisible = true
        },
        // 通过递归的形式,获取角色下所有三级权限的id,并保存到defKeys数组中
        getLeafKeys(node, arr) {
            if (!node.permissions) {
                // 如果当前node节点不包含permissions属性,则是三级节点
                return arr.push(node.id)
            }

            node.permissions.forEach((item) => {
                this.getLeafKeys(item, arr)
            })
        },
        // 监听分配权限对话框的关闭事件
        setPermsDialogClosed() {
            // 初始化数组
            this.defkeys = []
        },
        // 点击为角色分配权限
        allotPerms() {
            // ...代表合并数组
            const keys = [
                // 获取目前被选中的节点的 key 所组成的数组
                ...this.$refs.treeRef.getCheckedKeys(),
                // 获取目前半选中的节点的 key 所组成的数组
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]

            // const idStr = keys.join(',')     // 以","拼接数组转为字符串
            // console.log(keys)
            let req = this.$http
            req.post(`roles/${this.roleId}/perms`, req.requestData(keys, false))
                .then((res) => {
                    if (res.status !== 200 || res.data.status !== 200) {
                        return this.$message.errorMessage('添加角色权限失败!')
                    }
                    // 重新获取角色列表
                    this.getRolesList()
                    this.$message.successMessage('添加角色权限成功!')
                    this.setPermDialogVisible = false
                })
                .catch((err) => {})
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}

// 根据是否下标为0,添加头边界
.bdtop {
    border-top: 1px solid #eee;
}

// 每个一级权限列添加一个底边界
.bdbottom {
    border-bottom: 1px solid #eee;
}

// 用于tag居中
.vcenter {
    display: flex;
    align-items: center;
}
</style>