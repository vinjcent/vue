<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog" plain
                        >添加分类</el-button
                    >
                </el-col>
            </el-row>

            <!-- 表格 -->
            <div :v-if="isShow">
                <tree-table
                    :data="categoriesList"
                    :columns="columns"
                    :selection-type="false"
                    :expand-type="false"
                    show-index
                    index-text="#"
                    border
                    :show-row-hover="false"
                    children-prop="categories"
                    stripe
                    class="treetable"
                >
                    <!-- 是否有效模板列 -->
                    <template slot="isActive" slot-scope="scope">
                        <i
                            class="el-icon-success"
                            v-if="scope.row.actived === true"
                            style="color: lightgreen"
                        ></i>
                        <i class="el-icon-error" v-else style="color: red"></i>
                    </template>

                    <!-- 等级分类模板列 -->
                    <template slot="level" slot-scope="scope">
                        <el-tag v-if="scope.row.level === 1" size="mini"
                            >一级</el-tag
                        >
                        <el-tag
                            v-else-if="scope.row.level === 2"
                            type="success"
                            size="mini"
                            >二级</el-tag
                        >
                        <el-tag v-else type="warning" size="mini">三级</el-tag>
                    </template>

                    <!-- 操作模板列 -->
                    <template slot="operation" slot-scope="scope">
                        <el-button
                            @click="showEditDialog(scope.row)"
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                            >编 辑</el-button
                        >
                        <el-button
                            @click="deleteCate(scope.row.id)"
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            >删 除</el-button
                        >
                    </template>
                </tree-table>
            </div>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[3, 5, 10, 20]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed"
        >
            <!-- 内容主题区域 -->
            <!-- 添加分类表单 -->
            <el-form
                :model="addCateForm"
                :rules="cateFormRules"
                ref="addCateFormRef"
                label-width="100px"
            >
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="addCateForm.name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- options用来指定数据源 -->
                    <!-- props用来指定配置对象 -->
                    <!-- clearable可清除选项 -->
                    <el-cascader
                        v-model="selectedKeys"
                        :options="parentCatesList"
                        :props="cascaderProps"
                        @change="parentCateChanged"
                        clearable
                    ></el-cascader>
                </el-form-item>
            </el-form>

            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="addCategory">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑分类的对话框 -->
        <el-dialog
            title="编辑分类信息"
            :visible.sync="editCateDialogVisible"
            width="50%"
            @close="editCateDialogClosed"
        >
            <!-- 内容主题区域 -->
            <!-- 添加分类表单 -->
            <el-form
                :model="editCateForm"
                :rules="cateFormRules"
                ref="editCateFormRef"
                label-width="100px"
            >
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="editCateForm.name"></el-input>
                </el-form-item>

                <el-form-item label="是否有效">
                    <el-select
                        v-model="editCateForm.actived"
                        clearable
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in isActives"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="父级分类">
                    <!-- options用来指定数据源 -->
                    <!-- props用来指定配置对象 -->
                    <!-- clearable可清除选项 -->
                    <el-cascader
                        v-model="editFormSelectedKeys"
                        :options="parentCatesList"
                        :props="cascaderProps"
                        disabled
                        placeholder=""
                    ></el-cascader>
                </el-form-item>

                <el-form-item label="分类等级" prop="level">
                    <el-select
                        v-model="editCateForm.level"
                        clearable
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in levels"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <!-- 对话框底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false"
                    >取 消</el-button
                >
                <el-button type="primary" @click="editCategory"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        var checkSelected = (rule, value, callback) => {
            if (value !== '') {
                return callback()
            }
            callback(new Error('请选择分类等级!'))
        }

        return {
            // 解决异步刷新问题
            isShow: false,
            // 查询条件
            queryInfo: {
                level: 1,
                pageNum: 1,
                pageSize: 5
            },
            // 控制添加分类对话框的显示与隐藏
            addCateDialogVisible: false,
            // 控制编辑分类对话框的显示与隐藏
            editCateDialogVisible: false,
            // 商品分类的数据列表,默认为空
            categoriesList: [],
            // 总数据条数
            total: 0,
            // 为table指定列的定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'name', // 当前对象属性名称
                    align: 'center', // 对应列内容的对齐方式
                    headerAlign: 'center' // 对应列标题的对齐方式
                },
                {
                    label: '是否有效',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用的模板名称
                    template: 'isActive',
                    align: 'center',
                    headerAlign: 'center' // 对应列标题的对齐方式
                },
                {
                    label: '分类等级',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用的模板名称
                    template: 'level',
                    align: 'center',
                    headerAlign: 'center' // 对应列标题的对齐方式
                },
                {
                    label: '操作',
                    // 表示将当前列定义为模板列
                    type: 'template',
                    // 表示当前这一列使用的模板名称
                    template: 'operation',
                    align: 'center',
                    headerAlign: 'center' // 对应列标题的对齐方式
                }
            ],
            // 添加分类的表单数据对象
            addCateForm: {
                name: '',
                pid: null,
                // 分类等级,默认要添加的等级为一级
                level: 1
            },
            // 编辑分类的表单数据对象
            editCateForm: {},
            // 分类表单的验证规则对象
            cateFormRules: {
                name: [
                    {
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur'
                    }
                ],
                level: [
                    {
                        required: true,
                        validator: checkSelected
                    }
                ]
            },
            // 父级分类的列表
            parentCatesList: [],
            // 指定级联选择器的配置对象
            cascaderProps: {
                expandTrigger: 'hover', // 次级菜单的展开方式
                value: 'id', // 指定选项的值为选项对象的某个属性值
                label: 'name', // 指定选项标签为选项对象的某个属性值
                children: 'categories', // 指定选项的子选项为选项对象的某个属性值
                checkStrictly: true // 严格的遵守父子节点互相关联
            },
            // 选中的父级分类的id数组
            selectedKeys: [],
            // 是否有效下拉数据
            isActives: [
                {
                    value: true,
                    label: '激活中'
                },
                {
                    value: false,
                    label: '禁用中'
                }
            ],
            // 分类等级下拉数据
            levels: [
                {
                    value: 1,
                    label: '一级权限'
                },
                {
                    value: 2,
                    label: '二级权限'
                },
                {
                    value: 3,
                    label: '三级权限'
                }
            ],
            // 编辑框选中的分类
            editFormSelectedKeys: [],
            // 之前的分类等级
            preLevel: 0,
            // 之前的分类父级
            prePid: 0
        }
    },
    created() {
        this.getCategoriesList()
    },
    methods: {
        // 缺少父级修改、级别查询分类功能!!

        // 获取商品分类数据
        async getCategoriesList() {
            let params = this.queryInfo
            const { data: res } = await this.$http.get('/getAllCategories', {
                params,
                headers: this.$http.requestHeaders()
            })
            if (res.status !== 200)
                return this.$message.errorMessage('获取商品分类信息失败!')
            // 把数据列表赋值给categoriesList
            this.categoriesList = res.data
            // 为长度赋值
            this.total = res.total
            // 显示数据
            this.isShow = true
        },
        // 监听pageSize改变
        handleSizeChange(newPageSize) {
            this.queryInfo.pageSize = newPageSize
            this.getCategoriesList()
        },
        // 监听pageNum改变
        handleCurrentChange(newPageNum) {
            this.queryInfo.pageNum = newPageNum
            this.getCategoriesList()
        },
        // 点击按钮,展示添加分类对话框
        showAddCateDialog() {
            // 先获取父级分类的数据列表
            this.getParentCatesList()
            this.addCateDialogVisible = true
        },
        // 获取父级分类的数据列表
        async getParentCatesList(callback) {
            let req = this.$http
            const { data: res } = await req.get('/getSecCategories', {
                params: { level: 2 }
            })
            if (res.status !== 200)
                return this.$message.errorMessage('获取商品分类信息失败!')
            // console.log(res.data)
            this.parentCatesList = res.data
            // 回调函数
            if (callback) callback()
        },
        // 选择项发生变化出发这个函数
        parentCateChanged() {
            // 如果selectedKys数组中的length大于0,说明选中了父级分类
            // 反之,说明没有选中任何父级分类
            /**
             * 一级level:1
             * 二级level:2
             * 三级level:3
             */
            if (this.selectedKeys.length > 0) {
                // 赋值父级分类的id
                this.addCateForm.pid =
                    this.selectedKeys[this.selectedKeys.length - 1]
                // 为当前分类的等级赋值
                this.addCateForm.level = this.selectedKeys.length + 1
            } else {
                this.addCateForm.pid = null
                // 为当前分类的等级赋值
                this.addCateForm.level = 1
            }
        },
        // 添加新的分类
        addCategory() {
            this.$refs.addCateFormRef.validate(async (valid) => {
                if (!valid) return

                const { data: res } = await this.$http.post(
                    '/addCategory',
                    this.addCateForm
                )
                if (res.status !== 200)
                    return this.$message.errorMessage('添加分类失败!')
                this.$message.successMessage('添加分类成功!')
                // 重新获取数据
                this.getCategoriesList()
                // 关闭对话框
                this.addCateDialogVisible = false
            })
        },
        // 监听对话框的关闭事件,重置表单数据
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.level = 1
            this.addCateForm.pid = null
        },
        // 显示编辑对话框事件
        showEditDialog(category) {
            // 保存当前编辑分类对象
            this.editCateForm = category
            // 保存当前的分类等级
            this.preLevel = category.level
            // 保存当前的分类父级
            this.prePid = category.pid
            // 获取父级分类的数据列表
            this.getParentCatesList(() => {
                // console.log(this.parentCatesList)
                // 如果是一级权限,那么父级数组为null
                if (category.level === 1) {
                    this.editFormSelectedKeys = []
                }
                // 如果是二级权限,那么父级数组就为当前分类的父id
                else if (category.level === 2)
                    this.editFormSelectedKeys = [category.pid]
                // 如果是三级权限,那么父级数组就是一级权限的id与二级权限的id组合成的数组
                else if (category.level === 3) {
                    if (this.parentCatesList)
                        for (let i = 0; i < this.parentCatesList.length; i++) {
                            for (
                                let j = 0;
                                j < this.parentCatesList[i].categories.length;
                                j++
                            ) {
                                if (
                                    this.parentCatesList[i].categories[j].id ===
                                    category.pid
                                ) {
                                    this.editFormSelectedKeys = [
                                        this.parentCatesList[i].id,
                                        category.pid
                                    ]
                                }
                            }
                        }
                }
                // 展示编辑对话框
                this.editCateDialogVisible = true
            })
        },
        // 编辑分类对话框关闭事件
        editCateDialogClosed() {
            this.$refs.editCateFormRef.resetFields()
            this.editFormSelectedKeys = []
            this.preLevel = 0
            this.prePid = 0
        },
        // 编辑分类对话框的确认按钮事件
        editCategory() {
            // console.log(this.editCateForm)
            this.$refs.editCateFormRef.validate(async (valid) => {
                if (!valid) return
                if (this.editCateForm.level !== this.preLevel) {
                    const confirmResult = await this.$confirm(
                        '此操作有可能会将隐藏掉相关的分类,但能通过修改回原等级,返回原数据, 是否继续?',
                        '提示',
                        {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }
                    ).catch((err) => {})
                    // console.log(confirmResult)
                    if (confirmResult !== 'confirm') {
                        return this.$message.info('已取消修改!')
                    }
                }

                const { data: res } = await this.$http.put(
                    '/updateCategory',
                    this.editCateForm
                )

                if (res.status !== 200) {
                    return this.$message.error('更新分类失败!')
                }
                this.$message.successMessage('更新分类成功！')
                // 重新获取数据
                this.getCategoriesList()
                // 关闭对话框
                this.editCateDialogVisible = false
            })
        },
        // 删除一个分类
        async deleteCate(id) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该分类,是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            // console.log(confirmResult)
            if (confirmResult !== 'confirm') {
                return this.$message.infoMessage('已取消删除!')
            }

            const { data: res } = await this.$http.delete(
                '/deleteCategory/' + id
            )
            if (res.status !== 200) {
                return this.$message.errorMessage('删除分类失败!')
            }
            this.$message.successMessage('删除分类成功！')
            // 重新获取数据
            this.getCategoriesList()
        }
    }
}
</script>

<style lang="less" scoped>
.treetable {
    margin-top: 15px;
}

.el-cascader {
    width: 100%;
}
</style>