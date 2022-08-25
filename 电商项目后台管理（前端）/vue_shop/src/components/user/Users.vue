<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input
                        placeholder="请输入内容"
                        class="input-with-select"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getUserList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getUserList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button
                        type="primary"
                        @click="addDialogVisible = true"
                        plain
                        >添加用户</el-button
                    >
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userList" stripe>
                <el-table-column label="#" type="index" align="center" />
                <el-table-column label="姓名" prop="name" align="center" />
                <el-table-column label="邮箱" prop="email" align="center" />
                <el-table-column label="电话" prop="telephone" align="center" />
                <el-table-column label="角色" prop="role" align="center" />
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.state"
                            :active-value="1"
                            :inactive-value="0"
                            @change="userStateChanged(scope.row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" height="172px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-tooltip
                            effect="dark"
                            content="修改"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="showEditDialog(scope.row)"
                            ></el-button>
                        </el-tooltip>

                        <!-- 删除按钮 -->
                        <el-tooltip
                            effect="dark"
                            content="删除"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="removeUserById(scope.row.id)"
                            ></el-button>
                        </el-tooltip>

                        <!-- 分配角色按钮 -->
                        <el-tooltip
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="showRoleDialog(scope.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>

        <!-- 添加用户的对话框区域 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed"
        >
            <!-- 内容主题区域 -->
            <el-form
                ref="addUserFormRef"
                :model="User"
                :rules="addUserFormRules"
                label-width="70px"
            >
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="User.name"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="User.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="User.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="telephone">
                    <el-input v-model="User.telephone"></el-input>
                </el-form-item>
            </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户对话框区域 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
        >
            <!-- 内容主题区域 -->
            <el-form
                ref="editUserFormRef"
                :model="editUser"
                :rules="editUserFormRules"
                label-width="70px"
            >
                <el-form-item label="用户名">
                    <el-input v-model="editUser.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="editUser.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUser.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="telephone">
                    <el-input v-model="editUser.telephone"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="40%"
            @close="setRoleDialogClosed"
        >
            <div>
                <p>当前的用户 : {{ userInfo.username }}</p>
                <p>当前的角色 : {{ userInfo.role }}</p>
                <p>
                    分配新角色:
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </p>
            </div>

            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="saveRoleInfo"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        // 验证邮箱的规则
        var checkEmail = (rule, value, callback) => {
            const regEmail =
                /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

            // 验证邮箱
            if (regEmail.test(value)) {
                return callback()
            }

            callback(new Error('请输入合法的邮箱!'))
        }

        // 验证手机号的规则
        var checkTelephone = (rule, value, callback) => {
            const regTeleNumber =
                /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regTeleNumber.test(value)) {
                return callback()
            }

            callback(new Error('请输入合法的手机号码!'))
        }

        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: '', // 查询参数
                pageNum: 1, // 页码
                pageSize: 5 // 每页显示条数
            },
            // 用户列表
            userList: [],
            // 用户记录数
            total: 10,
            // 控制添加用户显示与隐藏的对话框
            addDialogVisible: false,
            // 控制用户修改的对话框显示与隐藏
            editDialogVisible: false,
            // 控制分配角色对话框的显示与隐藏
            setRoleDialogVisible: false,
            // 需要编辑的用户信息对象
            editUser: {},
            // 添加用户的表单数据
            User: {
                name: '',
                username: '',
                email: '',
                telephone: ''
            },
            // 需要分配角色的用户信息
            userInfo: {},
            // 所有角色的数据列表
            rolesList: [],
            // 已选中的角色id值
            selectedRoleId: '',
            // 添加用户表单的验证规则对象
            addUserFormRules: {
                name: [
                    {
                        required: true,
                        message: '请输入昵称',
                        trigger: 'blur'
                    }
                ],
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 8,
                        max: 16,
                        message: '用户名的长度在8~16个字符之间',
                        trigger: 'blur'
                    }
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur'
                    }
                ],
                telephone: [
                    {
                        required: true,
                        message: '请输入电话号码',
                        trigger: 'blur'
                    },
                    {
                        validator: checkTelephone,
                        trigger: 'blur'
                    }
                ]
            },
            // 修改用户表单的验证规则对象
            editUserFormRules: {
                name: [
                    {
                        required: true,
                        message: '请输入昵称',
                        trigger: 'blur'
                    }
                ],
                email: [
                    {
                        required: true,
                        message: '请输入邮箱',
                        trigger: 'blur'
                    },
                    {
                        validator: checkEmail,
                        trigger: 'blur'
                    }
                ],
                telephone: [
                    {
                        required: true,
                        message: '请输入电话号码',
                        trigger: 'blur'
                    },
                    {
                        validator: checkTelephone,
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 获取用户列表
        getUserList() {
            let params
            let url
            if (this.queryInfo.query === null || this.queryInfo.query === '') {
                url = '/getUsersByPage'
                params = {
                    pageNum: this.queryInfo.pageNum,
                    pageSize: this.queryInfo.pageSize
                }
            } else {
                url = '/getUsersByName'
                params = {
                    name: this.queryInfo.query
                }
            }
            let req = this.$http
            req.get(url, {
                // 请求参数
                params
            }).then((res) => {
                if (res.status !== 200 || res.data.status !== 200)
                    return this.$message.errorMessaged('获取信息失败!')
                this.userList = res.data.data
                this.total = res.data.total
            })
        },
        // 监听pageSize改变事件
        handleSizeChange(newPageSize) {
            // console.log(newPageSize)
            this.queryInfo.pageSize = newPageSize
            this.getUserList()
        },
        // 监听pageNum改变事件
        handleCurrentChange(newPageNum) {
            // console.log(newPageNum)
            this.queryInfo.pageNum = newPageNum
            this.getUserList()
        },
        // 监听switch开关状态
        userStateChanged(userInfo) {
            // console.log(userInfo)
            let req = this.$http
            req.put(
                `/updateUser/${userInfo.id}/state/${userInfo.state}`,
                {}
            ).then((res) => {
                if (res.status !== 200 || res.data.status !== 200) {
                    userInfo.state = userInfo.state == 1 ? 0 : 1
                    return this.$message.errorMessage('更新用户状态失败!')
                }
            })
            this.$message.successMessage('更新用户状态成功!')
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addUserFormRef.resetFields()
        },
        // 点击确定,添加用户
        addUser() {
            this.$refs.addUserFormRef.validate((valid) => {
                if (!valid) return
                // 发起添加用户的网络请求
                let req = this.$http
                req.post('/addUser', this.User).then((res) => {
                    if (res.status !== 200 || res.data.status !== 200) {
                        return this.$message.errorMessage('添加用户失败!')
                    }
                    // 用户添加成功
                    this.$message.successMessage('用户添加成功!')
                    // 隐藏添加用户的对话框
                    this.addDialogVisible = false
                    // 重新获取用户的列表数据
                    this.getUserList()
                })
            })
        },
        // 编辑用户的对话框
        showEditDialog(user) {
            // console.log(id)
            this.editUser = user
            this.editDialogVisible = true
        },
        updateUser() {
            this.$refs.editUserFormRef.validate((valid) => {
                if (!valid) return
                // 发起修改用户的网络请求
                let req = this.$http
                req.put('/updateUser', this.editUser).then((res) => {
                    if (res.status !== 200 || res.data.status !== 200) {
                        return this.$message.errorMessage('修改用户失败!')
                    }
                    // 用户修改成功
                    this.$message.successMessage('用户添加成功!')
                    // 隐藏添加用户的对话框
                    this.editDialogVisible = false
                    // 重新获取用户的列表数据
                    this.getUserList()
                })
            })
        },
        // 根据id删除对应的用户
        removeUserById(id) {
            // 询问用户是否删除
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let req = this.$http
                    req.delete('/deleteUser/' + id).then((res) => {
                        if (res.status !== 200 || res.data.status !== 200)
                            return this.$message.errorMessage('删除用户失败!')
                        this.$message.successMessage('删除用户成功!')
                        // 当如当前记录数-1之后能被页大小整除,需要跳转到前一页
                        if ((this.total - 1) % this.queryInfo.pageSize == 0) {
                            this.queryInfo.pageNum = this.queryInfo.pageNum - 1
                        }
                        // 重新获取用户列表
                        this.getUserList()
                    })
                })
                .catch(() => {
                    return this.$message.info('已取消删除!')
                })
            // 如果没有点击确认,会抛出异常,需要手动捕获异常,返回err
            // 如果用户确认删除,则返回字符串"confirm",
            // 如果用户取消则返回"cancel"
        },
        // 展示分配角色的对话框
        showRoleDialog(user) {
            this.userInfo = user

            // 再展示对话框之前,获取所有角色列表
            let req = this.$http
            req.get('/getAllRoles').then((res) => {
                if (res.status !== 200 || res.data.status !== 200)
                    return this.$message.errorMessage('获取角色列表失败!')
                // 为rolesList列表添加数据
                // console.log(res.data.data)
                this.rolesList = res.data.data
            })

            this.setRoleDialogVisible = true
        },
        // 监听分配角色对话框的关闭事件
        setRoleDialogClosed() {
            // 重置选中id
            this.selectedRoleId = ''
            // 重置用户信息
            this.userInfo = ''
        },
        // 点击按钮,分配角色
        saveRoleInfo() {
            if (!this.selectedRoleId)
                return this.$message.errorMessage('请选择要分配的角色!')
            let req = this.$http
            req.put(
                `users/${this.userInfo.id}/role`,
                req.requestData(this.selectedRoleId, false)
            ).then((res) => {
                if (res.status !== 200 || res.data.status !== 200)
                    return this.$message.errorMessage('为用户分配角色失败!')
                this.$message.successMessage('为用户分配角色成功!')
                // 重新获取用户列表
                this.getUserList()
                // 关闭对话框
                this.setRoleDialogVisible = false
            })
        }
    }
}
</script>

<style lang="less" scoped>
</style>