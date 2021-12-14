<template>
  <div class="articles">
    <banner></banner>
    <div class="site-content animate">
      <!-- 文章目录 -->
      <div id="article-menus">
        <menu-tree :menus="menus" child-label="child"></menu-tree>
      </div>
      <main class="site-main">
        <article class="hentry">
          <!-- 文章头部 -->
          <header class="entry-header">
            <!-- 标题输出 -->
            <h1 class="entry-title">{{ article.title }}</h1>

            <hr />
            <div class="breadcrumbs">
              <div id="crumbs">{{ article.pubTime | parseTime }}</div>
            </div>
            <p class="author">@{{ article.authorName }}</p>
          </header>
          <!-- 正文输出 -->
          <div class="entry-content" v-html="blog" :class="markdownCss"></div>
          <!-- 文章底部 -->
          <section-title>
            <footer class="post-footer">
              <!-- 阅读次数 -->
              <div class="post-like">
                <i class="iconfont iconeyes"></i>
                <span class="count">{{ article.viewsCount }}</span>
              </div>
              <!-- 赞助按钮 -->
              <div class="donate" @click="showDonate = !showDonate">
                <span>赏</span>
                <ul class="donate_inner" :class="{ show: showDonate }">
                  <li class="wedonate">
                    <img
                      src="http://qiniusave.hmetao.cn/weixin_pay/XJLI82YV%29ERBYWUHF6V%7D3T4.png"
                    />
                    <p>微信</p>
                  </li>
                  <li class="alidonate">
                    <img
                      src="http://qiniusave.hmetao.cn/ZFB_pay/PHYQ4MKF%6018XHLNCO%5BQB5HV.png"
                    />
                    <p>支付宝</p>
                  </li>
                </ul>
              </div>
              <!-- 文章标签 -->
              <div class="post-tags">
                <i class="iconfont iconcategory"></i>
                <router-link to="/">Web</router-link>
              </div>
            </footer>
          </section-title>

          <!--声明-->
          <div class="open-message">
            <p>
              声明：Bearblog博客|版权所有，违者必究|如未注明，均为原创|本网站采用<a
                href="https://creativecommons.org/licenses/by-nc-sa/3.0/"
                target="_blank"
                >BY-NC-SA</a
              >协议进行授权
            </p>
            <p>
              转载：转载请注明原文链接 -
              <a href="/">{{ article.title }}</a>
            </p>
          </div>
          <!--评论-->
          <div class="comments">
            <comment-message-editor
              buttonText="回复"
              @submit="submitReply"
            ></comment-message-editor>
            <comment
              v-for="item in comments"
              :key="item.id"
              :comment="item"
              @reply="getComment"
            >
              <template v-if="item.reply.length">
                <comment
                  v-for="reply in item.reply"
                  :key="reply.id"
                  :comment="reply"
                  @reply="getComment"
                ></comment>
              </template>
            </comment>
          </div>
        </article>
      </main>
    </div>
  </div>
</template>

<script>
import commentMessageEditor from 'comment-message-editor'
import Banner from '@/components/banner'
import sectionTitle from '@/components/section-title'
import comment from '@/components/comment'
import menuTree from '@/components/menu-tree'
import { fetchComment, fetchArticle, insertComment } from '../api'
import marked from 'marked'

