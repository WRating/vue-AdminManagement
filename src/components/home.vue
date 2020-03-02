<!-- 整体布局：先上下划分，再左右划分 -->

<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/title.png" alt />
        <span>点单小程序后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          :default-active="$route.path"

          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <!-- index只接收字符串，不接收数字，而item.id是一个数值，可以在item.id后面加上一个空字符串 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>{{item.name}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menuList: [
        {
          id: 1,
          name: '用户管理',
          children: [
            {
              id: 1,
              name: '用户列表',
              path: 'users'
            }
          ]
        },
        {
          id: 2,
          name: '权限管理',
          children: [
            {
              id: 1,
              name: '1',
              path: '1'
            },
            {
              id: 2,
              name: '2',
              path: '2'
            },
            {
              id: 3,
              name: '3',
              path: '3'
            }
          ]
        },
        {
          id: 3,
          name: '商品管理',
          children: [
            {
              id: 1,
              name: '1'
            },
            {
              id: 2,
              name: '2'
            },
            {
              id: 3,
              name: '3'
            }
          ]
        },
        {
          id: 4,
          name: '订单管理',
          children: [
            {
              id: 1,
              name: '1'
            },
            {
              id: 2,
              name: '2'
            },
            {
              id: 3,
              name: '3'
            }
          ]
        },
        {
          id: 5,
          name: '数据统计',
          children: [
            {
              id: 1,
              name: '1'
            },
            {
              id: 2,
              name: '2'
            },
            {
              id: 3,
              name: '3'
            }
          ]
        }
      ],
      //是否折叠
      isCollapse: false

    }
  },
  created() {
    // this.getMenuList()
  },
  methods: {
    exit() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // // 获取所有菜单
    // async getMenuList() {
    //   const { data: res } = await this.$axios.get('/common/queryAllFood')
    //   if (res.Result !== "查询菜品信息成功") return this.$message.error(res.Result)
    //   this.FoodList = res.FoodList
    //   console.log(res)
    // },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
      margin-left: 10px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>