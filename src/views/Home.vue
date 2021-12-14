<template>
  <div class="home">
    <banner isHome="true"></banner>
    <div class="site-content animate">
      <!--通知栏-->
      <div class="notify">
        <div class="search-result" v-if="hideSlogan">
          <span v-if="searchWords">搜索结果："{{ searchWords }}" 相关文章</span>
          <span v-else-if="category">分类 "{{ category }}" 相关文章</span>
        </div>
        <quote v-else>{{ notice }}</quote>
      </div>

      <!--焦点图-->
      <div class="top-feature" v-if="!hideSlogan">
        <section-title>
          <div style="display: flex;align-items: flex-end;">
            聚焦<small-ico></small-ico>
          </div>
        </section-title>
        <div class="feature-content">
          <div class="feature-item" v-for="item in features" :key="item.title">
            <Feature :data="item"></Feature>
          </div>
        </div>
      </div>
      <!--文章列表-->
      <main class="site-main" :class="{ search: hideSlogan }">
        <section-title v-if="!hideSlogan">推荐</section-title>
        <template v-for="item in postList">
          <post :post="item" :key="item.id"></post>
        </template>
      </main>

      <!--加载更多-->
      <div class="more" v-if="hasNextPage">
        <div class="more-btn" @click="loadMore">More</div>
      </div>
      <div class="load-end" v-else>--------- 我也是有底线的啦 ---------</div>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/banner'
import Feature from '@/components/feature'
import sectionTitle from '@/components/section-title'
import Post from '@/components/post'
import SmallIco from '@/components/small-ico'
import Quote from '@/components/quote'
import { fetchFocus, fetchList, search } from '../api'

export default {
  name: 'Home',
  props: ['cate', 'words'],
  data () {
    return {
      features: [],
      postList: [],
      currPage: 1,
      hasNextPage: false
    }
  },
  components: {
    Banner,
    Feature,
    sectionTitle,
    Post,
    SmallIco,
    Quote
  },
  computed: {
    searchWords () {
      return this.$route.params.words
    },
    category () {
      return this.$route.params.cate
    },
    hideSlogan () {
      if (this.category) {
        this.categoryArticle()
        return true
      } else if (this.searchWords) {
        this.search()
        return true
      } else {
        this.fetchFocus()
        this.fetchList()
        return false
      }
    },
    notice () {
      return this.$store.getters.notice
    }
  },
  methods: {
    search () {
      const query = { search: this.$route.params.words }
      search(query).then(res => {
        this.postList = res.data.list || []
        this.currPage = res.data.page
        this.hasNextPage = res.data.hasNextPage
      })
    },
    categoryArticle () {
      const query = { categoryId: this.$route.params.cateId }
      fetchList(query).then(res => {
        this.postList = res.data.list || []
        this.currPage = res.data.pageNum
        this.hasNextPage = res.data.hasNextPage
      })
    },
    fetchFocus () {
      fetchFocus()
        .then(res => {
          this.features = res.data.list || []
        })
        .catch(err => {
          console.log(err)
        })
    },
    fetchList () {
      fetchList()
        .then(res => {
          this.postList = res.data.list || []
          this.currPage = res.data.pageNum
          this.hasNextPage = res.data.hasNextPage
        })
        .catch(err => {
          console.log(err)
        })
    },
    loadMore () {
      const query = {
        page: this.currPage + 1,
        categoryId: this.$route.params.cateId,
        search: this.$route.params.words
      }
      fetchList(query).then(res => {
        this.postList = this.postList.concat(res.data.list || [])
        this.currPage = res.data.pageNum
        this.hasNextPage = res.data.hasNextPage
      })
    }
  },
  mounted () {}
}
</script>
<style scoped lang="less">
.site-content {
  .notify {
    margin: 60px 0;
    border-radius: 3px;
    & > div {
      padding: 20px;
    }
  }

  .search-result {
    padding: 15px 20px;
    text-align: center;
    font-size: 20px;
    font-weight: 400;
    border: 1px dashed #ddd;
    color: #828282;
  }
}

.top-feature {
  width: 100%;
  height: auto;
  margin-top: 30px;

  .feature-content {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    position: relative;

    .feature-item {
      width: 32.9%;
    }
  }
}

.site-main {
  padding-top: 80px;

  &.search {
    padding-top: 0;
  }
}

.more {
  margin: 50px 0;
  .more-btn {
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #adadad;
    border: 1px solid #adadad;
    border-radius: 20px;
    margin: 0 auto;
    cursor: pointer;
    &:hover {
      color: #8fd0cc;
      border: 1px dashed #8fd0cc;
    }
  }
}

.load-end {
  text-align: center;
  margin: 50px 0;
}
/******/
@media (max-width: 800px) {
  .top-feature {
    display: none;
  }

  .site-main {
    padding-top: 40px;
  }

  .site-content {
    .notify {
      margin: 30px 0 0 0;
    }

    .search-result {
      margin-bottom: 20px;
      font-size: 16px;
    }
  }
}

/******/
</style>
