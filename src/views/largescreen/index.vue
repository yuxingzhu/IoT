<template>
  <div class="content">
    <div class="bg">

      <div class="header">
        <div style="text-align: center">
          <div class="h3">设备监控大屏—袍江制造基地</div>
        </div>
        <div style="display: flex; justify-content: space-between">
          <div style="
              color: #abbfff;
              font-size: 0.72vw;
              margin-left: 1.3%;
              transform: translateY(-0.74vh);
            ">
            <span>{{ year }}年{{ month }}月{{ day }}日</span>&nbsp;&nbsp;&nbsp;
            <span>{{ weekdays[date.getDay()] }}</span>&nbsp;&nbsp;&nbsp;
            <span>{{ ampm }}{{ hours }}:{{ minutes }}</span>
          </div>
          <div>
            <div class="base-select-container el-dropdown-link el-dropdown-link1">
              <el-select v-model="selectBaseOption" @change="handleSelectBase" class="filter-select"
                :popper-append-to-body="false">
                <el-option v-for="item in baseOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <!-- 第二行 -->
      <div class="module-box">
        <!-- 左 -->
        <div style="flex: 0 1 65.42%; margin-right: 1.15vw">
          <div class="left-bg">
            <div class="module">
              <div class="module-tillen">
                <el-button @click="equipment(1)" style="font-size: 0.9275vw" :class="index === 1 ? 'active' : ''">
                  设备总览</el-button>/
                <el-button @click="equipment(2)" style="font-size: 0.9275vw" :class="index === 2 ? 'active' : ''">
                  网关总览
                </el-button>
              </div>
              <div class="imgage1"></div>
              <div class="zongliang" v-show="index === 1">
                <div style="flex: 0 1 50%">
                  <div id="main" ref="main" style="
                      width: 17.26vw;
                      height: 21.26vh;
                      transform: translateY(-1.5vh);
                    "></div>
                </div>
                <div style="width: 100%; height: 100%; flex: 0 1 60%" class="clione-big">
                  <div class="block" style="width: 100%">
                    <el-carousel trigger="click" height="21vh" :interval="30000" arrow="never">
                      <el-carousel-item v-for="item in itemListdata || 1" :key="item" style="
                          display: flex;
                          justify-content: space-around;
                          flex-wrap: wrap;
                        ">
                        <div class="clione" v-for="(item, index) in itemList.slice(
                          (item - 1) * 4,
                          item * 4
                        ) || 4" :key="index">
                          <div class="tillen1">{{ item.unitName }}</div>
                          <div class="tillen2">{{ item.unitNumber }}</div>
                        </div>
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                </div>
              </div>
              <div class="zongliang" v-show="index === 2">
                <div :style="{flex: '0 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}">
                  <div id="maindate" ref="maindate" style="
                      width: 17.26vw;
                      height: 20.26vh;
                      transform: translateY(-1.5vh);
                    "></div>
                </div>
                <div style="
                    display: flex;
                    flex: 0 1 60%;
                    justify-content: space-around;
                    flex-wrap: wrap;
                    width: 100%;
                    height: 100%;
                  " class="clione-big">
                  <div class="block" style="width: 100%">
                    <el-carousel trigger="click" height="21vh" :interval="30000000" arrow="never">
                      <el-carousel-item v-for="item in datakeydata || 1" :key="item" style="
                          display: flex;
                          justify-content: space-around;
                          flex-wrap: wrap;
                        ">
                        <div class="clione" v-for="(item, index) in datakey.slice(
                          (item - 1) * 4,
                          item * 4
                        ) || 4" :key="index">
                          <div class="tillen1">{{ item.name }}</div>
                          <div class="tillen2">{{ item.value }}</div>
                        </div>
                      </el-carousel-item>
                    </el-carousel>
                  </div>
                </div>
              </div>
            </div>
            <div style="width: 2.5vw"></div>
            <div class="module" style="margin-right: 1.04vw">
              <div class="module-tillen">设备效能状态</div>
              <div class="imgage"></div>
              <div class="zongliang">
                <div id="breakAlarm" ref="breakAlarm" style="width: 30.78vw; height: 23.26vh"></div>
              </div>
            </div>
          </div>
          <div style="height: 2.04vh;"></div>
          <div class="left-bg">
            <div class="module">
              <div class="module-tillen">故障关单率（近七日）</div>
              <div class="imgage"></div>
              <div class="zongliang">
                <div style="width: 100%; height: 23.26vh" id="linechart" ref="linechart"></div>
              </div>
            </div>
            <div style="width: 2.5vw"></div>
            <div class="module" style="margin-right: 1.04vw">
              <div class="module-tillen">故障总时长（近七日）</div>
              <div class="imgage"></div>
              <div style="width: 100%; height: 23.26vh" id="chartDom" ref="chartDom"></div>
            </div>
          </div>
          <div style="height: 2.04vh;"></div>
          <div style="width: 100%; height: 27.22vh;">
            <div style="display: flex">
              <div style="margin-right: 1.25vw;">
                <div style="margin-left: 1.15vw; font-size: 0.8vw;height: 2vh;">
                  设备运行时长
                </div>
                <div class="imgdata" style="height: 2vh;"></div>
                <dv-scroll-board :config="config" style="
                    width: 27.66vw;
                    height: 22.39vh;
                    margin-left: 0.83vw;
                    margin-top: 0.96vh;
                    background-color: #07265c;" />
              </div>
              <div>
                <div style="margin-left: 1.15vw; font-size: 0.8vw;height: 2vh;">
                  网关设备告警信息
                </div>
                <div class="imggaojin" style="height: 2vh;"></div>
                <dv-scroll-board :config="config1" style="
                    width: 34.95vw;
                    height: 22.39vh;
                    margin-left: 0.83vw;
                    margin-top: 0.96vh;
                    background-color: #07265c;" />
              </div>
            </div>
          </div>
        </div>
        <div style="flex: 0 1 28.54%">
          <div style="width: 28.54vw; overflow: hidden" class="right-bg">
            <div style="height:29.25vh;">
              <div style="
                  display: flex;
                  justify-content: space-between;
                  margin-top: 1.4vh;
                ">
                <div style="margin-left: 1.83vw; font-size: 0.8vw">
                  设备停机率
                </div>
                <div 
                  class="outage-rate-select">
                  <!-- <template slot="header"> -->
                  <el-dropdown trigger="hover" @command="handleCommand" v-model="selectedOption" style="cursor:pointer;">
                    <span class="el-dropdown-link" style="color: #7a99ff">
                      {{ selectedOption
                      }}<i class="el-icon-caret-bottom el-icon-caret-top"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" class="dropdown">
                      <el-dropdown-item v-for="option in options" :key="option.value" :command="option.value"
                        class="el-dropdown-item">
                        {{ option.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <!-- </template> -->
                </div>
              </div>
              <div class="imgtingji"></div>
              <div id="dashboard" ref="dashboard" style="width: 28.54vw; height: 26.3vh"></div>
            </div>
            <div style="height:32.75vh;">
              <div style="margin-left: 1.83vw; font-size: 0.8vw">
                停机原因分布
              </div>
              <div class="imgtingji"></div>
              <div id="maindata" ref="maindata" style="
                  width: 28.54vw;
                  height: 27.22vh;
                  transform: translateY(-1vh);
                ">
              </div>
            </div>
            <div style="height:25.74vh">
              <dv-scroll-board :config="config2" style="
                  width: 100%;
                  min-height: 25.9vh;
                  background-color: #07265c;
                " />
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import moment from 'moment';
import * as echarts from "echarts";
import {
  countOn,
  gatewaysource,
  findAllResource,
  listPagePartner,
} from "@/api/largescreen";
import {
  getWorkshopInfo,
  getDeviceFaultInfo,
  getDeviceInfo,
  getDeviceFaultCloseRatInfo,
  getDeviceFaultDurationInfo,
} from "@/api/largescreendata";
import beginDate from "../../components/gettime.js";
import endDate from "../../components/edgetime.js";
export default {
  data() {
    return {
      baseOptions: [
        {
          value: 'IBCPJ',
          label: '袍江基地'
        },
        {
          value: 'IBCBH',
          label: '滨海基地'
        },
      ],
      selectBaseOption: 'IBCPJ',
      options: [
        { value: "近一个小时", label: "近一个小时" },
        { value: "近二个小时", label: "近二个小时" },
        { value: "近三个小时", label: "近三个小时" },
        { value: "近四个小时", label: "近四个小时" },
        { value: "近五个小时", label: "近五个小时" },
      ],
      selectedOption: "近一个小时",
      xdata: [],
      ydata: [],
      xDurationdata: [],
      yDurationdata: [],
      itemListdata: 0,
      datakeydata: 0,
      itemList: "",
      date1: {
        unitCode: "CS_002",
      },
      date2: {
        beginDate: beginDate,
        endDate: endDate
      },
      datakey: [],
      key: "",
      value: "",
      date: new Date(),
      index: 2,
      // 控制点击按钮后子组件显示，再次点击隐藏
      isShow: true,
      workshopL: {
        datakey: "",
        datavalue: "",
      },
      workshop: [],
      arrs: [],
      echartColor: ["#41C6FB", "#C890FB", "#FFAD49"],
      echartColor1: ["#41C6FB", "#C890FB", "#FFAD49"],
      config: {
        header: [
          "车间名称",
          "设备名称",
          "设备类型",
          "设备编码",
          "设备型号",
          "运行时长",
        ],
        headerBGC: "#1F469F",
        oddRowBGC: "#07265C",
        evenRowBGC: "#07265C",
        align: ['center'],
      },
      config1: {
        header: [
          "告警项名称",
          "告警网关",
          "告警名称",
          "告警信息",
          "告警级别",
          "告警时间",
          "处理状态",
        ],
        headerBGC: "#1F469F",
        oddRowBGC: "#07265C",
        evenRowBGC: "#07265C",
        align: ['center'],
      },
      config2: {
        header: ["序号", "停机原因", "停机时间", "停机时长(min)", "操作人"],
        headerBGC: "#1F469F",
        oddRowBGC: "#07265C",
        evenRowBGC: "#07265C",
        waitTime: 4000,
        columnWidth: [40,60,120,90,100],
        align: ['center']
      },
      formData: {
        status: "",
      },
      query: {
        alarmLevel: "",
        datetime: "",
        startTime: "",
        endTime: "",
        currentPage: 1,
        pageSize: 10, //每页展示数量
        //  orderby: "",
        //  order: "",
        edgeDeviceName: "",
        alarmInfo: "",
      },
      websocket: null,
      faultItem: {
        faultTypeName: "",
        faultNum: "",
        faultRatio: "",
      },
    };
  },
  computed: {
    ampm() {
      return this.date.getHours() >= 12 ? "下午" : "上午";
    },
    hours() {
      let h = this.date.getHours();
      if (h > 12) {
        h -= 12;
      }
      return h < 10 ? "0" + h : h;
    },
    minutes() {
      let m = this.date.getMinutes();
      return m < 10 ? "0" + m : m;
    },
    year() {
      return this.date.getFullYear();
    },
    month() {
      let m = this.date.getMonth() + 1;
      return m < 10 ? "0" + m : m;
    },
    day() {
      let d = this.date.getDate();
      return d < 10 ? "0" + d : d;
    },
    weekdays() {
      return [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
    },
  },
  created() {
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  },
  mounted() {
    this.initcountOn();
    this.breakAlarm();
    this.dashboard();
    this.indexedata();
    this.linechart();
    this.chartDom();
    this.initcountOndata();
    // this.findAllResource();
    // this.listPagePartner();
    this.getWorkshopInfo();
    // this.getDeviceFaultCloseRatInfo()
    this.getDeviceFaultDurationInfo();
    this.getDeviceFaultInfo();
    this.findAllResource();
    this.listPagePartner();
    this.getDeviceFaultCloseRatInfo();
    setInterval(() => {
      this.findAllResource();
      this.listPagePartner();
      this.getDeviceInfo();
    }, 10000);
  },
  methods: {
      // 使字体大小为自适应
    autoFontSize(res) {
        let clientWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        if (!clientWidth) return;
        let fontSize = 100 * (clientWidth / 1920);
        return res * fontSize;
      },
    handleSelectBase(val) {
      console.log(val, 'valllerer');
      if (val === "IBCPJ") {
        console.log("当前页面")
      } else {
        this.$message("网站正在开发中");
      }
    },
    initcountOn() {
      countOn()
        .then((response) => {
          if (response.success) {
            const datanumber = response.totalCount || 0;
            const data = [
              {
                color: "#FF7734",
                name: "离线",
                value: response.offlineCount,
                type: response.offlinePercentage,
              },
              {
                color: "#159AFF",
                name: "在线",
                value: response.onlineCount,
                type: response.onlinePercentage,
              },
            ];
            this.indexed(data, datanumber);
          }
        })
        .catch((error) => {
          const data = [
            {
              name: "0",
              value: 0,
              type: 0,
            },
          ];
          this.indexed(data);
        });
    },
    initcountOndata() {
      gatewaysource()
        .then((response) => {
          if (response.success) {
            this.workshop = response.workshop;
            const datanumber = response.gatewayTotalCount || 0;
            const data = [
              {
                name: "离线",
                value: response.gatewayOfflineCount,
                type: response.gatewayOfflinePercentage,
              },
              {
                name: "在线",
                value: response.gatewayOnlineCount,
                type: response.gatewayOnlinePercentage,
              },
            ];
            this.maindata(data, datanumber);
            let datakey = [];
            for (let i = 0; i < this.workshop.length; i++) {
              const key = Object.keys(this.workshop[i])[0];
              const val = Object.values(this.workshop[i])[0];
              datakey.push({
                name: key,
                value: val,
              });
            }
            this.datakey = datakey;
            let arr = this.datakey.length / 4;
            if (String(arr).length > 1) {
              this.datakeydata = parseInt(arr) + 1;
            } else {
              this.datakeydata = arr;
            }
          }
        })
        .catch((error) => {
          const data = [
            {
              name: "0",
              value: 0,
              type: 0,
            },
          ];
          this.maindata(data, datanumber);
        });
    },
    findAllResource() {
      findAllResource().then((response) => {
        if (response) {
          this.list = response.data;
          this.frontend = this.list.map(
            ({
              deviceLocations,
              deviceName,
              deviceDesc,
              deviceEncoding,
              deviceModel,
              runtime,
            }) => [
                deviceLocations,
                deviceName,
                deviceDesc,
                deviceEncoding,
                deviceModel,
                runtime,
              ]
          );
          this.config = {
            header: this.config.header,
            data: this.frontend,
            headerBGC: "#1F469F",
            oddRowBGC: "#07265C",
            evenRowBGC: "#07265C",
            waitTime: 4000,
            align: ['center']
          };

        }
      });
    },
    listPagePartner() {
      listPagePartner(this.query).then((response) => {
        if (response) {
          this.list = response.data;
          this.frontend = this.list.map(
            ({
              alarmStatusName,
              agwName,
              alarmName,
              alarmInfo,
              alarmLevel,
              alarmStartTime,
              dealStatusName,
            }) => [
                alarmStatusName,
                agwName,
                alarmName,
                alarmInfo,
                alarmLevel,
                alarmStartTime,
                dealStatusName,
              ]
          );
          this.config1 = {
            header: this.config1.header,
            data: this.frontend,
            headerBGC: "#1F469F",
            oddRowBGC: "#07265C",
            evenRowBGC: "#07265C",
            waitTime: 4000,
            align: ['center']
          };
        }
      });
    },
    getWorkshopInfo() {
      getWorkshopInfo(this.date1).then((response) => {
        if (response) {
          this.itemList = response.data.data.itemList;
          let arr = this.itemList.length / 4;
          if (String(arr).length > 1) {
            this.itemListdata = parseInt(arr) + 1;
          } else {
            this.itemListdata = arr;
          }
        }
      });
    },
    getDeviceFaultInfo() {
      getDeviceFaultInfo(this.date2)
        .then((response) => {
          if (response) {
            if (response.data.data) {
              const data = [
                {
                  name: "停机率",
                  value: response.data.data.faultRatio,
                },
              ];
              this.dashboard(data);
              this.total = response.data.data.faultSummary.total;
              this.faultItemList =
                response.data.data.faultSummary.faultItemList;
              let data1 = this.faultItemList.map((item) => {
                return {
                  name: item.faultTypeName,
                  value: item.faultNum,
                  type: item.faultRatio,
                };
              });
              this.indexedata(this.total, data1);
            }
          }
        })
        .catch((error) => {
          const data = [
            {
              name: "停机率",
              value: 0,
            },
          ];
          this.dashboard(data);
          const data1 = [
            {
              name: "0",
              value: 0,
              type: "0",
            },
          ];
          const total = 0;
          this.indexedata(total, data1);
        });
    },
    getDeviceInfo() {
      getDeviceInfo(this.date2).then((response) => {
        if (response) {
          const result = response.data.data.map(
            ({
              faultTypeCode,
              faultTypeName,
              faultStartTime,
              faultDuration,
              operator,
            }) => [
                faultTypeCode,
                faultTypeName,
                faultStartTime,
                faultDuration,
                operator,
              ]
          );
          this.config2 = {
            header: this.config2.header,
            data: result,
            headerBGC: "#1F469F",
            oddRowBGC: "#07265C",
            evenRowBGC: "#07265C",
            waitTime: 4000,
            columnWidth: [40,60,120,90,100],
            align: ['center']
          };
        }
      });
    },
    getDeviceFaultCloseRatInfo() {
      getDeviceFaultCloseRatInfo()
        .then((response) => {
          if (response) {
            this.data = response.data.data;
            for (let i = 0; i < this.data.length; i++) {
              this.xdata.push(this.data[i].closeRatio);
              this.ydata.push(this.data[i].date);
            }
            this.linechart();
          }
        })
        .catch((error) => {
          this.xdata = [0, 0, 0, 0, 0, 0];
          this.ydata = [0, 0, 0, 0, 0, 0];
          this.linechart();
        });
    },
    getDeviceFaultDurationInfo() {
      getDeviceFaultDurationInfo()
        .then((response) => {
          if (response) {
            this.data = response.data.data;
            for (let i = 0; i < this.data.length; i++) {
              this.xDurationdata.push(this.data[i].duration);
              this.yDurationdata.push(this.data[i].date);
            }
            this.chartDom();
          }
        })
        .catch((error) => {
          this.xDurationdata = [0, 0, 0, 0, 0, 0];
          this.yDurationdata = [0, 0, 0, 0, 0, 0];
          this.chartDom();
        });
    },
    handleCommand(command) {
      console.log(command, 'command3434')
      if (command == "近一个小时") {
        this.selectedOption = command;
        let currentDate = new Date();
        let oneHourLater = new Date(currentDate.getTime() - 60 * 60 * 1000);
        let year = oneHourLater.getFullYear();
        let month = ("0" + (oneHourLater.getMonth() + 1)).slice(-2);
        let day = ("0" + oneHourLater.getDate()).slice(-2);
        let hours = ("0" + oneHourLater.getHours()).slice(-2);
        let minutes = ("0" + oneHourLater.getMinutes()).slice(-2);
        let seconds = ("0" + oneHourLater.getSeconds()).slice(-2);
        this.date2.beginDate =
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          seconds;
        this.date2.endDate =
          currentDate.getFullYear() +
          "-" +
          (currentDate.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          currentDate.getDate().toString().padStart(2, "0") +
          " " +
          currentDate.getHours().toString().padStart(2, "0") +
          ":" +
          currentDate.getMinutes().toString().padStart(2, "0") +
          ":" +
          currentDate.getSeconds().toString().padStart(2, "0");
        this.getDeviceFaultInfo(this.data2);
        this.getDeviceInfo(this.date2);
      } else if (command == "近二个小时") {
        this.selectedOption = command;
        console.log(this.selectedOption, "343");
        let currentDate = new Date();
        let twoHoursLater = new Date(
          currentDate.getTime() - 2 * 60 * 60 * 1000
        );
        let year = twoHoursLater.getFullYear();
        let month = ("0" + (twoHoursLater.getMonth() + 1)).slice(-2);
        let day = ("0" + twoHoursLater.getDate()).slice(-2);
        let hours = ("0" + twoHoursLater.getHours()).slice(-2);
        let minutes = ("0" + twoHoursLater.getMinutes()).slice(-2);
        let seconds = ("0" + twoHoursLater.getSeconds()).slice(-2);
        this.date2.beginDate =
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          seconds;
        this.date2.endDate =
          currentDate.getFullYear() +
          "-" +
          (currentDate.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          currentDate.getDate().toString().padStart(2, "0") +
          " " +
          currentDate.getHours().toString().padStart(2, "0") +
          ":" +
          currentDate.getMinutes().toString().padStart(2, "0") +
          ":" +
          currentDate.getSeconds().toString().padStart(2, "0");
        this.getDeviceFaultInfo(this.date2);
        this.getDeviceInfo(this.date2);
      } else if (command == "近三个小时") {
        this.selectedOption = command;
        let currentDate = new Date();
        let threeHoursLater = new Date(
          currentDate.getTime() - 3 * 60 * 60 * 1000
        );
        let year = threeHoursLater.getFullYear();
        let month = ("0" + (threeHoursLater.getMonth() + 1)).slice(-2);
        let day = ("0" + threeHoursLater.getDate()).slice(-2);
        let hours = ("0" + threeHoursLater.getHours()).slice(-2);
        let minutes = ("0" + threeHoursLater.getMinutes()).slice(-2);
        let seconds = ("0" + threeHoursLater.getSeconds()).slice(-2);
        this.date2.beginDate =
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          seconds;
        this.date2.endDate =
          currentDate.getFullYear() +
          "-" +
          (currentDate.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          currentDate.getDate().toString().padStart(2, "0") +
          " " +
          currentDate.getHours().toString().padStart(2, "0") +
          ":" +
          currentDate.getMinutes().toString().padStart(2, "0") +
          ":" +
          currentDate.getSeconds().toString().padStart(2, "0");
        this.getDeviceFaultInfo(this.date2);
        this.getDeviceInfo(this.date2);
      } else if (command == "近四个小时") {
        this.selectedOption = command;
        let currentDate = new Date();
        let fourHoursLater = new Date(
          currentDate.getTime() - 4 * 60 * 60 * 1000
        );
        let year = fourHoursLater.getFullYear();
        let month = ("0" + (fourHoursLater.getMonth() + 1)).slice(-2);
        let day = ("0" + fourHoursLater.getDate()).slice(-2);
        let hours = ("0" + fourHoursLater.getHours()).slice(-2);
        let minutes = ("0" + fourHoursLater.getMinutes()).slice(-2);
        let seconds = ("0" + fourHoursLater.getSeconds()).slice(-2);
        this.date2.beginDate =
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          seconds;
        this.date2.endDate =
          currentDate.getFullYear() +
          "-" +
          (currentDate.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          currentDate.getDate().toString().padStart(2, "0") +
          " " +
          currentDate.getHours().toString().padStart(2, "0") +
          ":" +
          currentDate.getMinutes().toString().padStart(2, "0") +
          ":" +
          currentDate.getSeconds().toString().padStart(2, "0");
        this.getDeviceFaultInfo(this.date2);
        this.getDeviceInfo(this.date2);
      } else if (command == "近五个小时") {
        this.selectedOption = command;
        let currentDate = new Date();
        let fiveHoursLater = new Date(
          currentDate.getTime() - 5 * 60 * 60 * 1000
        );
        let year = fiveHoursLater.getFullYear();
        let month = ("0" + (fiveHoursLater.getMonth() + 1)).slice(-2);
        let day = ("0" + fiveHoursLater.getDate()).slice(-2);
        let hours = ("0" + fiveHoursLater.getHours()).slice(-2);
        let minutes = ("0" + fiveHoursLater.getMinutes()).slice(-2);
        let seconds = ("0" + fiveHoursLater.getSeconds()).slice(-2);
        this.date2.beginDate =
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          seconds;
        this.date2.endDate =
          currentDate.getFullYear() +
          "-" +
          (currentDate.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          currentDate.getDate().toString().padStart(2, "0") +
          " " +
          currentDate.getHours().toString().padStart(2, "0") +
          ":" +
          currentDate.getMinutes().toString().padStart(2, "0") +
          ":" +
          currentDate.getSeconds().toString().padStart(2, "0");
        this.getDeviceFaultInfo(this.date2);
        this.getDeviceInfo(this.date2);
      }
    },
    equipment(value) {
      this.index = value;
      this.index === value
        ? (this.isShow = !this.isShow)
        : (this.isShow = true);
    },
    indexed(data, datanumber = 0) {
      var myChart = echarts.init(this.$refs.main);
      var option;
      var app = {};
      let lineColor = "#0042FF";
      const numArr = data.map((item) => item.value);
      let number = 0;
      numArr.forEach((item) => {
        number += item;
      });
      const maxNum = Math.max(...numArr);
      const maxArr = [];
      data.forEach((item) => {
        maxArr.push(maxNum);
      });
      option = {
        color: ["#FF7734", "#159AFF"],
        title: {
          text: `{val|${datanumber}}\n{name|总量（台）}`,
          left: "center",
          top: "center",
          textStyle: {
            rich: {
              name: {
                // fontSize: 14,
                fontSize: this.autoFontSize(0.14),
                color: "#FFFFFF",
                padding: [10, 0],
              },
              val: {
                // fontSize: 30,
                fontSize: this.autoFontSize(0.18),
                fontWeight: "bold",
                color: "#FFFFFF",
              },
            },
          },
        },
        grid: {
          top: "10%",
          left: "20%",
          right: "20%",
          bottom: "5%",
          containLabel: true,
        },
        tooltip: {
          show: true,
          formatter: function (params) {
            return params.marker + `${params.name}: ` + params.value + "台"
          },
        },
        series: [
          {
            name: "",
            type: "pie",
            center: ["50%", "50%"],
            radius: ["52%", "70%"],
            itemStyle: {
              //  borderRadius: 10,
              borderColor: "#001b3f",
              borderWidth: 4,
            },
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 20,
              lineHeight: 20,
              borderRadius: 4,
              show: true,
              // padding: [10, 10, 0, 0],
              formatter: function (params) {
                let total = 0;
                data.forEach((item) => {
                  total += item.value;
                });
                let percen =
                  ((Number(params.value) / total) * 100).toFixed(0) + "%";
                if (params.name !== "") {
                  return (

                    "{name|" +
                    params.data.name +
                    "}" +
                    "\n" +
                    "{value|" +
                    params.data.value +
                    "}" +
                    " " +
                    "{type|" +
                    params.data.type +
                    "}"
                  );
                } else {
                  return "";
                }
              },

              rich: {
                name: {
                  fontSize: 14,
                  color: "#fff",
                  padding: [0, 0, 5, 0],
                },
                value: {
                  fontSize: 14,
                  color: "#fff",
                  padding: [0, 5, 0, 0],
                },
                type: {
                  fontSize: 14,
                  color: "#4F78FF",
                },
              },
            },
            labelLine:{  
              show: true,
              length: 10,
              length2: 25
            },
            data: data,
          },
          {
            name: "内圆",
            type: "pie",

            silent: true,
            radius: ["44.5%", "45%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: "#6C8097",
            },
            data: maxArr,
          },

          {
            name: "外圆1",
            type: "pie",

            silent: true,
            radius: ["77%", "79%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: "#162B48",
            },
            data: maxArr,
          },
        ],
      };
      if (option && typeof option === "object") {
        myChart.setOption(option);
      }
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    maindata(data, datanumber = 0) {
      var myChart = echarts.init(this.$refs.maindate);
      var option;
      var app = {};
      let lineColor = "#0042FF";
      const numArr = data.map((item) => item.value);
      let number = 0;
      numArr.forEach((item) => {
        number += item;
      });
      const maxNum = Math.max(...numArr);
      const maxArr = [];
      data.forEach((item) => {
        maxArr.push(maxNum);
      });
      option = {
        color: ["#FF7734", "#159AFF"],
        title: {
          text: `{val|${datanumber}}\n{name|总量（台）}`,
          left: "center",
          top: "center",
          textStyle: {
            rich: {
              name: {
                // fontSize: 14,
                fontSize: this.autoFontSize(0.14),
                color: "#FFFFFF",
                padding: [10, 0],
              },
              val: {
                // fontSize: 30,
                fontSize: this.autoFontSize(0.18),
                fontWeight: "bold",
                color: "#FFFFFF",
              },
            },
          },
        },
        grid: {
          top: "12%",
          left: "20%",
          right: "20%",
          bottom: "5%",
          containLabel: true,
        },
        tooltip: {
          show: true,
          formatter: function (params) {
            return params.marker + `${params.name}: ` + params.value + "台"
          },
        },
        series: [
          {
            name: "",
            type: "pie",
            center: ["50%", "50%"],
            radius: ["52%", "70%"],
            itemStyle: {
              //  borderRadius: 10,
              borderColor: "#001b3f",
              borderWidth: 4,
            },
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 20,
              lineHeight: 20,
              borderRadius: 4,
              show: true,
              // padding: [10, 10, 0, 0],
              formatter: function (params) {
                let total = 0;
                data.forEach((item) => {
                  total += item.value;
                });
                let percen =
                  ((Number(params.value) / total) * 100).toFixed(0) + "%";
                if (params.name !== "") {
                  return (
                    "{name|" +
                    params.data.name +
                    "}" +
                    "\n" +
                    "{value|" +
                    params.data.value +
                    "}" +
                    " " +
                    "{type|" +
                    params.data.type +
                    "}"
                  );
                } else {
                  return "";
                }
              },

              rich: {
                name: {
                  fontSize: 14,
                  // fontSize: this.autoFontSize(0.14),
                  color: "#fff",
                  padding: [0, 0, 3, 0],
                },
                value: {
                  fontSize: 14,
                  // fontSize: this.autoFontSize(0.14),
                  color: "#fff",
                  padding: [0, 5, 0, 0],
                },
                type: {
                  fontSize: 14,
                  // fontSize: this.autoFontSize(0.14),
                  color: "#7A99FF",
                },
              },
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 25,
            },
            data: data,
          },
          {
            name: "内圆",
            type: "pie",

            silent: true,
            radius: ["44.5%", "45%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: "#6C8097",
            },
            data: maxArr,
          },

          {
            name: "外圆1",
            type: "pie",

            silent: true,
            radius: ["77%", "79%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: "#162B48",
            },
            data: maxArr,
          },
        ],
      };
      if (option && typeof option === "object") {
        myChart.setOption(option);
      }
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    breakAlarm() {
      var myChart = echarts.init(this.$refs.breakAlarm);
      let symbolImg = "image://" + require("../../assets/slices/guaidian.png"); //或者import引入在拼接也行
      var option;
      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
            label: {
              backgroundColor: "#6a7985",
            },
          },
          formatter: function (params) {
            console.log(params, 'params243');
            return params.length && params[0].name + "<br />" + params[0].marker + '能效率：' + params[0].value + '%';
          },
        },
        legend: {
          // x: "center", //可设定图例在左、右、居中
          // y: "top", //可设定图例在上、下、居中
          // padding: [0, 0, 10, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
          // data: ["去年同期", "近12个月"],
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: [
          {
            axisLine: {
              //这是x轴文字颜色
              lineStyle: {
                color: "#6C8097",
              },
            },
            axisTick: {
              alignWithLabel: true,
            },
            boundaryGap: true,
            type: "category",
            data: ['10.19', '10.20', '10.21', '10.22', '10.23', '10.24', '10.25'],
            axisLabel: { interval: 0, rotate: 315 },
          },
        ],
        yAxis: {
          min: 0,
          max: 100,
          axisLine: {
            //这是x轴文字颜色
            lineStyle: {
              color: "#6C8097",
            },
          },
          splitLine: {
            //网格线
            lineStyle: {
              type: "dashed", //设置网格线类型 dotted：虚线 solid:实线
              color: ["#192C48"],
            },
            show: true, //隐藏或显示
          },
          axisLabel: {
            formatter: '{value}%',
            show: true,
          },
        },
        series: [
          {
            type: "line",
            color: "#4F78FF",
            symbol: symbolImg,
            symbolSize: 20,
            data: [0, 0, 80, 0, 0, 0, 0],
          },
        ],
      };

      option && myChart.setOption(option);

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    linechart() {
      let newXdata = this.xdata.map(item => item * 100)
      let symbolImg = "image://" + require("../../assets/slices/guaidian.png"); //或者import引入在拼接也行
      var myChart = echarts.init(this.$refs.linechart);
      var option;
      option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
            label: {
              backgroundColor: "#6a7985",
            },
          },
          formatter: function (params) {
            return params[0].axisValue + "</br>" + params[0].marker + "故障关单率：" + params[0].value + "%"
          },
        },
        legend: {
          x: "center", //可设定图例在左、右、居中
          y: "top", //可设定图例在上、下、居中
          padding: [0, 0, 10, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
          // data: ["去年同期", "近12个月"],
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: [
          {
            axisLine: {
              //这是x轴文字颜色
              lineStyle: {
                color: "#6C8097",
              },
            },
            axisTick: {
              alignWithLabel: true,
            },
            boundaryGap: true,
            type: "category",
            data: this.ydata,
            axisLabel: { interval: 0, rotate: 315 },
          },
        ],
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          axisLine: {
            //这是x轴文字颜色
            lineStyle: {
              color: "#6C8097",
            },
          },
          splitLine: {
            //网格线
            lineStyle: {
              type: "dashed", //设置网格线类型 dotted：虚线 solid:实线
              color: ["#192C48"],
            },
            show: true, //隐藏或显示
          },
          axisLabel: {
            formatter: '{value}%',
            show: true,
          },
        },
        series: [
          {
            type: "line",
            color: "#4F78FF",
            symbol: symbolImg,
            symbolSize: 20,
            data: newXdata,
          },
        ],
      };

      option && myChart.setOption(option);

      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    chartDom() {
      var myChart = echarts.init(document.getElementById("chartDom"));
      var option;
      option = {
        tooltip: {
          formatter: function (params) {
            return params.name + "<br />" + params.marker + "故障总时长：" + params.value + "h"
          }
        },
        legend: {},
        xAxis: [
          {
            axisLine: {
              //这是x轴文字颜色
              lineStyle: {
                color: "#6C8097",
              },
            },
            axisTick: {
              alignWithLabel: true,
            },
            boundaryGap: true,
            type: "category",

            data: this.yDurationdata,
            axisLabel: { interval: 0, rotate: 315 },
          },
        ],
        yAxis: {
          axisLine: {
            //这是x轴文字颜色
            lineStyle: {
              color: "#6C8097",
            },
          },
          splitLine: {
            //网格线
            lineStyle: {
              type: "dashed", //设置网格线类型 dotted：虚线 solid:实线
              color: ["#192C48"],
            },
            show: true, //隐藏或显示
          },
        },
        grid: {
          top: "10%",
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },

        series: [
          {
            type: "bar",
            data: this.xDurationdata,
            barWidth: 15,
            itemStyle: {
              // color: "#4169E1",
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#00ccd2' },
                { offset: 1, color: '#00a2ff' }
              ])
            },
          },
        ],
      };

      option && myChart.setOption(option);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    dashboard(data = []) {
      var chartDom = document.getElementById("dashboard");
      var myChart = echarts.init(chartDom);
      var option;
      let innerData = data.length ? data.map(item => {
        return {
          value: Number(item.value * 100).toFixed(2),
          name: item.name
        }
      }) : [{
        value: 0,
        name: '停机率'
      }]
      option = {
        tooltip: {
          formatter: function (params) {
            return params.marker + "停机率：" + params.value + "%"
          }
        },
        series: [
          {
            name: "外围刻度",
            type: "gauge",
            radius: "86%",
            splitNumber: 1,
            center: ["50%", "55%"],
            axisLine: {
              lineStyle: {
                width: 4,
                color: [[1, "#00b3ff"]],
                shadowColor: "#fff",
                shadowBlur: 10,
              },
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            detail: {
              show: false,
            },
            pointer: {
              show: false,
            },
          },
          {
            name: "内层数据刻度",
            type: "gauge",
            radius: "85%",
            center: ["50%", "55%"],
            axisLine: {
              lineStyle: {
                width: 30,
                color: [
                  [
                    0,
                    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      { offset: 0, color: "#011744" },
                      { offset: 1, color: "#156ad4" },
                    ]),
                  ],
                  [
                    1,
                    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      { offset: 0, color: "#011744" },
                      { offset: 1, color: "#156ad4" },
                    ]),
                  ],
                ],
              },
            },
            splitNumber: 1,
            splitLine: {
              length: 15,
              lineStyle: {
                width: 3,
                color: "#00baff",
              },
            },
            axisTick: {
              lineStyle: {
                color: "#00baff",
              },
            },
            axisLabel: {
              color: "#cbfff6",
              fontSize: 11,
              distance: -15
            },
            detail: {
              show: false,
            },
            itemStyle: {
              normal: {
                color: "cyan",
              },
            },
            pointer: {
              width: 5,
              length: "90%",
            },
            data: innerData,
          },
          {
            name: "最内层线",
            type: "gauge",
            radius: "35%",
            center: ["50%", "55%"],
            splitNumber: 1,
            startAngle: 359.9999999999999,
            endAngle: 0,
            axisLine: {
              show: false,
              lineStyle: {
                opacity: 0,
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                opacity: 0,
              },
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              length: 2,
              lineStyle: {
                color: "#00b3ff",
                width: 3,
                type: "solid",
              },
            },
            detail: {
              show: false,
            },
            pointer: {
              show: false,
            }
          },
          {
            name: "饼图",
            tooltip: {
              show: false,
            },
            type: "pie",
            radius: ["0%", "30%"],
            center: ["50%", "55%"],
            hoverAnimation: false,
            splitNumber: 1,
            itemStyle: {
              normal: {
                color: "#000939",
              },
              emphasis: {
                color: "#000939",
              },
            },
            label: {
              normal: {
                show: true,
                position: "center",
                formatter: function (params) {
                  return (
                    "{value|" +
                    Number(params.value * 100).toFixed(2) +
                    "}{unit|%}\n{name|" +
                    params.name +
                    "}"
                  );
                },
                rich: {
                  value: {
                    fontFamily: "SFUDINEngschrift",
                    // fontSize: 20,
                    fontSize: this.autoFontSize(0.16),
                    color: "#fff",
                    verticalAlign: "bottom",
                  },
                  unit: {
                    fontFamily: "SFUDINEngschrift",
                    fontSize: this.autoFontSize(0.18),
                    // fontSize: 18,
                    color: "#fff",
                    lineHeight: 34,
                    verticalAlign: "bottom",
                  },
                  name: {
                    fontFamily: "Microsoft YaHei",
                    // fontSize: 16,
                    fontSize: this.autoFontSize(0.16),
                    color: "#4F78FF",
                    lineHeight: 23,
                  },
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            animation: false,
            data: data,
          },
        ],
      };
      window.addEventListener("resize", () => {
        myChart.resize();
      });

      option && myChart.setOption(option);
    },
    indexedata(toatl, data) {
      var chartDom = document.getElementById("maindata");
      var myChart = echarts.init(chartDom);
      var option;
      var app = {};
      let lineColor = "#0042FF";
      var colorList = ["#159AFF", "#FF7734", "#DA5656", "#B0D24F", "#1559FF"]
      if (!data) return;
      const numArr = data.map((item) => item.value);
      const maxNum = Math.max(...numArr);
      const maxArr = [];
      data.forEach((item, index) => {
        maxArr.push(maxNum);
        item.label = {
          color: colorList[index]
        }
      });
      option = {
        // backgroundColor: 'rgb(7, 14, 34)',
        color: colorList,
        title: {
          text: `{val|${toatl}}\n{name|总量（台）}`,
          left: "center",
          top: "center",
          textStyle: {
            rich: {
              name: {
                // fontSize: 14,
                fontSize: this.autoFontSize(0.14),
                color: "#FFFFFF",
                padding: [10, 0],
              },
              val: {
                // fontSize: 30,
                fontSize: this.autoFontSize(0.18),
                fontWeight: "bold",
                color: "#FFFFFF",
              },
            },
          },
        },
        grid: {
          top: "10%",
          left: "20%",
          right: "20%",
          bottom: "10%",
          containLabel: true,
        },
        tooltip: {
          show: true,
          formatter: function (params) {
            return params.marker + `${params.name}: ` + params.value + '台'
          }
        },
        legend: {
          orient: "horizontal",
          bottom: 0,
          left: "center",
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 10,
          // icon: 'circle',
          textStyle: {
            borderRadius: 10,
            color: "#fff",
            fontSize: 12,
          },
        },
        series: [
          {
            name: "",
            type: "pie",
            center: ["50%", "50%"],
            radius: ["50%", "65%"],
            itemStyle: {
              //  borderRadius: 10,
              borderColor: "#001b3f",
              borderWidth: 4,
            },
            label: {
              position: "outer",
              // alignTo: "edge",
              padding: 10,
              formatter: function (params) {
                return params.name + params.percent + "%"
              },
              rich: {
                type: {
                  fontSize: 12,
                  color: "#fFF",
                  padding: 10,
                },
              },
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 25,
            },
            data: data,
          },

          {
            name: "内圆",
            type: "pie",

            silent: true,
            radius: ["42%", "42.5%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: "#6C8097",
            },
            data: maxArr,
          },

          {
            name: "外圆1",
            type: "pie",

            silent: true,
            radius: ["77%", "75%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            itemStyle: {
              color: "#162B48",
            },
            data: maxArr,
          },
        ],
      };
      if (option && typeof option === "object") {
        myChart.setOption(option);
      }
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      option && myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
.base-select-container {
  color: #409eff;
  width: 5.4vw;
  height: 3.33vh;
  margin-right: 2.2vw;
  transform: translateY(-1.5vh);

  ::v-deep .el-select .el-input .el-input__inner {
    border-radius: 5px;
    border: 1px solid #409eff;
    background: #001b3f;
    color: #fff;
    border-radius: 5px;
    font-size: 12px;
    color: #fff;
  }

}

.el-icon-arrow-down {
  font-size: 12px;
  color: red;

}

::v-deep .el-dropdown .el-dropdown-link {
  color: #4F78FF !important;
  font-size: 0.6vw !important;
}

::v-deep .dropdown.el-dropdown-menu .el-dropdown-item:hover {
  color: #4F78FF !important;
}

.el-dropdown-link-menu {
  width: 7.4vw;
  background-color: transparent;
  border: 2px solid #4F78FF;
  transform: translateY(-1.5vh);
  margin-right: 1.28vw;
  text-align: center;
  cursor: pointer;

  .el-dropdown-item {
    color: white;
    height: 3.33vh;
  }
}

.el-icon-arrow-down {
  font-size: 12px;
}

* {
  padding: 0;
  margin: 0;
}

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
}

.el-carousel__item h3 {
  font-size: 14px;
  opacity: 0.75;
  margin: 0;
}

.content {
  color: #fff;
  background: #001b3f;
  width: 100%;
  height: 100%;
  padding-bottom: 2.22vh;
  padding-left: 1.25%;
  padding-right: 1.25%;
  overflow: hidden;

  .bg {
    background-image: url("../../assets/slices/zhuti.png");
    background-repeat: no-repeat;
    background-color: #001b3f;
    background-size: 100% 94.91vh;
    width: 100%;
    height: 94.91vh;
    margin-top: 2.87vh;
  }
}

/* 主体 */
.content {
  color: #fff;
  background: #001b3f;
  width: 100%;
  height: 100vh;
}

.module-box {
  display: flex;
  padding-left: 1.2%;
  padding-right: 1.2%;
}

.h3 {
  transform: translateY(-1.4vh);
  letter-spacing: 10px;
  font-size: 1.87vw;
  color: #ffffff;
  letter-spacing: 0.23vw;
  font-family: "pangzhengmendao-Regular";
}

.header {
  height: 7.41%;
}

.imgdata {
  background-image: url("../../assets/slices/shebeiyunxingshichang.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 28.49vw;
  height: 1.76vh;
  transform: translateY(-0.74vh);
}

.imggaojin {
  background-image: url("../../assets/slices/shebeigaojin.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 35.57vw;
  height: 1.76vh;
  transform: translateY(-0.74vh);
}

.imgtingji {
  background-image: url("../../assets/slices/shebeitingjilv.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 26.34vw;
  height: 1.76vh;
  margin-left: 0.68vw;
  transform: translateY(-0.74vh);
}

.dropdown {
  background-color: transparent;
  border: 2px solid #0639CA;

  .el-dropdown-item {
    color: white;
    height: 3.33vh;
  }

  .el-dropdown-item:hover {
    color: #4F78FF;
    background-color: transparent;
  }
}

.left-bg {
  background-image: url("../../assets/slices/leftbian.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 27.22vh;
  display: flex;
  padding-top: 1.14%;
  padding-left: 1.3%;

  .module {
    width: calc(100% / 2);

    .module-tillen {
      margin-left: 1.09vw;
      font-size: 0.8vw;

      ::v-deep .el-button {
        font-size: 0.8vw !important;
      }
    }

    .imgage {
      background-image: url("../../assets/slices/shebeizonglan.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 30.78vw;
      height: 1.76vh;
      transform: translateY(-0.74vh);
    }

    .imgage1 {
      background-image: url("../../assets/slices/shebeizonglan.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 30.78vw;
      width: 100%;
      height: 1.76vh;
      transform: translateY(-0.74vh);
    }

    .zongliang {
      display: flex;
      justify-content: space-around;
      width: 100%;
      height: 84.35%;

      .clione-big {
        .clione {
          background-image: url("../../assets/slices/beijing.png");
          background-size: 100% 100%;
          width: 6vw;
          height: 8vh;
          margin-top: 0.7vh;
          margin-left: 0.2vw;
          background-repeat: no-repeat;
          text-align: center;

          .tillen1 {
            margin-top: 1.11vh;
            margin-bottom: 1.02vh;
            font-size: 0.62vw;
          }

          .tillen2 {
            font-size: 1.775vw;
          }
        }
      }
    }
  }
}

.right-bg {
  background-image: url("../../assets/slices/rightbian.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 85.9vh;
  .outage-rate-select {
    margin-right: 1.83vw;
    background: rgba(17,93,190,0.2);
    border: 1px solid #4F78FF;
    border-image: linear-gradient(90deg, rgba(42, 112, 255, 0), rgba(149, 178, 255, 0.5), rgba(42, 154, 255, 0.01)) 1 1;
    padding: 0 0.5vw; 
  }
}

#app [class*="default"] {
  //需要更改的按钮类型
  background: transparent !important;
  border-color: transparent !important;
}

#app .active.el-button {
  color: #4F78FF;
  font-size: 1vw !important;
  // font-size: 1.1vw !important;
}

#app .el-button--small {
  padding: 0px 0px;
  // margin: 0px 0px !important;
}

.el-button+.el-button {
  margin-left: 0px;
}

::v-deep .dv-scroll-board .header {
  // font-size: 12px !important;
  font-size: 0.6vw !important;

}

::v-deep .dv-scroll-board .rows .row-item {
  // font-size: 12px !important;
  font-size: 0.6vw !important;
}

#app .base-select-container ::v-deep .filter-select {
  width: 5.31vw;
  border-radius: 2px;

  &.last {

    &.el-input .el-input__inner,
    .el-input .el-input__inner {
      width: 220%;
      margin-left: -15%;
      transform: scale(0.8);
      padding: 2vh 1.5vh !important;

    }
  }

  &.el-input .el-input__inner,
  .el-input .el-input__inner {
    background-color: #008ef300;
    border-radius: 2px;
    height: 2vh;
    padding: 2vh 1.5vh !important;
    transform: scale(0.6);
    padding-right: 1.4vh !important;
    font-size: 1vw !important;
    width: 150%;
    color: #4F78FF;
    line-height: 4vh !important;
    border: 1px solid #4F78FF !important;

    &::-webkit-input-placeholder {
      color: #4F78FF !important;
      // font-size: 12px;
      font-size: 1vw;
    }
  }

  .el-input__suffix {
    display: none;
  }

  .el-select-dropdown {
    z-index: 9999999 !important;
    background: linear-gradient(rgba(0, 76, 165, 0.32),
        rgba(27, 154, 232, 0.46),
        rgba(0, 76, 165, 0.32)) !important;
    border: none;
    text-align: center;
    backdrop-filter: blur(12px);
    /*重点*/
    -webkit-backdrop-filter: blur(12px);
    top: 36px !important;

    /*兼容Safari*/
    .popper__arrow {
      background-color: rgb(0, 77, 165) !important;
      display: none;

    }

    .el-select-dropdown__item {
      color: #ffffff;
      font-weight: 400 !important;
      // font-size: 12px!important;
      font-size: 1vw !important;
      transform: scale(0.8);

    }

    .el-select-dropdown__item.selected {
      background-color: #f5f7fa00 !important;
      color: #4F78FF !important;
    }

    .el-select-dropdown__item:hover {
      background-color: #f5f7fa00 !important;
      color: #4F78FF !important;
    }

    .el-select-dropdown__item.hover {
      background-color: #f5f7fa00 !important;
      color: #4F78FF !important;
    }
  }
}

#app ::v-deep .el-select-dropdown {
  background: linear-gradient(rgba(0, 76, 165, 0.32),
      rgba(27, 154, 232, 0.46),
      rgba(0, 76, 165, 0.32)) !important;
  border: none;
  text-align: center;
  backdrop-filter: blur(12px);
  /*重点*/
  -webkit-backdrop-filter: blur(12px);

  /*兼容Safari*/
  .popper__arrow {
    // background-color: rgb(0, 77, 165) !important;
    display: none;

  }

  .el-select-dropdown__item {
    color: #ffffff;
    font-weight: 400 !important;
    // font-size: 12px!important;
    font-size: 1vw !important;
    transform: scale(0.8);

  }

  .el-select-dropdown__item.selected {
    background-color: #f5f7fa00 !important;
    color: #00fbff !important;
  }

  .el-select-dropdown__item:hover {
    background-color: #f5f7fa00 !important;
    color: #00fbff !important;
  }

  .el-select-dropdown__item.hover {
    background-color: #f5f7fa00 !important;
    color: #00fbff !important;
  }
}

.el-select-dropdown__item {
  color: #ffffff;
  font-weight: 400 !important;
  // font-size: 12px!important;
  font-size: 1vw !important;
  transform: scale(0.8);

}

.el-select-dropdown__item.selected {
  background-color: #f5f7fa00 !important;
  color: #00fbff !important;
}

.el-select-dropdown__item:hover {
  background-color: #f5f7fa00 !important;
  color: #00fbff !important;
}

.el-select-dropdown__item.hover {
  background-color: #f5f7fa00 !important;
  color: #00fbff !important;
}</style>
