<template>
  <div
    id="layout-header"
    :class="{ fixed: fixed, hidden: hidden }"
    @click.stop="mobileShow = false"
  >
    <div class="site-logo">
      <router-link to="/">
        <img src="@/assets/site-logo.svg" alt="" />
        <p class="site-name">BearBlog</p>
      </router-link>
    </div>
    <div class="menus-btn" @click.stop="mobileShow = !mobileShow">
      Menus
    </div>
    <div
      class="site-menus"
      :class="{ mobileShow: mobileShow }"
      @click.stop="mobileShow = !mobileShow"
    >
      <div class="menu-item header-search"><header-search /></div>
      <div class="menu-item"><router-link to="/">首页</router-link></div>
      <div class="menu-item" @click="dialogVisible = true" v-if="!user_login">
        <a href="javascript:;">登录</a>
      </div>

      <div class="menu-item hasChild">
        <a href="#">分类</a>
        <div class="childMenu" v-if="category.length">
          <div class="sub-menu" v-for="item in category" :key="item.id">
            <router-link :to="`/category/${item.title}/${item.id}`">{{
              item.title
            }}</router-link>
          </div>
        </div>
      </div>
      <div class="menu-item"><router-link to="/friend">友链</router-link></div>
      <div class="menu-item"><router-link to="/about">关于</router-link></div>
      <div class="menu-item" v-if="user_login">
        <el-avatar size="small" :src="userInfo.avatar"></el-avatar>
        {{ userInfo.username }}
        <a href="javascript:;" @click="logout()">退出</a>
      </div>
    </div>
    <!-- 登录框 -->
    <el-dialog
      title="登录"
      class="t"
      :visible.sync="dialogVisible"
      @close="closeDialog"
      @open="openDialog"
      :width="dialogWidth"
      append-to-body
    >
      <!-- 表单 -->
      <el-form
        label-width="0px"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            placeholder="请输入用户名"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <div id="verifyBox">
        <slide-verify
          class="verify"
          ref="slideblock"
          @again="onAgain"
          @fulfilled="onFulfilled"
          @success="onSuccess"
          @fail="onFail"
          @refresh="onRefresh"
          :accuracy="accuracy"
          :slider-text="text"
          :imgs="imgList"
        ></slide-verify>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetLoginForm()">取 消</el-button>
        <el-button type="primary" @click="login()">登录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderSearch from '@/components/header-search'
