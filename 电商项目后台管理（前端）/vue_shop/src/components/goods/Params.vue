<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 头部的警告区域 -->
            <el-alert
                title="注意: 只允许为第三级分类设置相关参数!"
                :closable="false"
                show-icon
                type="warning"
            >
            </el-alert>

            <!-- 选择商品分类区域 -->
            <el-row class="cat-opt">
                <el-col>
                    <span>选择商品分类: </span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader
                        v-model="selectedCateKeys"
                        :options="categoriesList"
                        :props="catesProps"
                        @change="handleChange"
                    ></el-cascader>
                </el-col>
            </el-row>

            <!-- tab 页签区域 -->
            <el-tabs
                v-model="activeName"
                type="border-card"
                @tab-click="handleClick"
            >
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数的按钮 -->
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isBtnDisabled"
                        @click="addDialogVisible = true"
                        >添加参数</el-button
                    >
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand" align="center">
                            <!-- 作用域插槽 -->
                            <template slot-scope="scope">
                                <!-- 循环渲染子属性值 -->
                                <el-tag
                                    v-for="(item, index) in scope.row.attrVals"
                                    :key="index"
                                    closable
                                    @close="handleClose(index, scope.row)"
                                >
                                    {{ item }}
                                </el-tag>
                                <!-- 添加tag标签区域 -->
                                <!-- 输入文本框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="
                                        handleInputConfirm(scope.row)
                                    "
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!-- 添加标签按钮 -->
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                    >+ New Tag</el-button
                                >
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" align="center" />
                        <el-table-column
                            label="参数名称"
                            prop="attrName"
                            align="center"
                        />
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                    @click="showEditDialog(scope.row)"
                                    >编 辑</el-button
                                >
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="removeParams(scope.row.attrId)"
                                    >删 除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button
                        type="primary"
                        size="mini"
                        :disabled="isBtnDisabled"
                        @click="addDialogVisible = true"
                        >静态属性</el-button
                    >
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand" align="center">
                            <!-- 作用域插槽 -->
                            <template slot-scope="scope">
                                <!-- 循环渲染子属性值 -->
                                <el-tag
                                    v-for="(item, index) in scope.row.attrVals"
                                    :key="index"
                                    closable
                                    @close="handleClose(index, scope.row)"
                                >
                                    {{ item }}
                                </el-tag>
                                <!-- 添加tag标签区域 -->
                                <!-- 输入文本框 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="
                                        handleInputConfirm(scope.row)
                                    "
                                    @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!-- 添加标签按钮 -->
                                <el-button
                                    v-else
                                    class="button-new-tag"
                                    size="small"
                                    @click="showInput(scope.row)"
                                    >+ New Tag</el-button
                                >
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" align="center" />
                        <el-table-column
                            label="属性名称"
                            prop="attrName"
                            align="center"
                        />
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    icon="el-icon-edit"
                                    size="mini"
                                    @click="showEditDialog(scope.row)"
                                    >编 辑</el-button
                                >
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="removeParams(scope.row.attrId)"
                                    >删 除</el-button
                                >
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <!-- 添加参数的对话框 -->
            <el-dialog
                :title="'添加' + titleText"
                :visible.sync="addDialogVisible"
                width="45%"
                @close="addDialogClosed"
            >
                <el-form
                    :model="addParamForm"
                    :rules="paramFormRules"
                    ref="addParamFormRef"
                    label-width="80px"
                >
                    <el-form-item :label="titleText" prop="attrName">
                        <el-input v-model="addParamForm.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="addParams"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>

            <!-- 修改参数对话框 -->
            <el-dialog
                :title="'添加' + titleText"
                :visible.sync="editDialogVisible"
                width="45%"
                @close="editDialogClosed"
            >
                <el-form
                    :model="editParamForm"
                    :rules="paramFormRules"
                    ref="editParamFormRef"
                    label-width="80px"
                >
                    <el-form-item :label="titleText" prop="attrName">
                        <el-input v-model="editParamForm.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false"
                        >取 消</el-button
                    >
                    <el-button type="primary" @click="editParams"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类列表
            categoriesList: [],
            // 级联选择框的配置对象
            catesProps: {
                value: 'id',
                label: 'name',
                children: 'categories',
                expandTrigger: 'hover'
                // checkStrictly: 'true'
            },
            // 级联选择框双向绑定的数组
            selectedCateKeys: [],
            // 被激活的页签名称
            activeName: 'many',
            // 动态参数的数据
            manyTableData: [],
            // 静态属性的数据
            onlyTableData: [],
            // 控制添加对话框的显示与隐藏
            addDialogVisible: false,
            // 控制修改对话框的显示与隐藏
            editDialogVisible: false,
            // 添加参数的表单数据对象
            addParamForm: {
                attrName: ''
            },
            // 添加参数表单的数据对象
            paramFormRules: {
                attrName: [
                    {
                        required: true,
                        message: '请输入参数名称',
                        trigger: 'blur'
                    }
                ]
            },
            // 修改的表单数据对象
            editParamForm: {}
            //
        }
    },
    created() {
        this.getCategoriesList()
    },
    methods: {
        // 获取所有商品分类数据
        async getCategoriesList() {
            const { data: res } = await this.$http.get('/getAllCategories')
            if (res.status !== 200)
                return this.$message.errorMessage('获取商品分类信息失败!')
            // 把数据列表赋值给categoriesList
            this.categoriesList = res.data
        },
        // 级联选择框选中项变化,触发这个函数
        handleChange() {
            this.getParamsData()
        },
        // tab 页签点击事件的处理函数
        handleClick() {
            this.getParamsData()
        },
        // 获取参数的列表数据
        async getParamsData() {
            // 如果选中的不是三级分类
            if (this.selectedCateKeys.length !== 3) {
                // 将选择的分类数组清空
                this.selectedCateKeys = []
                // 动态参数数组清空
                this.manyTableData = []
                // 静态参数数组清空
                this.onlyTableData = []
                return
            }
            // 证明选中的是三级分类
            // console.log(this.selectedCateKeys)
            // 根据所选分类id,和当前所处的面板,获取对应的参数
            const { data: res } = await this.$http.get(
                `categories/${this.getSelectedThirdCateId}/`,
                {
                    params: { sel: this.activeName },
                    headers: this.$http.requestHeaders()
                }
            )

            if (res.status !== 200) {
                return this.$message.errorMessage('获取参数列表失败!')
            }
            if (this.activeName === 'many') {
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data
            }
            // 循环遍历attrVals的值,并拆分成数组
            res.data.forEach((item) => {
                item.attrVals = item.attrVals ? item.attrVals.split(',') : []
                // 用于控制文本框的显示与隐藏
                this.$set(item, 'inputVisible', false)
                // 文本框中输入的值
                this.$set(item, 'inputValue', '')
            })
            // console.log(res.data)
        },
        // 监听添加对话框的关闭事件
        addDialogClosed() {
            this.$refs.addParamFormRef.resetFields()
        },
        // 添加参数
        addParams() {
            this.$refs.addParamFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.post(
                    `/categories/${this.getSelectedThirdCateId}/attributes`,
                    {
                        attrName: this.addParamForm.attrName,
                        attrSel: this.activeName
                    }
                )
                if (res.status !== 200)
                    return this.$message.errorMessage('添加参数失败!')
                // 成功消息提醒
                this.$message.successMessage('添加参数成功!')
                // 关闭当前对话框
                this.addDialogVisible = false
                // 重新获取数据
                this.getParamsData()
            })
        },
        // 点击按钮展示修改对话框
        showEditDialog(param) {
            // 获取当前参数的对象
            this.editParamForm = param
            this.editDialogVisible = true
        },
        // 关闭修改对话框事件
        editDialogClosed() {
            this.$refs.editParamFormRef.resetFields()
        },
        // 点击修改对话框信息
        editParams() {
            this.$refs.editParamFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.put(
                    `categories/${this.getSelectedThirdCateId}/attributes/${this.editParamForm.attrId}`,
                    {
                        attrName: this.editParamForm.attrName,
                        attrSel: this.activeName
                    }
                )
                if (res.status !== 200) {
                    return this.$message.errorMessage('修改参数失败!')
                }
                this.$message.successMessage('修改参数成功!')
                // 重新获取分类参数数据
                this.getParamsData()
                // 隐藏对话框
                this.editDialogVisible = false
            })
        },
        // 根据id删除对应的参数项
        async removeParams(attrId) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该属性,是否继续?',
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

            const { data: res } = await this.$http.delete(
                `categories/${this.getSelectedThirdCateId}/${attrId}`
            )
            if (res.status !== 200) {
                return this.$message.errorMessage('删除参数失败!')
            }
            this.$message.successMessage('删除参数成功!')
            // 刷新列表
            this.getParamsData()
        },
        // 文本框失去焦点或按下Enter键都会触发
        handleInputConfirm(row) {
            // 判断当前用户输入是否为空
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            // 如果没有return,则证明输入的内容真实,需要做后续处理
            row.attrVals.push(row.inputValue.trim())
            // 将该标签的输入框重置
            row.inputValue = ''
            row.inputVisible = false
            // 需要发起请求,保存这次操作
            this.saveAttrVals(row)
        },
        // 点击按钮,展示文本输入框
        showInput(row) {
            row.inputVisible = true
            // 让文本框自动获得焦点
            this.$nextTick((_) => {
                // $nextTick 方法的作用,就是当页面上的元素
                // 被重新渲染之后,才会指定回调函数中的代码
                // 原生dom操作input
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        // 将对attrVals的操作,保存到数据库
        async saveAttrVals(row) {
            // 需要发起请求,保存这次操作
            const { data: res } = await this.$http.put(
                `categories/${this.getSelectedThirdCateId}/attributes/` +
                    row.attrId,
                {
                    attrName: row.attrName,
                    attrSel: row.attrSel,
                    attrVals: row.attrVals.join(',')
                }
            )
            if (res.status !== 200) {
                return this.$message.errorMessage('修改参数项失败!')
            }
            this.$message.successMessage('修改参数项成功!')
        },
        // 删除对应的参数可选项
        handleClose(index, row) {
            row.attrVals.splice(index, 1)
            this.saveAttrVals(row)
        }
    },
    computed: {
        // 如果按钮需要被禁用,则返回true,否则返回false
        isBtnDisabled() {
            return this.selectedCateKeys.length !== 3
        },
        // 当前选中的三级分类的id
        getSelectedThirdCateId() {
            return this.selectedCateKeys.length === 3
                ? this.selectedCateKeys[2]
                : null
        },
        // 动态计算标题的文本
        titleText() {
            return this.activeName === 'many' ? '动态参数' : '静态属性'
        }
    }
}
</script>

<style lang="less" scoped>
.cat-opt {
    margin: 20px 0;
}

.el-tag {
    margin: 10px;
}
.input-new-tag {
    margin-left: 10px;
    width: 150px;
}
.button-new-tag {
    margin-left: 15px;
}
</style>