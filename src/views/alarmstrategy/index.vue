<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="20" class="table-filter">
          <el-form
            ref="filterForm"
            :inline="true"
            :model="listQuery"
            label-width="0px"
            class="filterForm"
            @submit.native.prevent
          >
            <el-form-item>
              <el-tooltip content="添加">
                <el-button icon="el-icon-plus" @click="handleCreate"/>
              </el-tooltip>
            </el-form-item>
            <el-form-item prop="alarmName">
              <el-input
                v-model.trim="listQuery.alarmName"
                placeholder="告警项名称"
              />
            </el-form-item>
            <el-form-item prop="monitorName">
              <el-select
                v-model.trim="listQuery.monitorName"
                placeholder="监控项名称"
              >
                <el-option
                  v-for="item in monitorList"
                  :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-tooltip content="重置">
                <el-button icon="el-icon-refresh" @click="resetQuery"/>
              </el-tooltip>
              <el-tooltip content="搜索">
                <el-button icon="el-icon-search" @click="handleFilter"/>
              </el-tooltip>
            </el-form-item>
            <!-- <el-form-item>
              <el-tooltip content="导出">
                <el-button   icon="el-icon-download" @click="onload"/>
              </el-tooltip>
            </el-form-item> -->
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="listLoading" :data="list" stripe size="mini">
      <el-table-column label="序号" type="index" width="80" align="center"/>
      <el-table-column label="告警项名称" prop="alarmName" align="center"/>
      <el-table-column label="监控项名称" prop="monitorName" align="center">
      <template slot-scope="scope">
          <span>{{ scope.row.monitorName | alarmNameFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作符" prop="operator" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operator | operatorFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="阈值" prop="threshold" align="center"/>
      <el-table-column label="告警级别" prop="alarmLevel" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alarmLevel | alarmLevelFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置时间" prop="createTime" align="center"/>
      <el-table-column label="配置状态" prop="alarmCfgStatus" align="center">
        <template slot-scope="scope">
          <svg-icon
            :icon-class="scope.row.alarmCfgStatus ? 'online' : 'offline'"
          />
          <span>{{ scope.row.alarmCfgStatus | alarmCfgStatusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350" align="center">
        <template slot-scope="scope">
          <el-tooltip content="修改">
            <el-button
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              class="elbuttondefault"
            />
          </el-tooltip>
          <el-tooltip content="删除">
            <el-button
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              class="elbuttondefault"
            />
          </el-tooltip>
          <!-- <el-tooltip content="应用网关组">
              <el-button icon="el-icon-setting" @click="showGroup(scope.row)" class="elbuttondefault"/>
            </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-width="100px"
        size="mini"
        @submit.native.prevent
      >
        <el-row v-show="false">
          <el-col>
            <el-form-item prop="alarmCfgId">
              <input v-model.trim="temp.alarmCfgId" type="hidden"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="告警项名称" prop="alarmName">
              <el-input v-model.trim="temp.alarmName" placeholder="请输入告警项名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="网关组" prop="gatewayGroup">
              <el-select v-model.trim="temp.gatewayGroup">
                <el-option
                  v-for="item in monitorListdata"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="网关" prop="gatewayName">
              <el-select v-model.trim="temp.gatewayName">
                <el-option
                  v-for="item in EdgeDeviceName"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="设备" prop="deviceName">
              <el-select v-model.trim="temp.deviceName">
                <el-option
                  v-for="item in getDevicddata"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="监控项名称" prop="monitorName">
              <el-select v-model.trim="temp.monitorName">
                <el-option
                  v-for="item in monitorList"
                  :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="操作符" prop="operator">
              <el-select v-model.trim="temp.operator">
                <el-option v-for="item in operatorList" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="temp.operator!==6">
          <el-col>
            <el-form-item label="阈值" prop="threshold">
              <el-input v-model.trim="temp.threshold" placeholder="请输入阈值"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="temp.operator===6">
          <el-col>
            <el-form-item label="最小值" prop="minthreshold">
              <el-input v-model.trim="temp.minthreshold" @blur="changeValue" placeholder="请输入阈值最小值"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="temp.operator===6">
          <el-col>
            <el-form-item label="最大值" prop="maxthreshold">
              <el-input v-model.trim="temp.maxthreshold" @blur="changeValue" placeholder="请输入阈值最大值"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="告警级别" prop="alarmLevel">
              <el-select v-model.trim="temp.alarmLevel">
                <el-option
                  v-for="item in alarmLevelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="事件类型" prop="eventType">
              <el-select v-model.trim="temp.eventType">
                <el-option v-for="item in eventType" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="配置状态" prop="alarmCfgStatus">
              <el-select v-model.trim="temp.alarmCfgStatus">
                <el-option
                  v-for="item in alarmCfgStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="应用网关组"
      :visible.sync="dialogGroupVisible"
      :close-on-click-modal="false"
    >
      <el-tree
        ref="tree"
        :data="groupList"
        show-checkbox
        default-expand-all
        node-key="groupId"
        :props="{ label: 'groupName' }"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupVisible = false"> 取消</el-button>
        <el-button type="primary" @click="applyGroup()"> 确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {
  getList,
  addOrUpdateData,
  deleteDataAlarm,
  findAllByGroupName,
  findAllByEdgeDeviceName,
  getDeviceName
} from "@/api/alarmstrategy";
import Pagination from "@/components/Pagination";

const monitorList = [
{
    value:"CurrentBedWidth",
    label:"当前床规格_床的宽度" 
  },
  {
    value:"CurrentBedlength", 
    label:"当前床规格_床的长度"
  },
  {
    value:"CurrentBedHeight",
    label: "当前床规格_弹簧高度"
  }];
const operatorList = [
  {
    value: 1,
    label: '>'
  },
  {
    value: 2,
    label: '<'
  },
  {
    value: 3,
    label: '='
  },
  {
    value: 4,
    label: '>='
  },
  {
    value: 5,
    label: '<='
  },
  {
    value: 6,
    label: "[a,b]"
  },

]

const alarmLevelList = [
  {
    value: 1,
    label: "严重",
  },
  {
    value: 2,
    label: "紧急",
  },
  {
    value: 3,
    label: "一般",
  },
  // {
  //   value: 3,
  //   label: "一般严重",
  // },
  // {
  //   value: 4,
  //   label: "严重",
  // },
  // {
  //   value: 5,
  //   label: "灾难",
  // }
];

const alarmCfgStatusList = [
  {
    value: true,
    label: "启用",
  },
  {
    value: false,
    label: "停用",
  },
];
const networkList = [
  "网关1",
  "网关2",
  "网关3"
];

const eventType = [
  {
    value: 1,
    label: '故障通知'
  },
  {
    value: 2,
    label: '预警通知'
  },
  {
    value: 3,
    label: '普通通知'
  }
]
const eventtypeNameKeyValue = formatterList(eventType);
const monitorNameKeyValue = formatterList(monitorList);
const operatorKeyValue = formatterList(operatorList);
const alarmLevelKeyValue = formatterList(alarmLevelList);
const alarmCfgStatusKeyValue = formatterList(alarmCfgStatusList);
const networkValue = formatterList(networkList);

function formatterList(list) {
  return list.reduce((pre, cur) => {
    pre[cur.value] = cur.label;
    return pre;
  }, {});
}

export default {
  components: {Pagination},
  filters: {
    eventtypeNameFilter(key) {
      return eventtypeNameKeyValue[key];
    },
    alarmNameFilter(key) {
      return monitorNameKeyValue[key];
    },
    operatorFilter(key) {
      return operatorKeyValue[key];
    },
    alarmLevelFilter(key) {
      return alarmLevelKeyValue[key];
    },
    alarmCfgStatusFilter(key) {
      return alarmCfgStatusKeyValue[key];
    },
    networkFilter(key) {
      return networkValue[key];
    }
  },
  data() {
    return {
      getDevicddata: "",
      EdgeDeviceName: "",
      monitorListdata: [],
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        alarmName: "",
        monitorName: "",
        operator: "",
        currentPage: 1,
        pageSize: 10,
        orderby: "createTime",
        order: "desc",
      },
      temp: {
        id: "",
        alarmName: "",
        gatewayGroup: "",
        gatewayName: "",
        deviceName: "",
        monitorName: "",
        operator: "",
        threshold: "",
        alarmLevel: "",
        alarmCfgStatus: "",
        updateTime: "",
        eventType: "",
        minthreshold: '',
        maxthreshold: '',
      },


      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        create: "新增告警配置",
        update: "修改告警配置",
      },
      rules: {
        alarmName: [
          {required: true, message: "请输入告警项名称", trigger: "blur"},
        ],
        monitorName: [
          {required: true, message: "请选择监控项名称", trigger: "change"},
        ],
        operator: [
          {required: true, message: '请选择操作符', trigger: 'change'}
        ],
        minthreshold: [
          {required: true, message: '请输入阈值', trigger: 'change'},
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '请输入正确的阈值格式,只能为数字或者小数'
          }
        ],
        maxthreshold: [
          {required: true, message: '请输入阈值', trigger: 'change'},
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '请输入正确的阈值格式,只能为数字或者小数'
          }
        ],
        threshold: [
          {required: true, message: '请输入阈值', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              const ruleValue = this.temp.threshold;
              if (this.temp.operator === 6) {
                if (
                  !/^[\(,\[ ](-?\d+)(\.\d+)?\,{1}(-?\d+)(\.\d+)?(([\),\] ]$))/.test(
                    ruleValue
                  )
                ) {
                  callback("规则值区间格式有误!1");
                } else {
                  var value0 = ruleValue.replace(/\s+/g, "");
                  if (value0[1] === "," && value0[0] === "[") {
                    callback("规则值区间格式有误!2");
                  } else {
                    if (
                      value0[value0.length - 2] === "," &&
                      value0[value0.length - 1] === "]"
                    ) {
                      callback("规则值区间格式有误!3");
                    } else {
                      if (
                        value0[1] === "," &&
                        value0[value0.length - 2] === ","
                      ) {
                        callback("规则值区间格式有误!4");
                      } else {
                        var rules = value0.split(",");
                        var s1 = rules[0];
                        var s2 = rules[1];
                        var ss = [];
                        var s = [];
                        if (s1[0] === "[") {
                          ss = rules[0].split("[");
                        } else {
                          ss = rules[0].split("(");
                        }
                        if (s2[s2.length - 1] === "]") {
                          s = rules[1].split("]");
                        } else {
                          s = rules[1].split(")");
                        }
                        var first = ss[1];
                        var second = s[0];
                        if (
                          (first !== null || second !== null) &&
                          parseFloat(first) >= 0 &&
                          parseFloat(second) >= 0 &&
                          parseFloat(first) >= parseFloat(second)
                        ) {
                          // var value0 = ruleValue
                          // value0.reverse();
                          callback("规则值区间格式有误!5");
                        } else {
                          second = s[0];
                          if (
                            (first !== null || second !== null) &&
                            parseFloat(first) <= 0 &&
                            parseFloat(second) <= 0 &&
                            parseFloat(first) >= parseFloat(second)
                          ) {
                            callback("规则值区间格式有误!6");
                          } else {
                            if (
                              (first !== null || second !== null) &&
                              parseFloat(first) >= 0 &&
                              parseFloat(second) <= 0
                            ) {
                              callback("规则值区间格式有误!7");
                            } else {
                              callback();
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        alarmLevel: [
          {required: true, message: "请选择告警级别", trigger: "change"},
        ],
        alarmCfgStatus: [
          {required: true, message: "请选择配置状态", trigger: "change"},
        ],
      },
      eventType: eventType,
      monitorList: monitorList,
      operatorList: operatorList,
      alarmLevelList: alarmLevelList,
      alarmCfgStatusList: alarmCfgStatusList,
      networkList: networkList,
      groupTemp: {
        alarmCfgId: "",
        groupIds: [],
      },
      dialogGroupVisible: false,
      groupList: [],
    };
  },
  computed: {
    ...mapGetters(["operationPermission"]),
  },
  watch: {
    dialogFormVisible(val) {
      if (!val && this.$refs["dataForm"]) {
        this.$refs["dataForm"].resetFields();
      }
    },
    dialogGroupVisible(val) {
      if (!val && this.$refs["tree"]) {
        this.$refs["tree"].setCheckedKeys([]);
      }
    },
  },
  created() {
    this.getList();
    this.findAllByGroupName();
    this.findAllByEdgeDeviceName()
    this.getDeviceName()
  },
  methods: {
    changeValue() {
      let a = parseFloat(this.temp.minthreshold)
      let b = parseFloat(this.temp.maxthreshold)
      if (this.temp.minthreshold
        && this.temp.maxthreshold && a > b) {
        //此处交换两个的值
        let max = this.temp.minthreshold
        let min = this.temp.maxthreshold
        this.temp.minthreshold = min
        this.temp.maxthreshold = max
      }
    },
    onload() {
      let size = this.listQuery.pageSize;
      this.listQuery.pageSize = 1000000;
      getList(this.listQuery).then((response) => {
        // console.log(response)
        this.listQuery.pageSize = 10;
        if (response.success) {
          let arrs = [];
          arrs = response.data;
          arrs.map((el, index) => {
            if (el.alarmCfgStatus == true) {
              el.alarmCfgStatus = "启用"
            } else {
              el.alarmCfgStatus = "停用"
            }
            if (el.alarmLevel === 0) {
              el.alarmLevel = "未分类"
            } else if (el.alarmLevel === 1) {
              el.alarmLevel = "资讯"
            } else if (el.alarmLevel === 2) {
              el.alarmLevel = "警告"
            } else if (el.alarmLevel === 3) {
              el.alarmLevel = "一般严重"
            } else if (el.alarmLevel === 4) {
              el.alarmLevel = "严重"
            } else {
              el.alarmLevel = "灾难"
            }
            el.index = index / 1 + 1;
          })
          this.$nextTick(() => {
            this.exportExcel(arrs);
          });
        }
      });
    },
    exportExcel(arr) {
      require.ensure([], () => {
        const {export_json_to_excel} = require("../../Excel/Export2Excel"); //注意这个Export2Excel路径
        const tHeader = [
          "序号",
          "告警项名称",
          "监控项名称",
          "操作符",
          "阈值",
          "告警级别",
          "配置时间",
          "配置状态",
        ]; // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "index",
          "alarmName",
          "monitorName",
          "operator",
          "threshold",
          "alarmLevel",
          "createTime",
          "alarmCfgStatus",
        ]; // 上面的index、nickName、name是tableData里对象的属性key值
        const list1 = arr; //把要导出的数据tableData存到list
        const data = this.formatJson(filterVal, list1);
        export_json_to_excel(tHeader, data, "数据告警策略"); //最后一个是表名字
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    getList(val) {
      // console.log(val, "val");
      // if (val) {
      //   this.listQuery.currentPage = val.page;
      // }
      this.listLoading = true;
      // console.log(this.listQuery, "this.listQuery");
      getList(this.listQuery).then((response) => {
        if (response.success) {
          this.list = response.data;
          this.total = response.totalRowCount;
          // console.log(this.list,"213");
        } else {
          this.list = [];
          this.total = [];
        }
        this.listLoading = false;
      });
    },
    findAllByGroupName() {
      findAllByGroupName().then((response) => {
        this.monitorListdata = response.data;
      });
    },
    findAllByEdgeDeviceName() {
      findAllByEdgeDeviceName().then((response) => {
        this.EdgeDeviceName = response.data;
      })
    },
    getDeviceName() {
      getDeviceName().then((response) => {
        this.getDevicddata = response.data;
        console.log(response, "response")
      })
    },
    resetQuery() {
      this.$refs["filterForm"].resetFields();
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.getList();
    },
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.temp.minthreshold && this.temp.maxthreshold) {
            this.temp.threshold = "[" + this.temp.minthreshold + "," + this.temp.maxthreshold + "]"
          }

          addOrUpdateData(this.temp).then((response) => {
            // console.log(response, "新增");
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              message: response.message,
              type: "success",
              duration: this.$store.state.settings.duration,
            });

            this.temp = {
              id: "",
              alarmName: "",
              gatewayGroup: "",
              gatewayName: "",
              deviceName: "",
              monitorName: "",
              operator: "",
              threshold: "",
              alarmLevel: "",
              alarmCfgStatus: "",
              updateTime: "",
              eventType: "",
              minthreshold: '',
              maxthreshold: '',
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.dialogFormVisible = true;

      let threshold = row.threshold

      let th = threshold.replace("[", '').replace("]", '');
      let arr = th.split(',');
      if (arr[0] > arr[1]) {
        row.minthreshold = arr[1]
        row.maxthreshold = arr[0]
      } else {
        row.minthreshold = arr[0]
        row.maxthreshold = arr[1]
      }
      this.$nextTick(() => {
        this.temp = Object.assign({}, row);
        // console.log(this.temp);
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {

          if (this.temp.maxthreshold && this.temp.minthreshold) {
            this.temp.threshold = "[" + this.temp.minthreshold + "," + this.temp.maxthreshold + "]"
          }
          addOrUpdateData(this.temp).then((response) => {
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              message: response.message,
              type: "success",
              duration: this.$store.state.settings.duration,
            });

            this.temp = {
              id: "",
              alarmName: "",
              gatewayGroup: "",
              gatewayName: "",
              deviceName: "",
              monitorName: "",
              operator: "",
              threshold: "",
              alarmLevel: "",
              alarmCfgStatus: "",
              updateTime: "",
              eventType: "",
              minthreshold: '',
              maxthreshold: '',
            }
          });
        }
      });
    },
    handleDelete(row) {
      this.$confirm(
        "删除告警配置将同时删除此配置生成的告警信息，请确认是否删除该配置?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        deleteDataAlarm(row.id).then((response) => {
          // console.log(response)
          if (response.success) {
            this.$notify({
              message: response.message,
              type: "success",
              duration: this.$store.state.settings.duration,
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
          }
        });
      });
    },
    handleCommand(command) {
      if (command === "showGroup") {
        this.showGroup();
      }
    }
  },
};
</script>
