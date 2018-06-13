<template>
  <div class="cruise">
    <header>
      <img height="40" style="margin-top:10px;" src="../assets/logo/logo.svg" alt="" />
      <div class="head-menu" @click="showProfile">
        <img width="40" height="40" class="head-portrait" src="../assets/osIcons/head.jpg" alt="" />
        <span v-if="!showHeadList" class="icon-angle-down"></span>
        <span v-else class="icon-angle-up"></span>
        <div v-show="showHeadList" class="profile">
          <div>
            <span class="icon-id-card margin15"></span>Profile</div>
          <div>
            <span class="icon-sign-in margin15"></span>Sign Out</div>
        </div>
      </div>
    </header>
    <div class="container">
      <aside>
        <div class="menu">
          <ul>
            <li>
              <span class="my-icon icon-dashboard"></span>DASHBOARD</li>
            <li class="menu-active">
              <span class="my-icon icon-sitemap"></span>AGENT</li>
            <li>
              <span class="my-icon icon-boat"></span>MY CRUISE</li>
            <li>
              <span class="my-icon icon-life-bouy"></span>HELP</li>
          </ul>
        </div>
        <div class="history">
          <div class="history-title">History</div>
          <div class="no-history" v-show="historyArr.length===0">no history!</div>
          <ul>
            <li :key="index" v-for="(item, index) in historyArr">
              <a :href="item" :title="item" target="_blank">{{item}}</a>
            </li>
          </ul>
        </div>
      </aside>
      <div class="content">
        <div class="content-box">
          <div class="news">
            <div>
              <span class="bg-icon icon-cog"></span>
              <div class="new-title">Building</div>
              <div class="new-num">{{building}}</div>
            </div>
            <div>
              <span class="bg-icon icon-coffee"></span>
              <div class="new-title">Idle</div>
              <div class="new-num">{{idleNum}}</div>
            </div>
            <div>
              <div :class="screenWidth==='desktop' ? 'item-col-1024 item-col' :'item-col'" :key="i" v-for="(item, i) in dataTotalArr">
                <div class="f12">{{item.key}}</div>
                <div class="f20">{{item.value}}</div>
              </div>
            </div>
          </div>
          <div class="content-nav">
            <div :class="activeNav === index ? 'nav-item nav-item-active' : 'nav-item'" :key="index" v-for="(navItem, index) in navItem" @click="changeNav(index)">{{navItem}}</div>
            <div class="my-search">
              <input type="text" v-model="searchVal" placeholder="Search name...">
              <span class="icon-search"></span>
            </div>
            <div class="sort-icon">
              <span class="icon-th-card"></span>
              <span class="icon-th-list sort-icon-active"></span>
            </div>
          </div>
          <div class="data-list">
            <div v-show="dataList.length===0" class="no-data">No data!</div>
            <ul>
              <li :class="item.deny ? 'deny-bg data-item' : ' data-item'" :key="i" v-for="(item, i) in dataList">
                <img width="80px" :src="item.img" alt="" v-if="screenWidth==='desktopHd'" />
                <div :class="screenWidth!=='desktopHd' ? 'item-desc-1024' :'item-desc'">
                  <div>
                    <span class="desc-icon icon-desktop"></span>
                    <span :class="item.deny ? 'desc-text text-deny' :  'desc-text'" :title="item.title" @click="linkTo(item.title)">{{item.title}}</span>
                    <span class="idle" v-if="item.isIdle">Idle</span>
                    <span v-else class="building">building</span>
                    <div class="item-info">
                      <span class="icon-info desc-icon"></span>
                      <span class="">{{item.ip}}</span>
                      <span class="icon-folder desc-icon"></span>
                      <span>{{item.url}}</span>
                    </div>
                  </div>
                  <div style="position:relation;">
                    <span v-if="item.deny" class="add-btn btn-deny">
                      <span class="add-icon icon-plus"></span>
                    </span>
                    <span v-else class="add-btn" @click="addBro(i)">
                      <span class="add-icon icon-plus"></span>
                    </span>
                    <div v-show="item.popup" class="popup">
                      <svg style="position: absolute;transform: translateY(-27px);" width="16" height="16">
                        <path id="lineBC" d="M 2 12 l 6 -10 l 6 10 " stroke="#00b4cf" stroke-width="1" fill="#fff" />
                      </svg>
                      <span class="icon-close" @click="closePopup(item)"></span>
                      <div class="popup-title">Separate multiple resource name with commas</div>
                      <input v-model="broInput" placeholder="e.g. Chrome,Friefox" type="text">
                      <div class="popup-btn add-resource" @click="addResoure(item)">Add resource</div>
                      <div class="popup-btn cancel-btn" @click="closePopup(item)">Cancel</div>
                    </div>
                    <span :key="k" v-for="(bro,k) in item.browser" class="btn">{{bro}}
                      <span v-if="item.deny" class="icon-trash" style="cursor:not-allowed;"></span>
                      <span v-else class="icon-trash trash-active" @click="deleteBro(i,k)"></span>
                    </span>
                    <span class="right-btn" @click="denyFun(item)" v-if="item.deny">
                      <span></span>Allow</span>
                    <span class="right-btn" v-else @click="denyFun(item)">
                      <span class="icon-deny"></span>Deny</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <footer>@Copyright 2007
      <strong>Thought</strong>Works</footer>
  </div>
