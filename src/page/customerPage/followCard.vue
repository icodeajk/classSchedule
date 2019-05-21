<template>

  <div class="customer-cont template-cont">
    <loading-view :showLoading="loading"></loading-view>
    <header-switch :title="title">
      <a slot="left">
        <mt-button icon="back" @click="$router.push(historyState[historyState.length-2])"></mt-button>
      </a>
    </header-switch>
    <div class="label-cont">
      <mt-cell :title="this.$route.query.name" class="title" is-link value="" @click.native = "editBox">
      </mt-cell>
    </div>
    <mt-search v-model="searchVal" cancel-text="取消" placeholder="请输入企业名称">
    </mt-search>
    <filter-list :total="total" :total_before="'共'" :total_after="navActive?'个企业':'个企业'"  :actions='filterListArr' :activeSelect="filterListActive" @changeActive="changActive($event)">
    </filter-list>
    <scroll-view :class=" navActive? 'container ':'container bigger'" :data="data" :pullup="true" @scrollToEnd="onPullingUp" :navActive="navActive">
      <div>
        <customer-list :data="data" :total="total" v-if="!loading&&data.length>0" :navActive="navActive"></customer-list>
        <empty-page v-else-if="!searchVal" :topMessage="topMessage" :bottomMessage="bottomMessage"></empty-page>
        <empty-page v-else></empty-page>
        <div class="get-more" v-if="getMoreText">{{getMoreText}}</div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
import customerSrv from '@/api/customerSrv'
import customerList from '@/components/customerCard.vue'
import headerSwitch from '@/components/headerSwitch.vue'
import filterList from '@/components/filterList.vue'
import emptyPage from '@/components/emptyPage.vue'
import { MessageBox } from 'mint-ui';
import { Toast } from 'mint-ui'
import bus from '@/bus.js'

