<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="query" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 点击添加用户按钮之后出现的弹框 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户id" prop="id">
            <el-input v-model="addForm.id"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="用户名" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 用户列表区域 -->
      <el-table :data="userList.slice((currentPage-1)*pagesize,currentPage*pagesize)" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="pictureFileURL" label="图片"></el-table-column>
        <el-table-column label="操作" width="120">
          <!-- 通过scope.row获取到当前这一行的数据 -->
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 内容主体区 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户id">
            <el-input v-model="editForm.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="pictureFileURL">
            <el-input v-model="editForm.pictureFileURL"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userList.length"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userList: [],
      //获取用户列表的参数对象
      query: '',
      //当前的页数
      currentPage: 1,
      //当前页面显示条数
      pagesize: 10,
      //控制添加用户对话框的显示与隐藏
      dialogVisible: false,
      //添加用户的表单数据
      addForm: {
        id: '',
        name: ''
      },
      //这是表单的验证规则对象
      addFormRules: {
        //验证用户名是否合法
        id: [
          { required: true, message: '请输入id', trigger: 'blur' }, //blur表示文本框失去焦点的时候触发验证行为
          { min: 1, max: 10, message: '请输入正确id', trigger: 'blur' }
        ],
        //验证密码是否合法
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      //控制编辑用户对话框的显示与隐藏
      editDialogVisible: false,
      //获取到的用户信息对象
      editForm: {
        id: '',
        name: '',
        pictureFileURL: ''
      },
      editFormRules:{
        //验证密码是否合法
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        //验证密码是否合法
        pictureFileURL: [
          { required: true, message: '请输入图片地址', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get('/user/queryAllUser')
      console.log(res)
      if (res.Result !== '查询所有用户信息成功') {
        return this.$message.error('获取用户列表失败!')
      }
      //把服务器传来的用户数据赋值给useList
      this.userList = res.UserList
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.pagesize = newSize
      console.log(newSize)
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      console.log(newPage)
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return //验证不通过，直接阻止这次请求
        const { data: res } = await this.$axios.post(
          'user/addUser',
          this.$qs.stringify(this.addForm)
        )
        console.log(res)
        this.dialogVisible = false
        //重新获取用户列表数据
        this.getUserList()
      })
    },
    //展示编辑用户信息的对话框
    showEditDialog(e) {
      this.editDialogVisible = true
      this.editForm = e
    },
    //监听编辑用户对话框的关闭事件
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息并提交
    editUserInfo(){
      console.log("无修改用户信息接口")
      // this.$refs.editFormRef.validate(async valid => {
      //   console.log(valid)
      //   if (!valid) return //验证不通过，直接阻止这次请求
      //   const { data: res } = await this.$axios.post(
      //     'user/addUser',
      //     this.$qs.stringify(this.eidtForm)
      //   )
      //   console.log(res)
      //   this.editDialogVisible = false
      //   //重新获取用户列表数据
      //   this.getUserList()
      // })

    }
  }
}
</script>
<style lang="less" scoped>
</style>