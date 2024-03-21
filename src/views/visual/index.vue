<template>
  <div class="app-container visual-container">
    <el-row class="visual" :gutter="10">
      <el-col :span="8">
        <div class="platform">
          <div class="title">
            <img src="@/assets/elec.png" alt="">
            <div>
              <h3>智慧电厂数据中心</h3>
              <p class="link">http://121.196.53.34:9020/dashboard.html</p>
              <el-button type="info" style="background:rgb(103, 175, 210);color:#fff;border-color:rgb(103, 175, 210)" class="buttonCircle" @click="open('http://121.196.53.34:9020/dashboard.html')">链接</el-button>
            </div>
          </div>
          <div>
            <p
              class="article"
              title="打通工厂CNC数控机床信息孤岛，实现设备数据实时采集与联网。打造企业信息化的生产设备综合管理、与远程监控运维能力。本项目采用工业级工控边缘网关，上行基于5G实现网关与平台的低延时高带宽数据通讯，下行与工业设备层基于TCP的设备函数库SDK的协议实现数据采集对接。以毫秒级速率实时采集CNC设备运行参数、告警信息、轴位置等高价值数据，通过边缘运算和数据清洗上报云端。云端通过垂直行业应用实现设备数据实时动态分析，展现以及生产报表。为工厂设备运维、生产过程优化提供了可靠的依据和保障。"
            >
              打通工厂CNC数控机床信息孤岛，实现设备数据实时采集与联网。
              打造企业信息化的生产设备综合管理、与远程监控运维能力。
              本项目采用工业级工控边缘网关，上行基于5G实现网关与平台的低延时高带宽数据通讯，下行与工业设备层基于TCP的设备函数库SDK的协议实现数据采集对接。以毫秒级速率实时采集CNC设备运行参数、告警信息、轴位置等高价值数据，通过边缘运算和数据清洗上报云端。云端通过垂直行业应用实现设备数据实时动态分析，展现以及生产报表。为工厂设备运维、生产过程优化提供了可靠的依据和保障。
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="platform">
          <div class="title">
            <img src="@/assets/5g.png" alt="">
            <div>
              <h3>5G工业边缘计算平台</h3>
              <p class="link">http://121.196.53.34:9021/fac.html</p>
              <el-button type="warning" style="background-color:#fc6c5f;" class="buttonCircle"  @click="open('http://121.196.53.34:9021/fac.html')">链接</el-button>
            </div>
          </div>
          <div>
            <p class="article" title="安全稳定的生产是电力企业的根本。阳泉电厂5G工业互联网项目通过边缘网关以时序数据库SDK的方式，对接来此OPC侧实时生产数据。并通过数据本地化、规则化清洗、治理，将海量数据转换成为高价值的生产状态监控数据，数据通过网关以5G通讯方式导出云端。平台侧进行可视化工厂的建设以及实施生产安全监控。为工厂的安全稳定带来了可靠的信息化保障。">
              安全稳定的生产是电力企业的根本。阳泉电厂5G工业互联网项目通过边缘网关以时序数据库SDK的方式，对接来此OPC侧实时生产数据。并通过数据本地化、规则化清洗、治理，将海量数据转换成为高价值的生产状态监控数据，数据通过网关以5G通讯方式导出云端。平台侧进行可视化工厂的建设以及实施生产安全监控。为工厂的安全稳定带来了可靠的信息化保障。
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="platform">
          <div class="title">
            <img src="@/assets/zchy.png" alt="">
            <div>
              <h3>中远海运</h3>
              <p class="link">http://121.196.53.34:9080/index.html</p>
              <el-button type="info" style="background:#44b5ec;color:#fff;border-color:#44b5ec" class="buttonCircle" @click="open('http://121.196.53.34:9080/index.html')" >链接</el-button>
            </div>
          </div>
          <div>
            <p class="article" title="平台实现厂区重要信息的可视化，助力企业生产、安全、管理。通过边缘网关解析厂区重点设备协议，实时采集和上传设备数据，实现设备异常状态的报警推送，有助于设备检修运维及有效管理，延长设备使用寿命；厂区生产重要数据的展示，有助于生产合理调度；厂区安全数据统计展示，有助于加强安全管理，降低风险。">
              平台实现厂区重要信息的可视化，助力企业生产、安全、管理。通过边缘网关解析厂区重点设备协议，实时采集和上传设备数据，实现设备异常状态的报警推送，有助于设备检修运维及有效管理，延长设备使用寿命；厂区生产重要数据的展示，有助于生产合理调度；厂区安全数据统计展示，有助于加强安全管理，降低风险。
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="margin-top:10px;">
        <div class="platform">
          <div class="title">
            <img src="@/assets/zndz.png" alt="">
            <div>
              <h3>云制造平台数据中心</h3>
              <p class="link">http://121.196.53.34:9020/powerPlant.html</p>
              <el-button style="background:#63a1ff;color:#fff;border-color:#63a1ff" class="buttonCircle" @click="open('http://121.196.53.34:9020/powerPlant.html')">链接</el-button>
            </div>
          </div>
          <div>
            <p class="article" title="智能电站平台依托5G、物联网技术，以及边缘计算技术实现对发电厂各类设备实时运行数据的采集、转换、传输和存储，并通过图形、图表的方式对监控数据进行可视化展示的功能；智能电站平台以平台海量设备运行数据为基础，工业互联网大数据引擎，对数据进行深入挖掘和分析，实现设备全生命周期健康管理。">
              智能电站平台依托5G、物联网技术，以及边缘计算技术实现对发电厂各类设备实时运行数据的采集、转换、传输和存储，并通过图形、图表的方式对监控数据进行可视化展示的功能；智能电站平台以平台海量设备运行数据为基础，工业互联网大数据引擎，对数据进行深入挖掘和分析，实现设备全生命周期健康管理。
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="8" style="margin-top:10px;">
        <div class="platform">
          <div class="title">
            <img src="@/assets/sbd.png" alt="">
            <div>
              <h3>输变电物联网平台</h3>
              <p class="link">http://121.196.53.34:18180/#/sensor/homePage</p>
              <el-button style="background:rgb(247, 187, 8);color:#fff;border-color:rgb(247, 187, 8)" class="buttonCircle" @click="open('http://121.196.53.34:18180/#/sensor/homePage')">链接</el-button>
            </div>
          </div>
          <div>
            <p class="article" title="智能电站平台依托5G、物联网技术，以及边缘计算技术实现对发电厂各类设备实时运行数据的采集、转换、传输和存储，并通过图形、图表的方式对监控数据进行可视化展示的功能；智能电站平台以平台海量设备运行数据为基础，工业互联网大数据引擎，对数据进行深入挖掘和分析，实现设备全生命周期健康管理。">
              智能电站平台依托5G、物联网技术，以及边缘计算技术实现对发电厂各类设备实时运行数据的采集、转换、传输和存储，并通过图形、图表的方式对监控数据进行可视化展示的功能；智能电站平台以平台海量设备运行数据为基础，工业互联网大数据引擎，对数据进行深入挖掘和分析，实现设备全生命周期健康管理。
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Visual',
  methods: {
    open: function(url) {
      window.open(url)
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container.visual-container{
    padding: 0;
    background-color: transparent;
  }
  .visual h3{
    padding: 0;
    margin: 0;
    margin-top: 4px;
  }
  .visual .platform{
    border-radius: 15px;
    padding: 15px !important;
    background-color: #fff;
    border:1px solid #cecece;
    overflow-y: hidden;
  }
  .visual .platform .title>div{
    width: calc(100% - 120px);
  }
  .visual .platform .title{
    height: 100px;
    width:100%;
    display: inline-block;
  }
  .visual .platform .title>*{
    float: left;
  }
  .visual .platform .title>img{
    width: 95px;
    height: 95px;
  }
  .visual .platform .title>div{
    margin-left: 15px;
  }
  .visual .platform p{
    color: #696969;
  }
  .visual .platform .title p{
    margin-top: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: keep-all;
    white-space: nowrap;
  }
  .visual .platform .title .el-button{
  }
  .visual .platform p.article{
    height: 80px;
    overflow: hidden;
    font-size: 14px;
  }
  .buttonCircle{
    border-radius: 8px !important;
  }
</style>
