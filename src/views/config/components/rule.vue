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
              <el-tooltip content="新增">
                <el-button
                  class="filter-item"
                  icon="el-icon-plus"
                  @click="openPartnerEditDialog('add', '')"
                >
                </el-button>
              </el-tooltip>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model.trim="listQuery.ruleName"
                :maxlength="20"
                placeholder="规则名称"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-tooltip content="重置">
                <el-button
                  icon="el-icon-refresh"
                  @click="resetQueryForm"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="搜索">
                <el-button icon="el-icon-search" @click="getList"></el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      stripe
      size="mini"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="规则名称" prop="ruleName" align="center" />
      <el-table-column
        label="触发规则类型"
        prop="triggerRuleType"
        align="center"
      >
      <template scope="scope">
        {{scope.row.triggerRuleType==="A"?"参数阈值":scope.row.triggerRuleType==="B"? "表达式区间判断":"SPC准则判断"}}
      </template>
    </el-table-column>
      <el-table-column
        label="应用设备"
        prop="conditionDeviceName"
        align="center"
      />
      <el-table-column label="检查字段" prop="fieldName" align="center" />
      <el-table-column
        label="动作类型"
        prop="actionType"
        align="center"
      >
      <template scope="scope">
        {{scope.row.actionType==="E"?"指令下发":scope.row.actionType==="F"? "状态变更":"消息通知"}}
      </template></el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-tooltip content="修改" placement="bottom">
            <el-button
              @click="openPartnerEditDialog('edit', scope.row)"
              size="small"
              icon="el-icon-edit"
              class="elbuttondefault"
              >修改</el-button
            >
          </el-tooltip>
          <el-tooltip
            content="删除"
            placement="bottom"
            style="margin-left: 1px"
          >
            <el-button
              @click="deletePartner(scope.row)"
              size="small"
              icon="el-icon-delete"
              class="elbuttondefault"
              >删除</el-button
            >
          </el-tooltip>
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
      :title="editDialogTitle"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      style="width: 150%; margin-left: -19%"
      @close="closeEditDialog"
    >
      <div style="margin-top: 0px">
        <el-form
          ref="resourceEditForm"
          :model="resourceEditForm"
          :rules="resourceEditRules"
          label-width="100px"
          size="mini"
          @submit.2.prevent
        >
          <fieldset
            style="
              padding: 10px;
              color: #00aa72;
              border-color: #ddd;
              border-width: 1px;
              -moz-border-radius: 5px;
              -webkit-border-radius: 5px;
              -khtml-border-radius: 5px;
              border-radius: 5px;
            "
          >
            <legend
              style="
                padding: 0 10px;
                font-size: 14px;
                line-height: inherit;
                white-space: normal;
              "
            >
              基础信息
            </legend>
            <el-row>
              <el-col :span="12">
                <el-form-item label="规则名称" prop="ruleName">
                  <el-col :span="22">
                    <el-input
                      v-model.trim="resourceEditForm.ruleName"
                      :maxlength="100"
                      :placeholder="placeholder"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="触发规则类型" prop="triggerRuleType">
                  <el-col :span="22">
                    <el-select
                      class="el-block"
                      v-model="resourceEditForm.triggerRuleType"
                      @change="triggerRuleTypedata"
                    >
                      <el-option
                        v-for="item in triggerRuleType"
                        :label="item.name"
                        :value="item.nid"
                        :key="item.nid"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
          <fieldset
            v-show="resourceEditForm.triggerRuleType === triggerRuleType[0].nid"
            style="
              padding: 10px;
              color: #00aa72;
              margin-top: 10px;
              border-color: #ddd;
              border-width: 1px;
              -moz-border-radius: 5px;
              -webkit-border-radius: 5px;
              -khtml-border-radius: 5px;
              border-radius: 5px;
            "
          >
            <legend
              style="
                padding: 0 10px;
                font-size: 14px;
                line-height: inherit;
                white-space: normal;
              "
            >
              应用信息
            </legend>
            <el-row>
              <el-col :span="12">
                <el-form-item label="应用设备" prop="ruleDeviceId">
                  <el-col :span="22">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.ruleDeviceId"
                      @change="deviceChange(resourceEditForm.ruleDeviceId)"
                    >
                      <el-option
                        v-for="item in deviceList"
                        :label="item.deviceName"
                        :value="item.nid"
                        :key="item.nid"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检查字段" prop="fieldName">
                  <el-col :span="22">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.fieldName"
                    >
                      <el-option
                        v-for="item in readFieldList"
                        :label="item.name"
                        :value="item.name"
                        :key="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="逻辑运算符" prop="ruleNames">
                  <el-col :span="22">
                    <el-select
                      v-model.trim="resourceEditForm.ruleNames"
                      placeholder="请选择"
                      style="width: 100%"
                      @change="handleChange(resourceEditForm.ruleNames)"
                    >
                      <el-option label=">" value=">"></el-option>
                      <el-option label=">=" value=">="></el-option>
                      <el-option label="<" value="<"></el-option>
                      <el-option label="<=" value="<="></el-option>
                      <el-option label="=" value="="></el-option>
                      <!-- <el-option label="range" value="range"></el-option>
                      <el-option label="enum" value="enum"></el-option> -->
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检查阈值" prop="ruleValue">
                  <el-col :span="22">
                    <el-input
                      v-model.trim="resourceEditForm.ruleValue"
                      :maxlength="20"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
          <fieldset
            v-show="resourceEditForm.triggerRuleType === triggerRuleType[1].nid"
            style="
              padding: 10px;
              color: #00aa72;
              margin-top: 10px;
              border-color: #ddd;
              border-width: 1px;
              -moz-border-radius: 5px;
              -webkit-border-radius: 5px;
              -khtml-border-radius: 5px;
              border-radius: 5px;
            "
          >
            <legend
              style="
                padding: 0 10px;
                font-size: 14px;
                line-height: inherit;
                white-space: normal;
              "
            >
              应用信息
            </legend>
            <el-row>
              <el-col :span="8">
                <el-form-item label="应用设备" prop="ruleDeviceId">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.ruleDeviceId"
                      @change="deviceChange(resourceEditForm.ruleDeviceId)"
                    >
                      <el-option
                        v-for="item in deviceList"
                        :label="item.deviceName"
                        :value="item.nid"
                        :key="item.nid"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="检查字段" prop="fieldName">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.fieldName"
                    >
                      <el-option
                        v-for="item in readFieldList"
                        :label="item.name"
                        :value="item.name"
                        :key="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="运算符" prop="operator">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.operator"
                    >
                      <el-option
                        v-for="item in operator"
                        :label="item"
                        :value="item"
                        :key="item"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="参数" prop="factor">
                  <el-col :span="25">
                    <el-input
                      v-model.trim="resourceEditForm.factor"
                      :maxlength="100"
                      :placeholder="placeholder"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="逻辑运算符" prop="logicalOperator">
                  <el-col :span="25">
                    <el-select
                      v-model.trim="resourceEditForm.logicalOperator"
                      placeholder="请选择"
                      style="width: 100%"
                    >
                      <el-option label="range" value="range"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="检查阈值" prop="threshold">
                  <el-col :span="25">
                    <el-input
                      v-model.trim="resourceEditForm.threshold"
                      :maxlength="20"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div style="color: gray">
                  说明：当逻辑运算符选择range，检查阈值填写格式为[a,b]
                </div>
                <!-- <el-form-item label="检查时间段" prop="ruleTime">
                  <el-col :span="23">
                    <el-time-picker is-range v-model.trim="resourceEditForm.ruleTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
                    </el-time-picker>
                  </el-col>
                </el-form-item> -->
              </el-col>
            </el-row>
          </fieldset>
          <fieldset
            v-show="resourceEditForm.triggerRuleType === triggerRuleType[2].nid"
            style="
              padding: 10px;
              color: #00aa72;
              margin-top: 10px;
              border-color: #ddd;
              border-width: 1px;
              -moz-border-radius: 5px;
              -webkit-border-radius: 5px;
              -khtml-border-radius: 5px;
              border-radius: 5px;
            "
          >
            <legend
              style="
                padding: 0 10px;
                font-size: 14px;
                line-height: inherit;
                white-space: normal;
              "
            >
              应用信息
            </legend>
            <el-row>
              <el-col :span="8">
                <el-form-item label="应用设备" prop="ruleDeviceId">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.ruleDeviceId"
                      @change="deviceChange(resourceEditForm.ruleDeviceId)"
                    >
                      <el-option
                        v-for="item in deviceList"
                        :label="item.deviceName"
                        :value="item.nid"
                        :key="item.nid"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="检查字段" prop="fieldName">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.fieldName"
                    >
                      <el-option
                        v-for="item in readFieldList"
                        :label="item.name"
                        :value="item.name"
                        :key="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="运算符" prop="operator">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.operator"
                    >
                      <el-option label="不属于" value="不属于"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="逻辑运算符" prop="logicalOperator">
                  <el-col :span="25">
                    <el-select
                      v-model.trim="resourceEditForm.logicalOperator"
                      placeholder="请选择"
                      style="width: 100%"
                    >
                      <el-option label="range" value="range"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="检查阈值" prop="threshold">
                  <el-col :span="25">
                    <el-input
                      v-model.trim="resourceEditForm.threshold"
                      :maxlength="20"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div style="color: gray">
                  说明：当逻辑运算符选择range，检查阈值填写格式为[a,b]
                </div>
                <!-- <el-form-item label="检查时间段" prop="ruleTime">
                  <el-col :span="23">
                    <el-time-picker is-range v-model.trim="resourceEditForm.ruleTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
                    </el-time-picker>
                  </el-col>
                </el-form-item> -->
              </el-col>
            </el-row>
          </fieldset>
          <fieldset
            style="
              padding: 10px;
              color: #00aa72;
              margin-top: 10px;
              border-color: #ddd;
              border-width: 1px;
              -moz-border-radius: 5px;
              -webkit-border-radius: 5px;
              -khtml-border-radius: 5px;
              border-radius: 5px;
            "
          >
            <legend
              style="
                padding: 0 10px;
                font-size: 14px;
                line-height: inherit;
                white-space: normal;
              "
            >
              响应信息
            </legend>
            <el-row>
              <el-col :span="8">
                <el-form-item label="动作类型" prop="actionType">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model="resourceEditForm.actionType"
                      @change="resourceEditFormdata"
                    >
                      <el-option
                        v-for="item in actionType"
                        :label="item.name"
                        :value="item.niddata"
                        :key="item.niddata"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col
                :span="8"
                v-show="
                  !resourceEditForm.actionType === actionType[2].niddata ||
                  resourceEditForm.actionType === actionType[1].niddata ||
                  resourceEditForm.actionType === actionType[0].niddata
                "
              >
                <el-form-item label="响应网关" prop="actionEdgeId">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.actionEdgeId"
                      @change="edgeChange(resourceEditForm.actionEdgeId)"
                    >
                      <el-option
                        v-for="(item, index) in edgeList"
                        :label="item.edgeDeviceName"
                        :value="item.edgeDeviceId"
                        :key="index"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col
                :span="8"
                v-show="
                  !resourceEditForm.actionType === actionType[2].niddata ||
                  resourceEditForm.actionType === actionType[1].niddata ||
                  resourceEditForm.actionType === actionType[0].niddata
                "
              >
                <el-form-item label="响应设备" prop="actionDeviceId">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.actionDeviceId"
                      @change="
                        actionDeviceChange(resourceEditForm.actionDeviceId)
                      "
                    >
                      <el-option
                        v-for="item in actionList"
                        :label="item.deviceName"
                        :value="item.nid"
                        :key="item.nid"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col
                :span="8"
                v-show="
                  resourceEditForm.actionType === actionType[2].niddata ||
                  !resourceEditForm.actionType === actionType[1].niddata ||
                  !resourceEditForm.actionType === actionType[0].niddata
                "
              >
                <el-form-item label="告警级别" prop="alarmLevel">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.alarmLevel" >
                    <el-option
                        v-for="item in alarmLevel"
                        :key="item.value"
                        :label="item.label"
                       :value="item.label"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col
                :span="8"
                v-show="
                  resourceEditForm.actionType === actionType[2].niddata ||
                  !resourceEditForm.actionType === actionType[1].niddata ||
                  !resourceEditForm.actionType === actionType[0].niddata
                "
              >
                <el-form-item label="事件类型" prop="eventType">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.eventType" >
                    <el-option
                        v-for="item in eventType"
                        :key="item.value"
                        :label="item.label"
                       :value="item.label"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-show="
                resourceEditForm.actionType === actionType[1].niddata ||
                !resourceEditForm.actionType === actionType[0].niddata ||
                !resourceEditForm.actionType === actionType[2].niddata
              "
            >
              <el-col :span="8">
                <el-form-item label="运算符" prop="actionOperator">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.actionOperator"
                    >
                      <el-option label="=" value="="></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="参数" prop="actionValue">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.actionValue"
                    >
                      <!-- <el-option v-for="item in actionValue" :label="item.name" :value="item.index" :key="item.index"> -->
                      <el-option label="在线" value="1"></el-option>
                      <el-option label="离线" value="0"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col
                :span="8"
                v-show="
                  resourceEditForm.actionType === actionType[2].niddata ||
                  !resourceEditForm.actionType === actionType[1].niddata ||
                  !resourceEditForm.actionType === actionType[0].niddata
                "
              >
                <el-form-item label="响应设备" prop="actionDeviceId">
                  <el-col :span="25">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.actionDeviceId"
                      @change="
                        actionDeviceChange(resourceEditForm.actionDeviceId)
                      "
                    >
                      <el-option
                        v-for="item in actionList"
                        :label="item.deviceName"
                        :value="item.nid"
                        :key="item.nid"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-show="
                !resourceEditForm.actionType === actionType[1].niddata ||
                resourceEditForm.actionType === actionType[0].niddata
              "
            >
              <el-col :span="12">
                <el-form-item label="发送数据字段" prop="actionParameter">
                  <el-col :span="22">
                    <el-select
                      class="el-block"
                      v-model.trim="resourceEditForm.actionParameter"
                    >
                      <el-option
                        v-for="item in writeFieldList"
                        :label="item.name"
                        :value="item.name"
                        :key="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="发送数据值" prop="sendValue">
                  <el-col :span="22">
                    <el-input
                      v-model.trim="resourceEditForm.sendValue"
                      :maxlength="20"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
        </el-form>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeEditDialog(resourceEditForm)"
          >取 消</el-button
        >
        <el-button
          type="primary"
          icon="fa-save"
          @click="saveResource"
          :loading="submiting"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import {
  getList,
  saveResource,
  updateResource,
  deletePartner,
  queryDeviceList,
  queryCommandFieldList,
  tenantEdgeDevice,
  findNeDeviceByAgwId,
  queryReadFieldList,
  queryWriteFieldList,
} from "@/api/rule";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "Rule",
  components: { Pagination },
  data() {
    return {
      alarmLevel:[{
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
  }],
  eventType:[{
    value: 1,
    label: "故障通知",
  },
  {
    value: 2,
    label: "预警通知",
  },{
      value:3,
      label:"普通通知"
  }
],
      operator: ["+", "-", "*", "/"],
      actionType: [
        {niddata:"E", name: "指令下发" },
        {niddata:"F", name: "状态变更" },
        {niddata:"G", name: "消息通知" },
      ],
      triggerRuleType: [
        { nid: "A", name: "参数阀值" },
        { nid: "B", name: "表达式区间判断" },
        { nid: "C", name: "SPC准则判异" },
      ],
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        ruleName: "",
        agwId: "",
        currentPage: 1,
        pageSize: 10,
        orderby: "createTime",
        order: "desc",
      },
      length: 0,
      disabled: true,
      abled: true,
      editDialogVisible: false,
      resourceEditForm: {
        alarmLevel:"",
        eventType:"",
        actionOperator: "",
        templateId: "",
        sendValue: "",
        threshold: "",
        factor: "",
        operator: "",
        logicalOperator: "",
        actionType: "",
        triggerRuleType: "",
        id: "",
        ruleName: "",
        ruleDeviceId: "",
        fieldName: "",
        ruleNames: "",
        ruleValue: "",
        ruleTime: null,
        startTime: "",
        endTime: "",
        actionDeviceId: "",
        actionEdgeId: "",
        actionCommandName: "",
        actionParameter: "",
        actionValue: "",
        agwId: "",
      },
      resourceEditRules: {
        triggerRuleType: [
          {
            required: true,
            message: "请输入选择触发规则类型!",
            trigger: "change",
          },
          {
            validator: (rule, value, callback) => {
              const ruleName = this.resourceEditForm.triggerRuleType;
              if (ruleName === "A") {
                  this.resourceEditRules.operator[0].required = false,
                  this.resourceEditRules.factor[0].required = false,
                  this.resourceEditRules.logicalOperator[0].required = false,
                  this.resourceEditRules.threshold[0].required = false,
                  this.resourceEditRules.ruleDeviceId[0].required = true,
                  this.resourceEditRules.fieldName[0].required = true,
                  this.resourceEditRules.ruleNames[0].required = true,
                  this.resourceEditRules.ruleValue[0].required = true
              } else if (ruleName === "B") {
                this.resourceEditRules.ruleValue[0].required = false,
                  this.resourceEditRules.ruleNames[0].required = false,
                this.resourceEditRules.ruleDeviceId[0].required = true,
                  this.resourceEditRules.fieldName[0].required = true,
                  this.resourceEditRules.operator[0].required = true,
                  this.resourceEditRules.factor[0].required = true,
                  this.resourceEditRules.logicalOperator[0].required = true,
                  this.resourceEditRules.threshold[0].required = true
              } else if (ruleName === "C"){
                // this.resourceEditRules.operator[0].required = false;
                  this.resourceEditRules.ruleNames[0].required = false,
                  this.resourceEditRules.ruleValue[0].required = false,
                  this.resourceEditRules.factor[0].required = false,
                  this.resourceEditRules.ruleDeviceId[0].required = true,
                  this.resourceEditRules.fieldName[0].required = true,
                  this.resourceEditRules.operator[0].required = true,
                  this.resourceEditRules.logicalOperator[0].required = true,
                  this.resourceEditRules.threshold[0].required = true
              }
                callback();
            },
            trigger: "blur",
          },
        ],
        actionOperator: [{
          required: true,
          message: "请选择运算符!",
          trigger: "change",
        }],
        actionValue:[{
          required: true,
          message: "请选择参数!",
          trigger: "change",
        }],
        sendValue: [
          {
            required: true,
            message: "请输入数据值!",
            trigger: "blur",
          },
        ],
        alarmLevel: [
          {
            required: true,
            message: "请选择告警级别!",
            trigger: "change",
          },
        ],
        eventType: [
        {
          required: true,
          message: "请选择事件类型!",
          trigger: "change",
        }
        ],
        actionOperator: [
        {
          required: true,
          message: "请选择运算符!",
          trigger: "change",
        }
        ],
        actionType: [
          {
            required: true,
            message: "请选择动作类型!",
            trigger: "change",
          },
          {
            validator: (rule, value, callback) => {
            const ruleName= this.resourceEditForm.actionType;
            if (ruleName==="E"){
               this.resourceEditRules.actionOperator[0].required = false,
               this.resourceEditRules.actionValue[0].required = false
               this.resourceEditRules.actionParameter[0].required = true
               this.resourceEditRules.sendValue[0].required = true
               this.resourceEditRules.actionEdgeId[0].required = true
               this.resourceEditRules.actionDeviceId[0].required = true
               this.resourceEditRules.alarmLevel[0].required = false
               this.resourceEditRules.eventType[0].required = false
              }else if (ruleName==="F") {
            this.resourceEditRules.actionParameter[0].required = false,
            this.resourceEditRules.sendValue[0].required = false
            this.resourceEditRules.actionOperator[0].required = true
            this.resourceEditRules.actionValue[0].required = true
            this.resourceEditRules.actionEdgeId[0].required = true
            this.resourceEditRules.actionDeviceId[0].required = true
            this.resourceEditRules.alarmLevel[0].required = false
            this.resourceEditRules.eventType[0].required = false
              }else if (ruleName==="G"){
            this.resourceEditRules.actionEdgeId[0].required = false,
            this.resourceEditRules.actionDeviceId[0].required = false,
            this.resourceEditRules.actionOperator[0].required = false,
            this.resourceEditRules.actionValue[0].required = false,
            this.resourceEditRules.actionParameter[0].required = false,
            this.resourceEditRules.sendValue[0].required = false
            this.resourceEditRules.alarmLevel[0].required = true
            this.resourceEditRules.eventType[0].required = true
              }
                callback();
            },
            trigger: "blur",
          },
        ],
        threshold: [
          {
            required: true,
            message: "请输入检查阈值!",
            trigger: "blur",
          },
          {
            validator: (rule,value,callback) => {
              const ruleName=this.resourceEditForm.logicalOperator;
              const ruleValue=this.resourceEditForm.threshold;
              if (ruleName==="range") {
                if (
                  !/^[\(,\[ ](-?\d+)(\.\d+)?\,{1}(-?\d+)(\.\d+)?(([\),\] ]$))/.test(
                    ruleValue
                  )
                ) {
                  callback("规则值区间格式有误!");
                }
                 else {
                  var value0 = ruleValue.replace(/\s+/g, "");
                  if (value0[1] === "," && value0[0] === "[") {
                    callback("规则值区间格式有误!");
                  } else {
                    if (
                      value0[value0.length - 2] === "," &&
                      value0[value0.length - 1] === "]"
                    ) {
                      callback("规则值区间格式有误!");
                    } else {
                      if (
                        value0[1] === "," &&
                        value0[value0.length - 2] === ","
                      ) {
                        callback("规则值区间格式有误!");
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
                          callback("规则值区间格式有误!");
                        } else {
                          second = s[0];
                          if (
                            (first !== null || second !== null) &&
                            parseFloat(first) <= 0 &&
                            parseFloat(second) <= 0 &&
                            parseFloat(first) >= parseFloat(second)
                          ) {
                            callback("规则值区间格式有误!");
                          } else {
                            if (
                              (first !== null || second !== null) &&
                              parseFloat(first) >= 0 &&
                              parseFloat(second) <= 0
                            ) {
                              callback("规则值区间格式有误!");
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


              callback();
            },
            trigger: "blur",
          },
        ],
        factor: [
          {
            required: true,
            message: "请输入参数!",
            trigger: "blur",
          },
        ],
        operator: [
          {
            required: true,
            message: "请选择运算符!",
            trigger: "change",
          },
        ],
        logicalOperator: [
          {
            required: true,
            message: "请选择逻辑运算符!",
            trigger: "change",
          },
        ],
        ruleName: [
          {
            required: true,
            message: "请输入规则名称!",
          },
        ],

        ruleDeviceId: [
          {
            required: true,
            message: "请选择规则应用设备!",
            trigger: "change",
          },
        ],
        fieldName: [
          {
            required: true,
            message: "请选择检查字段!",
            trigger: "change",
          },
        ],
        ruleNames: [
          {
            required: true,
            message: "请选择运算符!",
            trigger: "change",
          },
        ],
        ruleValue: [
          {
            required: true,
            message: "请输入检查阈值!",
            trigger: "blur",
          },
    
        ],
        actionDeviceId: [
          {
            required: true,
            message: "请选择规则响应设备!",
            trigger: "change",
          },
        ],
        actionEdgeId: [
          {
            required: true,
            message: "请选择规则响应网关!",
            trigger: "change",
          },
        ],
        actionCommandName: [
          {
            required: true,
            message: "请选择规则执行命令!",
            trigger: "change",
          },
        ],
        actionParameter: [
          {
            required: true,
            message: "请选择发送数据字段!",
            trigger: "change",
          },
        ],
        actionValue: [
          {
            required: true,
            message: "请输入发送数据值!",
            trigger: "blur",
          },
        ],
      },
      currentActionType: "add",
      editDialogTitle: "",
      value: {},
      idList: [],
      deviceId: {
        nid: "",
      },
      placeholder: "",
      deviceList: [],
      edgeDeviceId: "",
      agwIds: {
        agwId: "",
      },
      ruleDeviceIds: {
        ruleDeviceId: "",
      },
      actionList: [],
      readFieldList: [],
      writeFieldList: [],
      edgeList: [],
      edgeIds: {
        agwId: "",
      },
      actionDeviceIds: {
        actionDeviceId: "",
      },
      commandList: {},
      actionCommandNames: {
        actionCommandName: "",
        actionDeviceId: "",
      },
    };
  },
  computed: {
    ...mapGetters(["operationPermission"]),
  },
  watch: {
    "resourceEditForm.ruleTime"(val) {
      if (val) {
        this.resourceEditForm.startTime = moment(val[0]).format("HH:mm:ss");
        this.resourceEditForm.endTime = moment(val[1]).format("HH:mm:ss");
      } else {
        this.resourceEditForm.startTime = "";
        this.resourceEditForm.endTime = "";
      }
    },
    editDialogVisible(val) {
      if (!val && this.$refs["resourceEditForm"]) {
        this.$refs["resourceEditForm"].resetFields();
      }
    },
  },
  created() {
    this.initParams();
    this.getList();
    this.queryDeviceList();
    this.tenantEdgeDevice();
  },
  methods: {
    initParams() {
      if (this.$route.query.edgeDeviceId !== undefined) {
        this.edgeDeviceId = this.$route.query.edgeDeviceId;
      }
    },
    getList() {
      this.listLoading = true;
      this.listQuery.agwId = this.edgeDeviceId;
      getList(this.listQuery).then((response) => {
        if (response.success) {
          this.list = response.data;
          // console.log(this.list,"获取表单数据")
          this.total = response.totalRowCount;
          // console.log(this.total,"this.total")
        } else {
          this.list = [];
          this.total = [];
        }
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.getList();
    },
    handleClick(tab, event) {
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.length = this.multipleSelection.length;
      this.idList = [];
      if (this.length === 1) {
        this.disabled = false;
        this.abled = false;
        this.value = this.multipleSelection[0];
        this.idList.push(this.value.nid);
        this.deviceId.nid = this.idList.toString();
      }
      if (this.length > 1) {
        this.abled = false;
        this.disabled = true;
        for (var i = 0; i < this.length; i++) {
          this.idList.push(this.multipleSelection[i].nid);
        }
        this.deviceId.nid = this.idList.toString();
      }
      if (this.length === 0) {
        this.abled = true;
        this.disabled = true;
      }
    },
    resetQueryForm() {
      this.listQuery = {
        ruleName: "",
        agwId: "",
        currentPage: 1,
        pageSize: 10,
        orderby: "createTime",
        order: "desc",
      };
    },
    closeEditDialog(resourceEditForm) {
      this.$nextTick(() => {
        // this.resourceEditForm = {
        //   id: '',
        //   ruleName: '',
        //   ruleDeviceId: '',
        //   fieldName: '',
        //   ruleNames: '',
        //   ruleValue: '',
        //   ruleTime: null,
        //   startTime: '',
        //   endTime: '',
        //   actionDeviceId: '',
        //   actionEdgeId: '',
        //   actionCommandName: '',
        //   actionParameter: '',
        //   actionValue: '',
        //   agwId: ''
        // }
        this.resourceEditForm.ruleNames = "";
        this.$refs["resourceEditForm"].resetFields();
        this.editDialogVisible = false;
      });
    },
    // 点击新增的按钮
    openPartnerEditDialog(actionType, row) {
      // 默认第一个
      this.resourceEditForm.agwId = this.edgeDeviceId;
      this.currentActionType = actionType;
      if (this.currentActionType === "add") {
        this.editDialogTitle = "新增规则";
        this.editDialogVisible = true;
        this.resourceEditForm.triggerRuleType = this.triggerRuleType[0].nid;
        this.resourceEditFormdata(),
        this.triggerRuleTypedata()
      } else if (this.currentActionType === "edit") {
        this.editDialogTitle = "修改规则";
        this.$nextTick(() => {
          this.resourceEditForm.alarmLevel=row.alarmLevel,
          this.resourceEditForm.eventType=row.eventType,
          this.resourceEditForm.nid=row.nid,
          this.resourceEditForm.threshold=row.threshold,
          this.resourceEditForm.logicalOperator=row.logicalOperator,
          this.resourceEditForm.factor =row.factor,
          this.resourceEditForm.operator =row.operator,
          this.resourceEditForm.actionOperator =row.actionOperator,
          this.resourceEditForm.templateId =row.templateId,
          this.resourceEditForm.sendValue=row.sendValue;
          this.resourceEditForm.triggerRuleType = row.triggerRuleType;
          this.resourceEditForm.actionType=row.actionType
          this.resourceEditForm.ruleName = row.ruleName;
          this.resourceEditForm.ruleDeviceId = row.ruleDeviceId;
          this.deviceChange(this.resourceEditForm.ruleDeviceId);
          this.queryReadFieldList(this.resourceEditForm.ruleDeviceId);
          this.resourceEditForm.fieldName = row.fieldName;
          this.resourceEditForm.ruleNames = row.ruleNames;
          this.resourceEditForm.ruleValue = row.ruleValue;
          this.resourceEditForm.actionEdgeId = row.actionEdgeId;
          this.edgeChange(this.resourceEditForm.actionEdgeId);
          this.resourceEditForm.actionDeviceId = row.actionDeviceId;
          this.actionDeviceChange(this.resourceEditForm.actionDeviceId);
          this.resourceEditForm.actionCommandName = row.actionCommandName;
          this.resourceEditForm.actionParameter = row.actionParameter;
          this.resourceEditForm.actionValue = row.actionValue;
          this.resourceEditForm.agwId = row.agwId;
          this.resourceEditForm.ruleTime = row.ruleTime
          this.$nextTick(() => {
            this.editDialogVisible = true;

          });

        });
      }
    },
    resourceEditFormdata(actionType) {
      // console.log(actionType,"actionType")
        this.resourceEditForm.actionEdgeId = "",
          this.resourceEditForm.actionDeviceId = "",
          this.resourceEditForm.templateId = "",
          this.resourceEditForm.actionOperator = "",
          this.resourceEditForm.actionValue = "",
          this.resourceEditForm.actionParameter = "",
          this.resourceEditForm.sendValue = ""
    },
    // 选择下拉第几个
    triggerRuleTypedata(triggerRuleType){
        this.resourceEditForm.ruleDeviceId = "",
          this.resourceEditForm.fieldName = "",
          this.resourceEditForm.ruleNames = "",
          this.resourceEditForm.ruleValue = "",
          this.resourceEditForm.operator = "",
          this.resourceEditForm.factor = "",
          this.resourceEditForm.logicalOperator = "",
          this.resourceEditForm.threshold = ""
      // if(this.resourceEditForm.triggerRuleType== "A"){
      //   this.resourceEditRules.operator=[],
      //   this.resourceEditRules.factor=[],
      //   this.resourceEditRules.logicalOperator= [],
      //   this.resourceEditRules.threshold=[]
      //   this.resourceEditRules.ruleDeviceId
      // }else if(this.resourceEditForm.triggerRuleType== "B"){
      //   //只校验邮箱，不校验手机
      //   this.resourceEditRules.operator= [],
      //   this.resourceEditRules.ruleNames= []
      // }else{
      //   this.resourceEditRules.ruleNames=[],
      //   this.resourceEditRules.ruleValue=[],
      //   this.resourceEditRules.factor=[]
      // }
      // this.$refs.resourceEditForm.triggerRuleTypedata();

    },
    saveResource() {
      this.$refs["resourceEditForm"].validate((valid) => {
        if (valid) {
          if (this.currentActionType === "add") {
            saveResource(this.resourceEditForm)
              .then((response) => {
                if (response.success) {
                  this.$notify({
                    message: "保存成功",
                    type: "success",
                    duration: this.$store.state.settings.duration,
                  });
                  this.closeEditDialog();
                  this.getList();
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: "请求出错！",
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            updateResource(this.resourceEditForm)
              .then((response) => {
                if (response.success) {
                  this.$notify({
                    message: "保存成功",
                    type: "success",
                    duration: this.$store.state.settings.duration,
                  });
                  this.closeEditDialog();
                  this.getList();
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: "请求出错！",
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } else {
          return false;
        }
      });
    },
    deletePartner(row) {
      this.$confirm(" 请确认是否删除该记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deviceId.nid = row.nid;
          deletePartner(this.deviceId)
            .then((response) => {
              if (response.success) {
                this.$notify({
                  message: "删除成功!",
                  type: "success",
                  duration: this.$store.state.settings.duration,
                });
                this.getList();
              } else {
                this.$notify.error({
                  title: "错误",
                  message: "请求出错！",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    queryDeviceList() {
      this.agwIds.agwId = this.edgeDeviceId;
      queryDeviceList(this.agwIds)
        .then((response) => {
          if (response.success) {
            this.deviceList = response.data;
          } else {
            this.deviceList = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deviceChange(ruleDeviceId) {
      this.resourceEditForm.fieldName = "";
      this.queryReadFieldList(ruleDeviceId);
    },
    queryReadFieldList(ruleDeviceId) {
      this.ruleDeviceIds.ruleDeviceId = ruleDeviceId;
      queryReadFieldList(this.ruleDeviceIds)
        .then((response) => {
          if (response.success) {
            this.readFieldList = response.data;
          } else {
            this.readFieldList = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    queryWriteFieldList(actionCommandName) {
      this.actionCommandNames.actionCommandName = actionCommandName;
      this.actionCommandNames.actionDeviceId =
        this.actionDeviceIds.actionDeviceId;
      queryWriteFieldList(this.actionCommandNames)
        .then((response) => {
          if (response.success) {
            this.writeFieldList = response.data;
          } else {
            this.writeFieldList = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    tenantEdgeDevice() {
      tenantEdgeDevice()
        .then((response) => {
          if (response.success) {
            this.edgeList = response.data;
          } else {
            this.edgeList = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    edgeChange(agwId) {
      // console.log(agwId, "agwId");
      this.edgeIds.agwId = agwId;
      this.resourceEditForm.actionDeviceId = "";
      this.resourceEditForm.actionCommandName = "";
      this.resourceEditForm.actionParameter = "";
      findNeDeviceByAgwId(this.edgeIds)
        .then((response) => {
          if (response.success) {
            this.actionList = response.data;
          } else {
            this.actionList = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    actionDeviceChange(actionDeviceId) {
      this.actionDeviceIds.actionDeviceId = actionDeviceId;
      this.resourceEditForm.actionCommandName = "";
      this.resourceEditForm.actionParameter = "";
       if(!actionDeviceId) return
      queryCommandFieldList(this.actionDeviceIds)
        .then((response) => {
          // console.log(response,"sdfdsf")
          if (response.success) {
            this.commandList = response.data;
            if (this.commandList.length !== 0) {
              this.resourceEditForm.actionCommandName =
                this.commandList[0].name;
              this.queryWriteFieldList(this.resourceEditForm.actionCommandName);
            }
          } else {
            this.commandList = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleChange(value) {
      this.resourceEditForm.ruleValue = "";
    },
  },
};
</script>
<style  lang="scss" scoped>
/deep/.el-form-item--mini .el-form-item__error {
  padding-top: 1px;
  width: 120% !important;
}
</style>
<style>
.el-divider__text {
  position: absolute;
  background-color: #fff;
  padding: 0 20px;
  color: #30313347;
}
.el-divider--horizontal {
  display: block;
  height: 2px;
  width: 100%;
  margin: 24px 0;
}
</style>

<style lang="scss" >
@import "~@/styles/variables.scss";
.el-loading-spinner.el-loading-text  {
  color: $el-loading-spinner;
  margin: 3px 0;
  font-size: 14px;
}
.el-loading-spinner i  {
  color: $el-loading-spinner;
}
</style>