export default {
  data() {
    return {
      loading: false,
      scroll: null,
      scrollSize: 10,
      topMessage: '您还未添加关注的企业',
      bottomMessage: '请选择企业，点击关注，添加入关注分组吧',
      scrollOffset: 0,
      title: '我的关注分组',
      total: 0,
      navActive: true,
      scrollbar:false,
      data: [],
      searchVal: '',
      getMoreText: '',
      name: this.$route.query.name,
      list_id: this.$route.query.list_id,
      count: this.$route.query.count,
      filterListArr: [
        {
          name: '默认',
          key: ''
        },
        {
          name: '最大注册资本',
          key: 'MAX_CAPITAL'
        },
        {
          name: '最小注册资本',
          key: 'MIN_CAPITAL'
        },
        {
          name: '最早成立企业',
          key: 'MIN_REGISTER_DATE'
        },
        {
          name: '最新成立企业',
          key: 'MAX_REGISTER_DATE'
        }
      ],
      filterListActive: {
        name: '默认',
        key: ''
      },
    }
  },
  mounted() {
    this.getFollowList(this.type)
    bus.$on('total', (total) => {
      this.total = total
    })
  },
  computed: {
    type() {
      return this.navActive ? 'follows' : 'monitors'
    }
  },
  created() {
    this.$watch('searchVal', this.debounce((newSearchText) => {
      this.getMoreText = ''
      this.scrollOffset = 0;
      this.getFollowList(this.type)
    }, 500))
  },
  watch: {
    // searchVal(val) {
    //   this.scrollOffset = 0
    //   this.getFollowList(this.type)
    // },
    navActive() {

      this.scrollOffset = 0
      this.data = []
      this.getMoreText=''
      this.filterListActive= {
        name: '默认',
        key: ''
      }
      this.getFollowList(this.type)
    },
    filterListActive:{
        handler: function(val, oldVal) {
        if (val.key === oldVal.key) return
        this.scrollSize = 10
        this.scrollOffset = 0
        this.getMoreText=''
        this.getFollowList(this.type)
      },
      deep: true

    }
  },
  methods: {
    changActive(item) {
      this.filterListActive = item
      // this.getCustomerList()
    },

    getFollowList(type, loadMore = false) {
      if(!loadMore){ this.loading = true}
      let keyword = this.searchVal ? this.searchVal : ''
      if (type === 'follows') {
        let postData = {
          keyword: keyword,
          offset: loadMore ? this.scrollSize * ++this.scrollOffset : 0,
          sort_field: this.filterListActive.key ? this.filterListActive.key : null,
          size: this.scrollSize,
          listId: this.list_id,
          count: 10
        }

        customerSrv.companyInfo(postData).then(res => {
          if (loadMore) {
            this.data = this.data.concat(res.data.results)
          } else {
            // this.data =[].concat(res.data.results)
            this.data=res.data.results
          }
          this.total = res.data.total
          this.loading = false;
        }).catch(err => {
          this.loading = false;
        })
      }
    },

    onPullingUp() {
      // return ;
      if (this.scrollSize * (this.scrollOffset + 1) >= this.total) {
        this.getMoreText = ''
        return
      }

      this.getMoreText = '加载中...'
      this.getFollowList(this.type, true)
    },
    getMoreBrief(data,loadMore) {
      if (Array.isArray(data) && data.length) {
        let companys = []
        let monitorTime=[]
        for (let index = 0; index < data.length; index++) {
          companys.push(data[index].company_name)
          monitorTime.push(data[index].create_time)
        }
        customerSrv.companyBrief({ monitorTime,companys,notSort: 1, shortBrief: 1 }).then(res => {
          if(loadMore){
            this.data = this.data.concat(res.data)
          }
          else{
            this.data=res.data
          }
          this.loading = false
        }).catch(err => {
          this.loading = false;
        })
      }
      else {
        this.data = []
        this.loading = false
      }
    },
    editList(name) {
      let postData = {
        name: name,
        id: this.list_id
      }
      customerSrv.editGroup(postData).then(res => {
        console.log(res)
        if (res !== undefined) {
          this.$router.push({path: '/followCard' ,query: {name:this.name, list_id: this.list_id}});
        }
      })
    },
    editBox() {
      // MessageBox.prompt('修改分组名称').then(({ value, action }) => {

      // });
      let that = this;
      MessageBox.prompt('',{
        message: '修改分组名称',
        title: '',
        showConfirmButton:true,
        showCancelButton:true,
        showInput: true,
        cancelButtonClass: 'cancelButton',
        confirmButtonClass: 'msgBoxConfirmButton',
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        inputValidator: (val) => {
          if (val === null) {
            return true;//初始化的值为null，不做处理的话，刚打开MessageBox就会校验出错，影响用户体验
          }
          return !(val.length > 16)
        }, inputErrorMessage: '组名必须小于16个字符'
      }).then(function(value, action){
        if(value.action == 'confirm'){
          if(value.value) {
            that.name = value.value;
            that.editList(value.value);
          }
          else {
            Toast({
              message: '组名不能为空',
              iconClass: 'icon icon-error',
              duration: 1000
            })
            return
          }
        }
      }).catch(err => {
        if (err == 'cancel') {
          console.log('cancel');
        }
      });
    }
  },

  components: {
    customerList,
    headerSwitch,
    filterList,
    emptyPage,
    MessageBox
  }
}
</script>

<style scoped lang="less">
.container {
  position: relative;
  height: calc(100% - 4.8rem);
  overflow: hidden;
  &.bigger {
    height: calc(100% - 124px);
  }
}
.navbar {
  position: relative;
  font-size: 0;
  .navbar-nav {
    position: relative;
    height: 48px;
    line-height: 48px;
    display: inline-block;
    width: 50%;
    font-size: 16px;
    background: #fff;
    &.active {
      color: #d24545;
    }
    &.active:after {
      position: absolute;
      content: '';
      border-bottom: 2px solid #d24545;
      width: 100%;
      height: 2px;
      bottom: 0;
      left: 0;
    }
  }
}
.follow-group {
  position: relative;
  display: inline-block;
  font-size: 0.4rem;
  width: 95%;
  height: 30px;
  line-height: 30px;
  margin: 0 auto;
  padding: 5px;
  border-radius: 10px;
  background: #fff;
}
.label-cont{
  margin-top: 16px;
}
</style>
