<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avater_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password" show-password></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        // username: '11111',
        // password: '11111',
        // userKind:2
        username: 'XXXXX',
        password: 'xxxxxxxxxx'
        // username: '',
        // password: ''
      },
      test: {
        id: 1
      },
      //这是表单的验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }, //blur表示文本框失去焦点的时候触发验证行为
          { min: 3, max: 10, message: '请输入正确用户名', trigger: 'blur' }
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //点击重置按钮，重置登录表单
    reset() {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return //验证不通过，直接阻止这次请求
        //由于目前没有接口，暂时跳过接口请求，在验证通过之后直接执行登录成功，继续往下执行
        //发起http请求
        //第一种方法
        // const result = await this.$http.post('请求路径',this.loginForm);
        // console.log(result);
        //第二种，直接获取返回数据的data
        const { data: res } = await this.$axios.post(
          'https://api.jakting.com/v1/news/netease/conn/login.php',
          this.$qs.stringify(this.loginForm)
        )
        console.log(res)
        // if (res.status!==200) return this.$message.error('登录失败！')

        // this.$message.success('登录成功！')
        //1. 将登录成功之后的token保存到客户端的sessionStorage中
        //1.1 项目中除了登陆之外的接口必须在登录之后才能访问
        //1.2 token只在当前网站打开期间有效，所以将token保存在sessionStorage中
        // window.sessionStorage.setItem("token",res.data.token);
        window.sessionStorage.setItem('token', this.test.id) //暂时先将自己写的id作为token测试
        //2. 通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avater_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>