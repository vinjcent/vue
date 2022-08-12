<template>
    <div class="main-container">
        <el-container>
            <!-- Header头布局 -->
            <el-header>
                <div class="header-content">
                    <img src="../assets/shop.png" alt="" />
                    <span>电商后台管理系统</span>
                </div>
                <el-button
                    type="info"
                    icon="el-icon-position"
                    @click="logout"
                    size="medium"
                    plain
                    >退出
                </el-button>
            </el-header>

            <!-- 页面主题区域 -->
            <el-container>
                <!-- 侧边栏 -->
                <el-aside :width="isCollapse ? '64px' : '200px'">
                    <div class="toggle-button" @click="toggleCollapse">|||</div>
                    <!-- 侧边栏菜单区 -->
                    <el-menu
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#409EFF"
                        unique-opened
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        router
                        :default-active="activedPath"
                    >
                        <!-- 一级菜单 -->
                        <el-submenu
                            :index="item.id + ''"
                            v-for="item in menuList"
                            :key="item.id"
                        >
                            <!-- 一级菜单的模板区 -->
                            <template slot="title">
                                <!-- 图标 -->
                                <i
                                    :class="iconsObj[item.id]"
                                    id="first-icon"
                                ></i>
                                <!-- 文本 -->
                                <span>{{ item.authName }}</span>
                            </template>

                            <!-- 二级菜单 -->
                            <el-menu-item
                                :index="subItem.path"
                                v-for="subItem in item.children"
                                :key="subItem.id"
                                @click="saveNavState(subItem.path)"
                            >
                                <template slot="title">
                                    <!-- 图标 -->
                                    <i class="el-icon-menu"></i>
                                    <!-- 文本 -->
                                    <span>{{ subItem.authName }}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-container>
                    <!-- 右侧内容 -->
                    <el-main>
                        <!-- 路由占位符 -->
                        <router-view />
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 左侧菜单数据
            menuList: [],
            iconsObj: {
                101: 'el-icon-user-solid',
                102: 'el-icon-s-management',
                103: 'el-icon-s-goods',
                104: 'el-icon-s-order',
                105: 'el-icon-data-analysis'
            },
            // 是否折叠
            isCollapse: false,
            // 被激活的链接地址
            activedPath: ''
        }
    },
    // 初始化之前运行
    created() {
        this.getMenuList()
        this.activedPath = window.sessionStorage.getItem('activedPath')
    },
    methods: {
        logout() {
            // window.sessionStorage.removeItem("token") // 只删除一个键值为'token'的token
            window.sessionStorage.clear() // 直接清空sessionStorage
            this.$router.push('/login')
        },
        // 获取所有的菜单
        getMenuList() {
            // 声明请求
            let req
            req = this.$http
            // 调用get方法
            req.get('/menus', {
                headers: {
                    Accept: '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded'
                    // 'AUTHORIZATION': sessionStorage.getItem('token')
                }
            }).then((res) => {
                if (res.status !== 200 || res.data.code !== 200)
                    return this.$message({
                        showClose: true,
                        message: '获取信息失败',
                        type: 'error'
                    })
                console.log(res)
                this.menuList = res.data.data
            })
        },
        // 点击按钮,切换菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        // 保存链接的激活状态
        saveNavState(activedPath) {
            // 将activedPath存入sessionStorage
            window.sessionStorage.setItem('activedPath', activedPath)
            // 更新当前的activedPath数据模型
            this.activedPath = activedPath
        }
    }
}
</script>

<style lang="less" scoped>
.main-container {
    height: 100%;
}

.main-container .el-container {
    height: 100%;
}

.el-header {
    // 设置为流动布局
    display: flex;
    // 左右贴边对齐
    justify-content: space-between;
    // 子项目竖直居中
    align-items: center;
    // 内容贴边对齐
    padding-left: 0;
    // 文字颜色
    color: #fff;
    // 文字大小
    font-size: 20px;
    // 嵌套子元素
    > div {
        // 设置为流动布局
        display: flex;
        // 设置子元素竖直居中
        align-items: center;
        img {
            margin-left: 5px;
            width: 45px;
            height: 45px;
        }
        span {
            margin-left: 15px;
        }
    }

    background-image: linear-gradient(-90deg, #596164 1%, #868f96 99%);
}

.el-aside {
    background-color: #545c64;
    .el-menu {
        border-right: none;
    }
}

.el-main {
    background-color: #eaedf1;
}

#first-icon {
    width: 18px;
    height: 18px;
    // 右边距
    margin-right: 10px;
}

.toggle-button {
    background-color: #4a5064;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