</template>
<script>
import dataListObj from "./vrData.js";
export default {
  name: "Cruise",
  data() {
    return {
      broInput: "",
      dataList: [], // 数据列表
      navItem: ["All", "Physical", "Virtual"],
      activeNav: 0, // 激活菜单栏
      idleNum: 0,
      building: 0,
      dataTotalArr: [],
      searchVal: "",
      historyArr: [],
      showHeadList: false,
      screenWidth: ''
    };
  },
  created: function() {
    this.dataList = JSON.parse(JSON.stringify(dataListObj[0])); // 初始化数据
    this.dataTotalArr = [
      { key: "ALL", value: dataListObj[0].length },
      { key: "PHYSICAL", value: dataListObj[1].length },
      { key: "VIRTUAL", value: dataListObj[2].length }
    ];
    dataListObj.map(item => {
      item.map((innerItem) => {
        if (innerItem.isIdle) {
          this.idleNum++;
        } else {
          this.building++;
        }
      });
    });
    this.historyUtil(); // 加载历史纪录
  },
  mounted() {
    window.onresize = () => {
      let _clientWidth = document.body.clientWidth;
      console.log(_clientWidth);
      if (_clientWidth >= 1200) {
        this.screenWidth = 'desktopHd';
      } else if (_clientWidth >= 1024 && _clientWidth < 1200) {
        this.screenWidth = 'desktop';
      } else if (_clientWidth >= 768 && _clientWidth < 1024) {
        this.screenWidth = 'tablet';
      } else {
        this.screenWidth = 'phone';
      }
    }
  },
  watch: {
    searchVal: function() {
      this.dataList = [];
      let _dataList = JSON.parse(JSON.stringify(dataListObj[this.activeNav])); // 源数据
      if (!this.searchVal) {
        this.dataList = _dataList;
      } else {
        _dataList.map((item, i) => {
          if (item.title.indexOf(this.searchVal) !== -1) {
            this.dataList.push(item);
          }
        });
      }
    }
  },
  methods: {

    // 删除浏览器
    deleteBro: function(i, k) {
      this.dataList[i].browser.splice(k, 1);
    },
    // 打开确认框
    addBro: function(i) {
      this.dataList.map((item, j) => {
        console.log(i, j);
        if (j === i) {
          item.popup = true;
        } else {
          item.popup = false;
        }
      });
    },
    // 打开浏览器
    addResoure: function(item) {
      if (!this.broInput) {
        return;
      }
      let _inputArr = this.broInput.split(",");
      item.browser = item.browser.concat(_inputArr);
      item.browser = [...new Set(item.browser)];
      this.closePopup(item);
    },
    // 关闭弹框
    closePopup: function(item) {
      this.broInput = "";
      item.popup = false;
    },
    // 禁止操作
    denyFun: function(item) {
      console.log(item);
      item.deny = !item.deny;
    },
    // 切换菜单
    changeNav: function(index) {
      this.activeNav = index;
      this.dataList = dataListObj[index];
      this.searchVal = '';
      // this.idleNum = 0;
      // this.building = 0;
      // this.dataList.map(item => {
      //   if (item.isIdle) {
      //     this.idleNum++;
      //   } else {
      //     this.building++;
      //   }
      // });
    },
    // 过滤类型
    filterIdle: function(param) {
      // let _dataList = JSON.parse(JSON.stringify(dataListObj[this.activeNav]));
      // this.dataList = [];
      // _dataList.map(item => {
      //   if (!item.isIdle && param === "building") {
      //     this.dataList.push(item);
      //   } else if (item.isIdle && param === "idle") {
      //     this.dataList.push(item);
      //   }
      // });
    },
    // 跳转页面
    linkTo: function(link) {
      // window.location.href = link;
      this.historyUtil(link);
      window.open(link);
    },
    // history util
    historyUtil: function(link) {
      let historyArr = [];
      let historyStr = "";
      historyArr = sessionStorage.getItem("historyUrl")
        ? sessionStorage.getItem("historyUrl").split(",")
        : [];
      if (link) {
        historyArr.push(link);
      }
      historyArr.map((item, index) => {
        historyStr = historyStr + item;
        if (index !== historyArr.length - 1) {
          historyStr = historyStr + ",";
        }
      });
      sessionStorage.setItem("historyUrl", historyArr);
      this.historyArr = historyArr;
    },
    // 头像
    showProfile: function() {
      this.showHeadList = !this.showHeadList;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "./Cruise.css";
</style>
