<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入关键字" v-model="query" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 点击添加商品按钮之后出现的弹框 -->
      <el-dialog title="添加商品" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区 -->
        <el-form :model="addForm" ref="addFormRef" label-width="70px">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="prices">
            <el-input v-model="addForm.prices"></el-input>
          </el-form-item>
          <el-form-item label="商品图片" prop="pictureFileURL">
            <el-input v-model="addForm.pictureFileURL"></el-input>
          </el-form-item>
          <el-form-item label="商品描述" prop="description">
            <el-input v-model="addForm.description"></el-input>
          </el-form-item>
          <el-form-item label="商品类型" prop="type">
            <el-input v-model="addForm.type"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addGoods">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 商品列表区域 -->
      <el-table
        :data="goodsList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        stripe
        border
      >
        <el-table-column prop="id" label="商品ID" width="65"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="80"></el-table-column>
        <el-table-column prop="prices" label="商品价格" width="80"></el-table-column>
        <el-table-column prop="pictureFileURL" label="商品图片"></el-table-column>
        <el-table-column prop="description" label="商品描述"></el-table-column>
        <el-table-column prop="type" label="商品类型" width="80"></el-table-column>
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
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeById(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 修改商品信息的对话框 -->
      <el-dialog
        title="修改商品信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
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
        :total="goodsList.length"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsList: [],
      //获取商品列表的参数对象
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
        name: '',
        prices: '',
        description: '',
        pictureFileURL: '',
        type: ''
      },

      //控制编辑用户对话框的显示与隐藏
      editDialogVisible: false,
      //获取到的用户信息对象
      editForm: {
        id: '',
        name: '',
        pictureFileURL: ''
      },
      editFormRules: {
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
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$axios.get('https://lipiao.top/restaurantApi/common/queryAllFood')
      console.log(res)
      if (res.Result !== '查询菜品信息成功') {
        return this.$message.error('获取商品列表失败!')
      }
      this.$message.success('获取商品列表成功!')
      //把服务器传来的用户数据赋值给useList
      this.goodsList = res.FoodList
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
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return //验证不通过，直接阻止这次请求
        const { data: res } = await this.$axios.post(
          '/admin/addFood',
          this.$qs.stringify(this.addForm)
        )
        console.log(res)
        this.dialogVisible = false
        //重新获取用户列表数据
        this.getGoodsList()
      })
    },
    //展示编辑用户信息的对话框
    showEditDialog(e) {
      this.editDialogVisible = true
      this.editForm = e
    },
    //监听编辑用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //修改用户信息并提交
    editUserInfo() {
      console.log('无修改用户信息接口')
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
    },
    //删除该条商品信息
    async removeById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      ).catch(err => err)
      if(confirmResult!=="confirm"){
        return this.$message.info('已经取消删除！')
      }
      // 如果用户想删除，调用删除接口
      //   const { data: res } = await this.$axios.post(
      //     'https://lipiao.top/restaurantApi/user/addUser',
      //     this.$qs.stringify(this.eidtForm)
      //   )
      //   console.log(res)
      // if (res.Result !== '查询菜品信息成功') {
      //   return this.$message.error('删除失败!')
      // }
      // this.$message.success('删除成功!')
      // this.getGoodsList()

    }
  }
}
</script>
<style lang="less" scoped>
</style>