import { fetchCategory, logout, login, userInfo } from '../../api'
export default {
  name: 'layout-header',
  components: { HeaderSearch },
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      userInfo: {},
      user_login: false,
      msg: '',
      text: '向右滑',
      // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      accuracy: 15,
      imgList: [
        'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=173105354,4176936206&fm=26&gp=0.jpg'
      ],
      lastScrollTop: 0,
      dialogWidth: '30%',
      fixed: false,
      hidden: false,
      category: [],
      mobileShow: false,
      dialogVisible: false,
      slide_verify: false,
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 17, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 13, message: '长度在 3 到 13 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    user_login () {
      if (this.user_login) this.getUserInfo()
    }
  },
  mounted () {
    window.addEventListener('scroll', this.watchScroll)
    this.fetchCategory()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.watchScroll)
  },
  created () {
    if (JSON.parse(window.localStorage.getItem('token'))) {
      this.user_login = true
    }
  },
  methods: {
    openDialog () {
      var val = document.body.clientWidth
      if (val < 960) {
        this.dialogWidth = '90%'
      }
    },
    closeDialog () {
      this.$refs.slideblock.reset()
      this.slide_verify = false
    },
    async getUserInfo () {
      const token = JSON.parse(window.localStorage.getItem('token'))
      userInfo(token)
        .then(res => {
          if (res.code !== 200) {
            this.user_login = false
            this.userInfo = {}
            return this.$message.error(res.msg)
          }
          this.userInfo = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    logout () {
      logout()
        .then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: '退出成功',
            duration: '1000',
            type: 'success'
          })
          window.localStorage.removeItem('token')
          this.user_login = false
          this.userInfo = {}
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 重置表单函数
    resetLoginForm () {
      this.dialogVisible = false
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      const qs = require('qs')
      const data = qs.stringify({
        username: this.loginForm.username,
        password: this.loginForm.password
      })
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid || !this.slide_verify) {
          return false
        }
        login(data)
          .then(res => {
            if (res.code !== 200) {
              this.$message.error(res.msg)
              this.slide_verify = false
              return false
            }
            this.$message({
              message: '登录成功',
              duration: '1000',
              type: 'success'
            })
            window.localStorage.setItem('token', JSON.stringify(res.token))
            // window.sessionStorage.setItem('token', res.token)
            this.dialogVisible = false
            this.slide_verify = false
            this.user_login = true
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    watchScroll () {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      if (scrollTop === 0) {
        this.fixed = false
      } else if (scrollTop >= this.lastScrollTop) {
        this.fixed = false
        this.hidden = true
      } else {
        this.fixed = true
        this.hidden = false
      }
      this.lastScrollTop = scrollTop
    },
    fetchCategory () {
      fetchCategory()
        .then(res => {
          this.category = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    onSuccess (times) {
      this.msg = `验证成功, 耗时${(times / 1000).toFixed(1)}s`
      this.$message.success(this.msg)
      this.slide_verify = true
    },
    onFail () {
      this.msg = '验证不通过'
    },
    onRefresh () {
      this.msg = '点击了刷新小图标'
    },
    onFulfilled () {
      console.log('刷新成功啦！')
    },
    onAgain () {
      console.log('检测到非人为操作的哦！')
      this.msg = 'try again'
      // 刷新
      this.$refs.slideblock.reset()
    },
    handleClick () {
      // 父组件直接可以调用刷新方法
      this.$refs.slideblock.reset()
    }
  }
}
</script>

<style scoped lang="less">
.verify {
  display: inline-block;
}
.t {
  text-align: center;
}
#layout-header {
  position: fixed;
  top: 0;
  z-index: 9;
  width: 100%;
  height: 80px;
  padding: 0 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s all ease;
  -webkit-transition: 0.3s all ease;
  -moz-transition: 0.3s all linear;
  -o-transition: 0.3s all ease;
  -ms-transition: 0.3s all ease;
  &.hidden {
    top: -100px;
  }
  &.fixed {
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}

.site-logo {
  text-align: center;

  img {
    width: 60px;
    height: 60px;
  }

  p.site-name {
    font-size: 15px;
    font-weight: bold;
    position: relative;
    top: -10px;
  }
}
.menus-btn {
  display: none;
  visibility: hidden;
}
.site-menus {
  display: flex;
  align-items: center;

  .menu-item {
    min-width: 60px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: relative;
    a {
      padding: 12px 10px;
      color: #545454;
      font-weight: 500;
      font-size: 16px;
      &:hover {
        color: #ff6d6d;
      }
    }
    &:not(:last-child) {
      margin-right: 15px;
    }
    &.hasChild:hover .childMenu {
      opacity: 1;
      visibility: visible;
      transform: translateY(-5px);
    }
  }
  .childMenu {
    width: 130px;
    background-color: #fdfdfd;
    border-radius: 3px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 55px;
    z-index: 2;
    opacity: 0;
    visibility: hidden;
    transition: 0.7s all ease;
    -webkit-transition: 0.6s all ease;
    -moz-transition: 0.6s all linear;
    -o-transition: 0.6s all ease;
    -ms-transition: 0.6s all ease;
    &:before,
    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 8px solid white;
      top: -8px;
      left: 20px;
    }
    &:before {
      top: -9px;
      border-bottom: 8px solid #ddd;
    }
    .sub-menu {
      height: 40px;
      line-height: 40px;
      position: relative;
      &:not(:last-child):after {
        /*position: absolute;*/
        content: '';
        width: 50%;
        height: 1px;
        color: #ff6d6d;
        bottom: 0;
        left: 25%;
        z-index: 99;
      }
    }
  }
}
@media (max-width: 960px) {
  #layout-header {
    padding: 0 20px;
  }
}
@media (max-width: 600px) {
  .el-dialog {
    width: 100%;
  }
  #layout-header {
    padding: 0 10px;
  }
  .menus-btn {
    display: block;
    visibility: visible;
  }
  .site-menus {
    position: absolute;
    display: none;
    visibility: hidden;
    background-color: #f9f9f9;
    width: 100%;
    left: 0;
    top: 80px;
    z-index: -9;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .menu-item {
      position: relative;
      height: unset;
      &:not(:last-child) {
        margin-right: 0;
      }
    }
    .childMenu {
      position: relative;
      width: 100%;
      top: 0;
      background-color: #f3f3f3;
      opacity: 1;
      visibility: visible;
      border: none;
      box-shadow: none;
      &:before,
      &:after {
        content: '';
        position: relative;
        width: 0;
        height: 0;
        border-left: 0;
        border-right: 0;
        border-bottom: 0;
      }
    }
  }
  .site-menus.mobileShow {
    display: inline-block;
    visibility: visible;
    z-index: 99;
  }
}
.el-avatar {
  vertical-align: middle;
}
</style>
