<template>
  <div class="about">
    <div class="site-content">
      <div class="content-warp">
        <div class="about-site about-info">
          <section-title><span>❤</span>关于博客</section-title>
          <div class="info-card">
            <p>一个平平无奇的个人博客。</p>
            <p>
              前端使用的
              <a
                target="_blank"
                class="out-link"
                style="color: #ff6d6d;"
                href="https://gitee.com/fengziy/Gblog?_from=gitee_search"
                >fengziy </a
              >大佬的博客模板，后端使用的是SSM。
            </p>
            <p>十分感谢大佬提供的前端模板，省了不少时间。</p>
            <p>博客前后端源码已开源 ! ! !</p>
            <p>
              <a
                target="_blank"
                href="https://gitee.com/HMETAO/vue_-gblog"
                style="color: #ff6d6d;"
                >前台Gitee仓库</a
              >
              |
              <a
                target="_blank"
                href="https://gitee.com/HMETAO/vue_gblog_admin"
                style="color: #ff6d6d;"
                >后台Gitee仓库</a
              >
              |
              <a
                target="_blank"
                href="https://gitee.com/HMETAO/j_hmetao_gblog"
                style="color: #ff6d6d;"
                >后端Gitee仓库</a
              >
              记得star★哟
            </p>
          </div>
        </div>
        <div class="about-me about-info">
          <section-title id="Guestbook"><span>❤</span>给我留言</section-title>
          <div class="info-card">
            <div class="contactForm">
              <div class="form-item">
                <label for="mail">邮箱</label>
                <input class="v" type="email" v-model="list.email" id="mail" />
              </div>
              <div class="form-item">
                <label for="content">内容</label>
                <textarea
                  class="v"
                  id="content"
                  v-model="list.content"
                ></textarea>
              </div>
              <div class="form-item">
                <label></label>
                <button @click="sendEmail">提交</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import sectionTitle from '@/components/section-title'
// import { getTime, getTimeInterval } from '@/utils'
// import Quote from "@/components/quote";
import { sendEmail } from '../api'
export default {
  name: 'About',
  data () {
    return {
      list: {}
    }
  },
  components: {
    // Quote,
    sectionTitle
  },
  methods: {
    sendEmail () {
      sendEmail(this.list)
        .then(res => {
          if (res.code !== 20000) {
            return this.$message.error(res.msg)
          }
          this.$message.success('发送成功')
          this.list = {}
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {}
}
</script>
<style scoped lang="less">
.about {
  padding-top: 40px;
}

.content-warp {
  margin-top: 80px;

  .about-info {
    margin: 30px 0;

    span {
      color: red;
      margin-right: 10px;
    }

    .info-card {
      min-height: 100px;
      padding: 20px;
      border-radius: 3px;
      margin: 30px 0 50px 0;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      p {
        line-height: 1.7rem;
      }
    }
  }
  .contactForm {
    width: 100%;
    padding: 20px;
    .form-item {
      align-items: center;
      display: flex;
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      label {
        width: 80px;
      }
      .v {
        min-height: 40px;
        line-height: 20px;
        border-radius: 3px;
        padding: 2px 10px;
        outline: none;
        border: 1px solid #8fd0cc;
        width: 100%;
        resize: vertical;
      }
      button {
        width: 100px;
        height: 40px;
        border-radius: 3px;
        outline: 0;
        border-style: none;
        cursor: pointer;
        background-color: #409eff;
        color: white;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}

/*******/
@media (max-width: 800px) {
  .content-warp {
    margin-top: 0;
  }
}
</style>