export default {
  name: 'articles',
  data () {
    return {
      showDonate: false,
      comments: [],
      menus: [],
      article: {},
      blog: '',
      markdownCss: 'markdown-body',
      insertFrom: {
        content: '',
        articleId: ''
      }
    }
  },
  components: {
    Banner,
    sectionTitle,
    comment,
    commentMessageEditor,
    menuTree
  },
  methods: {
    submitReply (v) {
      this.insertFrom.content = v
      this.insertFrom.articleId = this.article.id
      insertComment(this.insertFrom)
        .then(res => {
          if (res.code !== 20000) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('评论成功')
            document.querySelector('.input-box .content').innerText = ''
            this.getComment()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getArticle () {
      fetchArticle(this.$route.params.id)
        .then(res => {
          this.article = res.data || {}
          this.blog = marked(this.article.content)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getComment () {
      fetchComment(this.$route.params.id)
        .then(res => {
          this.comments = res.data.commentList || []
        })
        .catch(err => {
          console.log(err)
        })
    },
    fetchH (arr, left, right) {
      if (right) {
        return arr.filter(
          item => item.offsetTop > left && item.offsetTop < right
        )
      } else {
        return arr.filter(item => item.offsetTop > left)
      }
    },
    // 生成目录
    createMenus () {
      window.setInterval(() => {
        let arr = []
        for (let i = 6; i > 0; i--) {
          const temp = []
          const e = document
            .querySelector('.entry-content')
            .querySelectorAll('h' + i)
          for (let j = 0; j < e.length; j++) {
            const child = this.fetchH(
              arr,
              e[j].offsetTop,
              j + 1 === e.length ? undefined : e[j + 1].offsetTop
            )
            temp.push({
              h: i,
              title: e[j].innerText,
              id: e[j].id,
              offsetTop: e[j].offsetTop,
              child
            })
          }
          if (temp.length) {
            arr = temp
          }
        }
        this.menus = arr
      }, 3000)
    }
  },
  created () {
    this.getArticle()
    this.getComment()
  },
  mounted () {
    this.$nextTick(function () {
      const link = document.createElement('link')
      link.type = 'text/css'
      link.rel = 'stylesheet'
      link.href =
        'https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css'
      document.head.appendChild(link)
      this.createMenus()
    })
  }
}
</script>
<style scoped lang="less">
.alidonate {
  margin-left: 5px;
}
.site-content {
  position: relative;
  .site-main {
    padding: 80px 0 0 0;
    // padding: 0 0 0 0;
  }
}
#article-menus {
  // position: sticky;
  position: absolute;
  top: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 15px;
  width: 300px;
  transform: translateX(-120%) translateY(150px);
  font-size: 14px;
}
article.hentry {
  .entry-header {
    .entry-title {
      font-size: 23px;
      font-weight: 600;
      color: #737373;
      margin: 0.67em 0;

      &:before {
        content: '#';
        margin-right: 6px;
        color: #d82e16;
        font-size: 20px;
        font-weight: 600;
      }
    }

    hr {
      height: 1px;
      border: 0;
      background: #efefef;
      margin: 15px 0;
    }

    .breadcrumbs {
      font-size: 14px;
      color: #d2d2d2;
      text-decoration: none;
      margin-bottom: 10px;
    }
  }

  footer.post-footer {
    width: 100%;
    padding: 20px 10px;
    margin-top: 30px;
    height: 65px;
    position: relative;
    i {
      font-size: 18px;
      margin-right: 5px;
    }
    .post-like {
      float: right;
      margin: 7px 0 0 20px;
    }

    .post-share {
      float: right;
      list-style: none;
      margin-right: 20px;
    }

    .donate {
      float: left;
      line-height: 36px;
      border-radius: 100%;
      -webkit-border-radius: 100%;
      -moz-border-radius: 100%;
      border: 1px solid #2b2b2b;
      &:hover {
        border: 1px solid goldenrod;
        span {
          color: goldenrod;
        }
      }
      span {
        color: #2b2b2b;
        padding: 10px;
        position: relative;
        cursor: pointer;
      }

      .donate_inner {
        display: none;
        margin: 0;
        list-style: none;
        position: absolute;
        left: 80px;
        top: -40px;
        background: #fff;
        padding: 10px;
        border: 1px solid #ddd;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        border-radius: 3px;
        &.show {
          display: block;
        }
        li {
          float: left;
        }

        img {
          width: 100px;
        }
        p {
          text-align: center;
          font-size: 15px;
          color: #d2d2d2;
          line-height: 1rem;
        }
      }

      .donate_inner:after,
      .donate_inner:before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 45%;
        margin-left: -8px;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 8px solid #fff;
      }

      .donate_inner:before {
        left: -1px;
        border-right: 8px solid #ddd;
      }
    }

    .post-tags {
      margin: 7px 0 0 20px;
      float: left;
      text-transform: uppercase;
      a:hover {
        color: #ff6d6d;
      }
    }
  }
  .open-message {
    margin: 50px 0;
    position: relative;
    background: #2b2b2b;
    padding: 10px 30px;
    border-radius: 3px;
    font-size: 14px;
    color: #fff;
    &:after {
      content: '';
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #2b2b2b;
      position: absolute;
      top: -8px;
      left: 48%;
    }
    p {
      margin: 10px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    a {
      color: #a0dad0;
      padding: 0 5px;
    }
  }
}
.author {
  margin-bottom: 15px;
}
</style>
