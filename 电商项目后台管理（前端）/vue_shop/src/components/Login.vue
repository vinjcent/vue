<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="" />
            </div>
            <!-- 登录表单区域 -->
            <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="loginFormRules"
                label-width="0px"
                class="login_form"
            >
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        prefix-icon="el-icon-user-solid"
                    ></el-input>
                </el-form-item>

                <!-- prefix-icon 添加前缀图标 -->

                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input
                        v-model="loginForm.password"
                        prefix-icon="el-icon-lock"
                        type="password"
                    ></el-input>
                </el-form-item>

                <!-- 按钮区域 -->
                <el-form-item class="login_btns">
                    <el-button type="primary" plain @click="login"
                        >登录</el-button
                    >
                    <el-button type="info" plain @click="resetLoginForm"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 这是登录表单的数据绑定对象,属性通过v-model进行绑定
            loginForm: {
                username: 'vinjcent',
                password: '123456'
            },
            // 这是表单的验证规则对象,需要在对应的标签中添加属性prop
            loginFormRules: {
                // 验证用户名是否合法
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 16,
                        message: '长度在 8 到 16 个字符',
                        trigger: 'blur'
                    }
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 18,
                        message: '长度在 6 到 16 个字符',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        // 点击重置按钮,重置登录表单
        resetLoginForm() {
            // console.log(this)
            this.$refs.loginFormRef.resetFields()
        },
        // 登录表单预验证
        login() {
            this.$refs.loginFormRef.validate((valid) => {
                // 如果valid为false,返回null,不继续执行
                if (!valid) return
                // 封装数据,由于请求类型是post,所以参数格式不再是 {params: {name: value,name: value}}
                let data = new URLSearchParams()
                data.append('username', this.loginForm.username)
                data.append('password', this.loginForm.password)

                // 声明请求
                let req
                req = this.$http
                // 调用post方法
                req.post(
                    '/login', //url
                    data, // 请求参数
                    // 设置响应头的类型,默认传递的参数是json形式
                    {
                        headers: req.requestHeaders()
                    }
                ).then((res) => {
                    // 回调函数
                    // 登录失败提示原因
                    if (res.data.status === 0)
                        return this.$message.errorMessage(res.data.message)
                    // 登录成功提示
                    if (res.data.status === 200)
                        this.$message.successMessage(res.data.message)
                    // 1. 将登录成功之后的token,保存到客户端的sessionStorage中
                    //  1.1 项目总除了登陆之外的其它API接口,必须在登录之后才能访问
                    //  1.2 token 直营在当前网页打开期间生效,所以 token 保存在 sessionStorage中
                    window.sessionStorage.setItem('token', res.data.data)
                    // 2. 通过编程式导航跳转到后台主页,路由地址是/home
                    this.$router.push('/home')
                })
            })
        }
    }
}
</script>

// 支持less语法,scoped控制组件生效范围
<style lang="less" scoped>
// 登录组件的body
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

// 登录盒子
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    // 往左和上移动自身长宽的50%,不然位置会跑到第四象限
    transform: translate(-50%, -50%);
}

// 图片盒子
.avatar_box {
    height: 130px;
    width: 130px;
    border: 2px solid rgb(221, 215, 215);
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    background-color: #fff;
    // 居中: 外盒子的百分之50%-自身x轴的50%
    left: 50%;
    transform: translate(-50%, -50%);
    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #8b929840;
    }
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    // 盒子类型
    box-sizing: border-box;
}

.login_btns {
    // 弹性布局
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

