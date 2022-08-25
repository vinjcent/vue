<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品添加</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 提示区域 -->
            <el-alert
                title="添加商品信息"
                type="info"
                :closable="false"
                center
                show-icon
            >
            </el-alert>

            <!-- 步骤条区域 -->
            <el-steps
                :space="200"
                :active="activedIndex - 0"
                finish-status="success"
                align-center
            >
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- 表单 -->
            <el-form
                :model="addCommoForm"
                :rules="addCommoFormRules"
                ref="addCommoFormRef"
                label-width="100px"
                label-position="top"
            >
                <!-- tab栏区域 -->
                <el-tabs
                    v-model="activedIndex"
                    :before-leave="beforeTabLeave"
                    @tab-click="tabClicked"
                    :tab-position="'left'"
                >
                    <!-- 基本信息面板区域 -->
                    <el-tab-pane label="基本信息" name="0">
                        <!-- 表单项 -->
                        <el-form-item label="商品名称" prop="commodityName">
                            <el-input v-model="addCommoForm.commodityName">
                            </el-input
                        ></el-form-item>
                        <!-- 表单项 -->
                        <el-form-item label="商品价格" prop="commodityPrice">
                            <el-input v-model="addCommoForm.commodityPrice">
                            </el-input
                        ></el-form-item>
                        <!-- 表单项 -->
                        <el-form-item label="商品重量" prop="commodityWeight">
                            <el-input v-model="addCommoForm.commodityWeight">
                            </el-input
                        ></el-form-item>
                        <!-- 表单项 -->
                        <el-form-item label="商品数量" prop="commodityNumber">
                            <el-input v-model="addCommoForm.commodityNumber">
                            </el-input
                        ></el-form-item>
                        <!-- 表单项 -->
                        <el-form-item label="商品分类" prop="commodityCateId">
                            <el-cascader
                                v-model="selectedCateKeys"
                                :options="categoriesList"
                                :props="cateProps"
                                @change="handleChange"
                            ></el-cascader
                        ></el-form-item>
                    </el-tab-pane>

                    <!-- 商品参数面板区域 -->
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的item项 -->
                        <el-form-item
                            :label="item.attrName"
                            v-for="item in manyTableData"
                            :key="item.attrId"
                        >
                            <!-- 复选框 -->
                            <el-checkbox-group v-model="item.attrVals">
                                <el-checkbox
                                    :label="paramItem"
                                    v-for="(paramItem, index) in item.attrVals"
                                    :key="index"
                                    border
                                ></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>

                    <!-- 商品属性面版区域 -->
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item
                            :label="item.attrName"
                            v-for="item in onlyTableData"
                            :key="item.attrId"
                        >
                            <el-input v-model="item.attrVals"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <!-- 商品图片面板区域 -->
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 
                            action 表示图片要上传的api地址
                            on-preview 点击文件列表中已上传的文件时的钩子
                            on-remove 文件列表移除文件时的钩子
                            multiple 是否支持多选文件
                            on-success 文件上传成功时的钩子
                             -->
                        <el-upload
                            :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="headleSuccess"
                            list-type="picture"
                            :headers="headerObj"
                        >
                            <el-button size="small" type="primary"
                                >点击上传</el-button
                            >
                            <div slot="tip" class="el-upload__tip">
                                只能上传jpg/png文件,且不超过500kb
                            </div>
                        </el-upload></el-tab-pane
                    >
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor
                            v-model="addCommoForm.commodityIntroduce"
                        ></quill-editor>
                        <!-- 添加商品的按钮 -->
                        <el-button
                            type="primary"
                            class="btnAddComm"
                            @click="addComm"
                            >添加商品</el-button
                        >
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="30%">
            <img :src="previewPath" alt="" class="previewImg" />
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        var checkNumber = (rule, value, callback) => {
            // 包含小数的数字
            const isDecimal = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
            // 正整数
            const isPositiveInteger = /^[+]{0,1}(\d+)$/g
            if (isDecimal.test(value) || isPositiveInteger.test(value))
                return callback()
            callback(new Error('请输入正确数字'))
        }
        return {
            // 控制步骤条的激活选项与tabs的同步
            activedIndex: '0',
            // 添加商品的表单数据对象
            addCommoForm: {
                commodityName: '',
                commodityPrice: 0,
                commodityWeight: 0,
                commodityNumber: 0,
                // 商品所属的分类id
                commodityCateId: 0,
                // 图片的数组
                pics: [],
                // 商品的详情描述
                commodityIntroduce: '',
                attrs: []
            },
            // 添加商品的表单校验规则
            addCommoFormRules: {
                commodityName: [
                    {
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    }
                ],
                commodityPrice: [
                    {
                        required: true,
                        message: '请输入商品价格',
                        trigger: 'blur'
                    },
                    {
                        validator: checkNumber,
                        trigger: 'blur'
                    }
                ],
                commodityWeight: [
                    {
                        required: true,
                        message: '请输入商品重量',
                        trigger: 'blur'
                    },
                    {
                        validator: checkNumber,
                        trigger: 'blur'
                    }
                ],
                commodityNumber: [
                    {
                        required: true,
                        message: '请输入商品数量',
                        trigger: 'blur'
                    },
                    {
                        validator: checkNumber,
                        trigger: 'blur'
                    }
                ],
                commodityCateId: [
                    {
                        required: true,
                        message: '请选择商品分类',
                        trigger: 'blur'
                    }
                ]
            },
            // 商品分类列表
            categoriesList: [],
            // 级联选择配置
            cateProps: {
                label: 'name', // 看到的属性,列表中对象属性的名称
                value: 'id', // 选中的值
                children: 'categories', // 父子节点的嵌套
                expandTrigger: 'hover' // 悬浮时展开
            },
            // 级联选择的数组
            selectedCateKeys: [],
            // 动态参数列表数据
            manyTableData: [],
            // 静态参数列表数据
            onlyTableData: [],
            // 上传图片的url地址
            uploadURL: 'http://localhost:3035/uploadImage',
            // 图片上传组件请求头对象
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 用于显示图片路径
            previewPath: '',
            // 用于显示图片预览对话框
            previewVisible: false
        }
    },
    created() {
        this.getCategoriesList()
    },
    methods: {
        // 获取所有级联分类
        async getCategoriesList() {
            const { data: res } = await this.$http.get('/getAllCategories')
            if (res.status !== 200)
                return this.$message.errorMessage('获取商品分类信息失败!')
            // 把数据列表赋值给categoriesList
            this.categoriesList = res.data
            console.log(res.data)
        },
        // 级联选择器选中项变化触发的函数
        handleChange() {
            console.log(this.selectedCateKeys)
            // 如果数组长度不为3
            if (this.selectedCateKeys.length !== 3) {
                this.selectedCateKeys = []
            } else {
                // 如果数组长度为3
                this.addCommoForm.commodityCateId = this.selectedCateKeys[2]
            }
        },
        // 监听级联选择离开之前
        beforeTabLeave(activeName, oldAticveName) {
            // console.log('即将离开的标签页名字是:' + oldAticveName)
            // console.log('即将进入的标签页名字是:' + activeName)
            // 用于判断是否填写完当前页的信息
            let flag = true
            // 获取数组长度
            let size = this.selectedCateKeys.length
            // 如果表单无效或未选择级联选择
            this.$refs.addCommoFormRef.validate((valid) => {
                if (!valid || (!size && size !== 3)) {
                    this.$message.infoMessage('请完善当前页面的信息!')
                    flag = false
                }
            })
            return flag
        },
        // tab标签点击事件
        async tabClicked() {
            // 证明访问的是动态参数面板
            if (this.activedIndex === '1') {
                const { data: res } = await this.$http.get(
                    `/categories/${this.getSelectedThirdCate}`,
                    {
                        params: { sel: 'many' }
                    }
                )
                if (res.status !== 200) {
                    return this.$message.errorMessage('获取分类参数失败!')
                }
                // 将字符串以','的形式差分成数组
                res.data.forEach((item) => {
                    item.attrVals = !item.attrVals
                        ? []
                        : item.attrVals.split(',')
                })
                // 动态参数赋值
                this.manyTableData = res.data
                // console.log(res.data)
            } else if (this.activedIndex === '2') {
                const { data: res } = await this.$http.get(
                    `/categories/${this.getSelectedThirdCate}`,
                    {
                        params: { sel: 'only' }
                    }
                )
                if (res.status !== 200) {
                    return this.$message.errorMessage('获取静态属性失败!')
                }
                this.onlyTableData = res.data
                // console.log(res.data)
            }
        },
        // 处理图片预览效果
        handlePreview(file) {
            // console.log(file)
            // 赋值图片的url
            this.previewPath = file.response.data.url
            // 展示图片对话框
            this.previewVisible = true
        },
        // 移除图片的操作
        handleRemove(file) {
            // console.log(file)
            // 1.获取将要删除的图片的临时路径
            const filePath = file.response.data.temPath
            // 2.从pics数组中,找到这个图片对应的索引值
            const index = this.addCommoForm.pics.findIndex((item) => {
                item.pic === filePath
            })
            // 3.调用数组的splice方法,把图片西南西对象,从pics数组中移除
            this.addCommoForm.pics.splice(index, 1)
            console.log(this.addCommoForm)
        },
        // 监听图片上传成功的事件
        headleSuccess(response) {
            // 1.拼接得到一个图片信息对象
            const picInfo = { temPath: response.data.temPath }
            // 2.将图片信息对象,push 到 pics数组当中
            this.addCommoForm.pics.push(picInfo)
            console.log(this.addCommoForm)
        },
        // 添加商品
        addComm() {
            // 表单验证通知
            this.$refs.addCommoFormRef.validate(async valid => {
                if (!valid) {
                    return this.$message.errorMessage('请填写必要的表单项!')
                }
                // 执行添加的业务逻辑
                // 处理动态参数
                this.manyTableData.forEach((item) => {
                    const newInfo = {
                        attrId: item.attrId,
                        attrVals: item.attrVals.join(',')
                    }
                    this.addCommoForm.attrs.push(newInfo)
                })
                // 处理静态属性
                this.onlyTableData.forEach((item) => {
                    const newInfo = {
                        attrId: item.attrId,
                        attrVals: item.attrVals
                    }
                    this.addCommoForm.attrs.push(newInfo)
                })
                console.log(this.addCommoForm)
                // 发起请求添加上商品
                // 商品的名称,必须是唯一的
                const { data: res } = await this.$http.post('/addCommo',this.addCommoForm)
                if(res.status !== 200) {
                return this.$message.errorMessage('添加商品失败!')
                }
                this.$message.successMessage('添加商品成功!')
                this.$router.push('/commodities')
            })
        }
    },
    computed: {
        // 计算三级分类的id
        getSelectedThirdCate() {
            if (this.selectedCateKeys.length === 3) {
                return this.selectedCateKeys[2]
            }
            return null
        }
    }
}
</script>
<style lang='less' scoped>
.el-checkbox {
    margin: 0 11px 0 0 !important;
}

.previewImg {
    width: 100%;
}
.btnAddComm {
    margin-top: 15px;
}
</style>