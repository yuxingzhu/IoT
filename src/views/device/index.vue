<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery">
        <el-row :gutter="24">
          <el-col :span="3">
            <el-form-item prop="deviceName">
              <el-input v-model.trim="listQuery.deviceName" :maxlength="20" placeholder="设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item class="el-align-center">
              <el-button icon="el-icon-refresh" @click="resetQueryForm">重 置</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button type="primary" icon="el-icon-search" @click="getList()">查 询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="13" style="padding-left: 28%;">
            <el-dropdown @command="handlePartnerOpen(arguments[0])">
              <el-button icon="el-icon-plus" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="add" @click="openPartnerEditDialog('add')">新增</el-dropdown-item>
                <el-dropdown-item command="addMode">新增(从模板)</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-tooltip class="item" effect="dark" content="修改" :disabled="disabled">
              <el-button icon="el-icon-edit" :disabled="disabled" @click="openPartnerEditDialog('edit')" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" :disabled="abled">
              <el-button icon="el-icon-delete" :disabled="abled" @click="deletePartner()" />
            </el-tooltip>
            <el-dropdown @command="handlePartnerCmd(arguments[0])">
              <el-button icon="el-icon-more" :disabled="disabled" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="audit">配置协议</el-dropdown-item>
                <el-dropdown-item command="task">采集任务</el-dropdown-item>
                <el-dropdown-item command="copy">复制</el-dropdown-item>
                <el-dropdown-item command="copyMode">设为模板</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" border style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="80" align="center" />
      <el-table-column label="设备名称" prop="deviceName" align="center" />
      <el-table-column label="设备配置" prop="profileName" align="center">
        <template scope="scope">
          <span class="shou" @click="findProfile(scope.row.profileNid)">{{ scope.row.profileName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="连接协议" prop="connectProtocol" align="center" />
      <el-table-column label="管理状态" prop="showAdminState" align="center">
        <template slot-scope="scope">
          <el-switch :value="scope.row.showAdminState" active-color="#13ce66" inactive-color="#ff4949" active-text="启用" inactive-text="禁用" :active-value="1" :inactive-value="0" @change="changeAdminStatus($event, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :visible.sync="editDialogVisible" class="el-dialog-form el-dialog-center" width="30%" @close="closeEditDialog">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-fa-th-large" />
        {{ editDialogTitle }}
      </span>
      <div>
        <el-form ref="feDeviceAddressEditForm" :model="feDeviceAddressEditForm" :rules="feDeviceAddressEditRules" label-width="120px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="设备名称" prop="deviceName">
                <el-col :span="22">
                  <el-input v-model.trim="feDeviceAddressEditForm.deviceName" :maxlength="200" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="连接协议" prop="connectProtocol">
                <el-col :span="22">
                  <el-select v-model.trim="feDeviceAddressEditForm.connectProtocol" style="width:100%">
                    <el-option label="MODBUS_TCP" value="MODBUS_TCP" />
                    <el-option label="MODBUS_RTU" value="MODBUS_RTU" />
                    <el-option label="OPCUA" value="OPCUA" />
                    <el-option label="HTTP" value="HTTP" />
                    <el-option label="MTCONNECT" value="MTCONNECT" />
                    <el-option label="MITSUBISH_MC" value="MITSUBISH_MC" />
                    <el-option label="SIEMENS_S7" value="SIEMENS_S7" />
                    <el-option label="OMRON_FINS" value="OMRON_FINS" />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="设备配置" prop="profileNid">
                <el-col :span="22">
                  <el-select v-model.trim="feDeviceAddressEditForm.profileNid" style="width:100%;" @change="findFile(feDeviceAddressEditForm.profileNid)">
                    <el-option v-for="item in feProfileList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="margin-left:-16px">
              <el-col :span="24" style="width:100%;">
                <div style="width:100%;margin-left:0px;" @click="find()">
                  <p style="font-size:14px;margin-left:14px;margin-top:6px;cursor:pointer;">查看</p>
                </div>
              </el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="管理状态" prop="adminState">
                <el-col :span="22">
                  <el-select v-model.trim="feDeviceAddressEditForm.adminState" style="width:100%">
                    <el-option label="启用" value="UNLOCKED" />
                    <el-option label="停用" value="LOCKED" />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" icon="fa-save" :loading="submiting" @click="saveFeDeviceAddress">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog class="header1 l-dialog__wrapper1 !important" :visible.sync="viewVisible" :modal="true" width="30%" @close="closeDialog">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-fa-th-large" />查看设备配置
      </span>
      <div>
        <json-viewer :value="jsonData" :expand-depth="5" boxed sort />
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog class="el-dialog-form el-dialog-center" :visible.sync="OpenCopyDialogVisible" :modal="true" width="30%" @close="closeCopyDialog">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-fa-th-large" />复制设备
      </span>
      <div>
        <el-form ref="copyDeviceEditForm" :model="copyDeviceEditForm" :rules="copyDeviceEditFormRule" label-width="106px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="新设备名称" prop="deviceName">
                <el-col :span="21" style="margin-left: 0px;">
                  <el-input v-model.trim="copyDeviceEditForm.deviceName" :maxlength="10000" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeCopyDialog">取 消</el-button>
        <el-button type="primary" icon="fa-save" :loading="submiting" @click="saveCopyDevice">
          确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editDialogMode" class="el-dialog-form el-dialog-center" :modal="true" width="30%" @close="closeEditDialogmode">
      <span slot="title" class="el-dialog__title"><i class="el-icon-fa-th-large" />设为模板</span>
      <div>
        <el-form ref="feEdgeDeviceEditMode" :model="feEdgeDeviceEditMode" :rules="feDeviceAddressEditRulesMode" label-width="106px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="模板名称" prop="modeName">
                <el-col :span="21" style="margin-left: 0px;">
                  <el-input v-model.trim="feEdgeDeviceEditMode.modeName" :maxlength="10000" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeEditDialogmode">取 消</el-button>
        <el-button type="primary" icon="fa-save" :loading="submiting" @click="saveFeDeviceMode">确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editDialogDevice" class="el-dialog-form el-dialog-center" :modal="true" width="30%" @close="closeDevice">
      <span slot="title" class="el-dialog__title"><i class="el-icon-fa-th-large" />新增设备(从模板)</span>
      <div>
        <el-form ref="feDeviceAddress" :model="feDeviceAddress" :rules="feDeviceAddresRules" label-width="106px">
          <el-row>
            <el-col :span="20">
              <el-form-item label="设备型号" prop="id">
                <el-col :span="21" style="margin-left: 0px;">
                  <el-select v-model.trim="feDeviceAddress.id" style="width:100%;">
                    <el-option v-for="item in ModeList" :key="item.id" :label="item.modeName" :value="item.id" />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="设备名称" prop="deviceName">
                <el-col :span="21" style="margin-left: 0px;">
                  <el-input v-model.trim="feDeviceAddress.deviceName" :maxlength="200" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="closeDevice">取 消</el-button>
        <el-button type="primary" icon="fa-save" :loading="submiting" @click="copyModesave">确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="taskDialogVisible" class="el-dialog-form el-dialog-center" width="40%" @close="taskCloseDialogVisible">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-fa-th-large" />
        采集任务
      </span>
      <div>
        <el-form ref="feScheduleStrategyEditForm" :model="feScheduleStrategyEditForm" :rules="feScheduleStrategyEditRules" label-width="160px">
          <el-row>
            <el-col :span="24" style="margin-left:-50px;">
              <el-form-item label="操作路径" prop="pathTask">
                <el-col :span="23">
                  <template>
                    <el-radio-group v-model.trim="feScheduleStrategyEditForm.pathTask">
                      <el-radio v-for="item in pathList" :key="item.path" style="margin-left:0px !important ;display: block !important ;margin-top:0px;" :label="item.name" :value="item.path" />
                    </el-radio-group>
                  </template>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top:7px;">
            <el-col :span="24" style="margin-left:-50px;">
              <el-form-item label="开始时间" prop="startTime">
                <el-col :span="23">
                  <el-date-picker v-model.trim="feScheduleStrategyEditForm.startTime" :picker-options="pickerOptions0" :editable="false" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top:7px;">
            <el-col :span="24" style="margin-left:-50px;">
              <el-form-item label="结束时间" prop="endTime">
                <el-col :span="23">
                  <el-date-picker v-model.trim="feScheduleStrategyEditForm.endTime" :picker-options="pickerOptions0" :editable="false" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top:7px;">
            <el-col :span="24" style="margin-left:-50px;">
              <el-form-item label="执行频率" prop="frequency">
                <input v-model.trim="feScheduleStrategyEditForm.frequency" type="hidden">
                <el-col :span="4">
                  <el-input v-model.trim="feScheduleStrategyEditForm.frequencyDay" :maxlength="20" />
                </el-col>
                <el-col :span="2" style="padding-top:2.5%;margin-left:1%;margin-right:0%">
                  <span>日</span>
                </el-col>

                <el-col :span="4" style="margin-left:-10px">
                  <el-input v-model.trim="feScheduleStrategyEditForm.frequencyHour" :maxlength="20" />
                </el-col>
                <el-col :span="2" style="padding-top:2.5%;margin-left:1%;margin-right:0%">
                  <span>时</span>
                </el-col>

                <el-col :span="4" style="margin-left:-10px">
                  <el-input v-model.trim="feScheduleStrategyEditForm.frequencyMinute" :maxlength="20" />
                </el-col>
                <el-col :span="2" style="padding-top:2.5%;margin-left:1%;margin-right:0%">
                  <span>分</span>
                </el-col>

                <el-col :span="4" style="margin-left:-10px">
                  <el-input v-model.trim="feScheduleStrategyEditForm.frequencySecond" :maxlength="20" />
                </el-col>
                <el-col :span="2" style="padding-top:2.5%;margin-left:1%;margin-right:0%">
                  <span>秒</span>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24" style="margin-left:-50px;">
              <el-form-item label="任务状态" prop="runOnce">
                <el-col :span="23" style="margin-top:6px;">
                  <el-switch v-model.trim="feScheduleStrategyEditForm.runOnce" :disabled="staus" active-color="#13ce66" inactive-color="#ff4949" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="taskCloseDialogVisible">取 消</el-button>
        <el-button type="primary" icon="fa-save" :loading="submiting" @click="savefeScheduleStrategy()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="configDialogVisible" class="el-dialog-form el-dialog-center" width="63%" @close="configCloseEditDialog">
      <span slot="title" class="el-dialog__title">
        <i class="el-icon-fa-th-large" />
        配置协议
      </span>
      <div style="margin-top: -33px">
        <el-form ref="connectionForm" :model="connectionForm" :rules="connectionFormRules" label-width="110px">
          <el-divider content-position="left">连接配置</el-divider>
          <el-row>
            <el-col :span="8">
              <el-form-item label="连接名称" prop="configName">
                <el-col :span="22">
                  <el-input v-model.trim="connectionForm.configName" :maxlength="200" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地址" prop="protocol">
                <el-col :span="22">
                  <el-input v-model.trim="connectionForm.protocol" :maxlength="200" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="从站地址" prop="endpoint">
                <el-col :span="22">
                  <el-input v-model.trim="connectionForm.endpoint" :maxlength="200" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="地址位" prop="slaveId">
                <el-col :span="22">
                  <el-input v-model.trim="connectionForm.slaveId" :maxlength="200" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="读取位数" prop="dataBits">
                <el-col :span="22">
                  <el-input v-model.trim="connectionForm.dataBits" :maxlength="200" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据位" prop="offset">
                <el-col :span="22">
                  <el-input v-model.trim="connectionForm.offset" :maxlength="200" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="停止位" prop="stopBits">
                <el-col :span="22">
                  <el-input v-model.trim="connectionForm.stopBits" :maxlength="200" />
                </el-col>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="读取方法" prop="functionCode">
                <el-col :span="22">
                  <el-select v-model.trim="connectionForm.functionCode" size="medium" style="width:100%;">
                    <el-option label="Coil" value="01" />
                    <el-option label="Input Discrete" value="02" />
                    <el-option label="Holding Register" value="03" />
                    <el-option label="Input Register" value="04" />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="波特率" prop="baudRate">
                <el-col :span="22">
                  <el-select v-model.trim="connectionForm.baudRate" size="medium" style="width:100%;">
                    <el-option label="1200" value="1200" />
                    <el-option label="2400" value="2400" />
                    <el-option label="4800" value="4800" />
                    <el-option label="9600" value="9600" />
                    <el-option label="14400" value="14400" />
                    <el-option label="19200" value="19200" />
                    <el-option label="38400" value="38400" />
                    <el-option label="57600" value="57600" />
                    <el-option label="115200" value="115200" />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="校验方式" prop="parity">
                <el-col :span="22">
                  <el-select v-model.trim="connectionForm.parity" size="medium" style="width:100%;">
                    <el-option label="NONE" value="0" />
                    <el-option label="ODD" value="1" />
                    <el-option label="EVEN" value="2" />
                    <el-option label="MARK" value="3" />
                    <el-option label="SPACE" value="4" />
                  </el-select>
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="超时时间(ms)" prop="timeout">
                <el-col :span="22">
                  <el-input v-model.trim="connectionForm.timeout" :maxlength="200" />
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">读取位配置</el-divider>

          <el-row :gutter="20" style="height:30px;">
            <el-form-item label style="padding:0;margin-left:-15%">
              <el-col :span="6" style="line-height: 23px;text-align: center;max-height: 23px;font-weight:600;margin-left: -13%">属性值</el-col>
              <el-col :span="6" style="line-height: 23px;text-align: center;max-height: 23px;font-weight:600;">读取位</el-col>
              <el-col :span="6" style="line-height: 23px;text-align: center;max-height: 23px;font-weight:600;">读取方法</el-col>
              <el-col :span="6" style="line-height: 23px;text-align: center;max-height: 23px;font-weight:600;">读取表达式</el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20" style="height:30px;">
            <el-form-item label style="padding:0;margin-left:-15%">
              <el-col :span="6" style="line-height: 23px;text-align: center;max-height: 23px;font-weight:600;">Humidity</el-col>
              <el-col :span="6" style="line-height: 23px;text-align: center;max-height: 23px;font-weight:600;margin-left: -9%">
                <el-input v-model.trim="connectionForm.valueIndex1" size="medium" />
              </el-col>
              <el-col :span="6" style="line-height: 23px;text-align: center;max-height: 23px;font-weight:600;">
                <el-select v-model.trim="connectionForm.readMethod" size="medium" style="width:100%;">
                  <el-option label="16位整型" value="getInt16At" />
                  <el-option label="32位整型" value="getInt32At" />
                  <el-option label="64位整型" value="getInt64At" />
                  <el-option label="32位浮点型" value="getFloat32At" />
                  <el-option label="64位浮点型" value="getFloat64At" />
                </el-select>
              </el-col>
              <el-col :span="6" style="line-height: 23px;text-align: center;max-height: 23px;font-weight:600;">
                <el-input v-model.trim="connectionForm.valueExpression" size="medium" />
              </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="20" style="height:30px;margin-top:30px">
            <el-form-item label style="padding:0;margin-left:-15%">
              <el-col :span="6" style="line-height: 23px;text-align: center;max-height: 23px;font-weight:600;">Temperature</el-col>
              <el-col :span="6" style="line-height: 23px;text-align: center;max-height: 23px;font-weight:600;margin-left: -9%">
                <el-input v-model.trim="connectionForm.valueIndex2" size="medium" />
              </el-col>
              <el-col :span="6" style="line-height: 23px;text-align: center;max-height: 23px;font-weight:600;">
                <el-select v-model.trim="connectionForm.readMethod" size="medium" style="width:100%;">
                  <el-option label="16位整型" value="getInt16At" />
                  <el-option label="32位整型" value="getInt32At" />
                  <el-option label="64位整型" value="getInt64At" />
                  <el-option label="32位浮点型" value="getFloat32At" />
                  <el-option label="64位浮点型" value="getFloat64At" />
                </el-select>
              </el-col>
              <el-col :span="6" style="line-height: 23px;text-align: center;max-height: 23px;font-weight:600;">
                <el-input v-model.trim="connectionForm.valueExpression" size="medium" />
              </el-col>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button icon="fa-ban" @click="configCloseEditDialog">取 消</el-button>
        <el-button type="primary" icon="fa-save" :loading="submiting" @click="saveConfigStrategy()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import JsonViewer from 'vue-json-viewer'
import {
  getList,
  changeAdminStatus,
  initParameterList,
  find,
  saveFeDeviceAddress,
  editFeDeviceAddress,
  deletePartner,
  loadAllMode,
  task,
  findFile,
  savefeScheduleStrategy,
  editfeScheduleStrategy,
  findProfile,
  saveCopyDevice,
  saveFeDeviceMode,
  copyModesave
} from '@/api/device'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
var DEVICE_STATUS = {
  1: '启用',
  0: '停用'
}
Vue.use(JsonViewer)
export default {
  name: 'Device',
  components: { Pagination },
  data() {
    return {
      jsonData: {},
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        agwId: '',
        nid: '',
        userId: '',
        deviceName: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      },
      edgeDeviceId: '',
      edgeDeviceName: '',
      AdminStatus: {
        nid: '',
        adminState: ''
      },
      idList: [],
      length: 0,
      disabled: true,
      abled: true,
      editDialogVisible: false,
      feDeviceAddressEditForm: {
        // 设备添加
        nid: '',
        deviceName: '',
        deviceDesc: '',
        adminState: '',
        operatingState: '',
        addrId: '',
        deviceServiceName: 'flexedgex-device-service',
        connectProtocol: '',
        profileNid: '',
        location: '',
        deviceLabels: '',
        agwId: '',
        profileName: '',
        addrProtocol: 'TCP',
        address: '',
        port: '',
        fileId: '',
        taskName: '',
        runOnce: true
      },
      feDeviceAddressEditRules: {
        deviceName: [
          {
            required: true,
            message: '请输入设备名称!'
          }
        ],
        profileNid: [
          {
            required: true,
            message: '请选择设备配置!'
            // trigger: 'blur,change'
          }
        ],
        deviceServiceName: [
          {
            required: true,
            message: '请选择设备服务!',
            trigger: 'blur,change'
          }
        ],
        adminState: [
          {
            required: true,
            message: '请选择管理状态!'
          }
        ],
        operatingState: [
          {
            required: true,
            message: '请选择操作状态!'
          }
        ],

        connectProtocol: [
          {
            required: true,
            message: '请选择连接协议!'
          }
        ]
      },
      currentActionType: '',
      editDialogTitle: '',
      feProfileList: [],
      profile: {
        addrType: 'device',
        agwId: ''
      },
      FileId: '',
      viewVisible: false,
      File: {
        FileId: ''
      },
      deviceId: {
        nid: ''
      },
      deviceNid: {
        deviceNid: ''
      },
      connectionType: '',
      ModeList: [],
      agwIdList: {
        agwId: ''
      },
      taskDialogVisible: false,
      feScheduleStrategyEditForm: {
        deviceNid: '',
        scheduleName: '',
        scheduleDesc: '',
        startTime: '',
        endTime: '',
        frequency: '',
        frequencyDay: '',
        frequencyHour: '',
        frequencyMinute: '',
        frequencySecond: '',
        translate: '',
        agwId: '',
        taskId: '',
        taskName: '',
        deviceServiceName: 'flexedgex-device-service',
        parameters: '',
        conditionChecksHidden: 'hidden',
        addrName: '',
        protocol: '',
        address: '',
        port: '',
        taskPath: '',
        addrType: '',
        method: '',
        addrIdTask: '',
        runOnce: true,
        taskCreateTime: '',
        nid: '',
        pathTask: ''
      },
      feScheduleStrategyEditRules: {
        pathTask: [
          {
            required: true,
            message: '请选择路径!'
          }
        ]
      },
      profileNames: {
        profileName: ''
      },
      pathList: [],
      staus: true,
      pickerOptions0: {},
      configDialogVisible: false,
      connectionForm: {
        slaveId: '1',
        offset: '0',
        quantity: '10',
        protocol: '',
        dataBits: '8',
        parity: '0',
        stopBits: '0',
        functionCode: '01',
        baudRate: '9600',
        parameterMap: null,
        model: '',
        configName: '',
        readAccessDatas: [],
        writeAccessDatas: [],
        endpoint: '',
        timeout: '1000',
        deviceDataAccessProtocol: '',
        deviceNid: '',
        nid: '',
        valueIndex1: '1',
        valueIndex2: '2',
        readMethod: 'getInt16At',
        valueExpression: 'value/10'
      },
      connectionFormRules: {
        configName: [{ required: true, message: '连接名称不能为空' }],
        protocol: [{ required: true, message: '地址不能为空' }],
        dataBits: [{ required: true, message: '读取位数不能为空' }],
        slaveId: [{ required: true, message: '地址位不能为空' }],
        endpoint: [{ required: true, message: '从站地址不能为空' }],
        timeout: [{ required: true, message: '请填写Timeout信息!' }],
        offset: [{ required: true, message: '数据位不能为空!' }],
        stopBits: [{ required: true, message: '停止位不能为空!' }],
        functionCode: [{ required: true, message: '请选择读取方法!' }],
        baudRate: [{ required: true, message: '请选波特率方法!' }],
        parity: [{ required: true, message: '请选校验方式!' }]
      },
      fileList: {
        FileId: ''
      },
      OpenCopyDialogVisible: false,
      copyDeviceEditForm: {
        nid: '',
        deviceName: '',
        agwId: ''
      },
      copyDeviceEditFormRule: {
        deviceName: [
          {
            required: true,
            message: '请输入设备名称!'
          }
        ]
      },
      editDialogMode: false,
      feEdgeDeviceEditMode: {
        deviceId: '',
        modeName: '',
        agwId: '',
        nid: ''
      },
      feDeviceAddressEditRulesMode: {
        modeName: [
          {
            required: true,
            message: '请输入 模板名称!'
          }
        ]
      },
      editDialogDevice: false,
      feDeviceAddress: {
        id: '',
        deviceName: '',
        agwId: ''
      },
      feDeviceAddresRules: {
        id: [
          {
            required: true,
            message: '请选择设备型号!'
          }
        ],
        deviceName: [
          {
            required: true,
            message: '请输入设备名称!'
          }
        ]
      }
    }
  },
  created() {
    this.initParams()
    this.getList()
    this.initParameterList()
    this.loadAllMode()
    console.info(this.edgeDeviceId)
  },
  methods: {
    initParams() {
      if (this.$route.query.edgeDeviceId === undefined) {
        this.edgeDeviceId = this.$route.query.edgeDeviceId
      }
    },
    getList() {
      this.listLoading = true
      this.listQuery.agwId = this.edgeDeviceId
      getList(this.listQuery).then((response) => {
        if (response.success) {
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].adminState === 'UNLOCKED') {
              response.data[i].showAdminState = 1
            } else {
              response.data[i].showAdminState = 0
            }
            if (response.data[i].operatingState === 'ENABLED') {
              response.data[i].showOperatingState = 1
            } else {
              response.data[i].showOperatingState = 0
            }
          }
          console.info(response.data[0].showAdminState)
          this.list = response.data
          this.total = response.totalRowCount
        } else {
          this.list = []
          this.total = []
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    handleClick(tab, event) {
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.multipleSelection = val
      this.length = this.multipleSelection.length
      this.idList = []
      if (this.length === 1) {
        this.disabled = false
        this.abled = false
        this.value = this.multipleSelection[0]
        this.idList.push(this.value.nid)
        this.deviceId.nid = this.idList.toString()
      }
      if (this.length > 1) {
        this.abled = false
        this.disabled = true
        for (var i = 0; i < this.length; i++) {
          this.idList.push(this.multipleSelection[i].nid)
          this.deviceId.nid = this.idList.toString()
        }
      }
      if (this.length === 0) {
        this.abled = true
        this.disabled = true
      }
    },
    resetQueryForm() {
      this.listQuery.deviceName = ''
      this.$refs.listQuery.resetFields()
    },
    changeAdminStatus(event, row) {
      console.info(row.deviceName)
      var rowOperatingState = 0
      var smessage = 'LOCKED'
      if (row.showAdminState === 1) {
        rowOperatingState = 0
      } else {
        rowOperatingState = 1
      }
      if (rowOperatingState === 0) {
        smessage = 'LOCKED'
      } else {
        smessage = 'UNLOCKED'
      }
      var _this = this
      _this.AdminStatus.nid = row.nid
      _this.AdminStatus.adminState = smessage
      this.$confirm(
        '确定要' + DEVICE_STATUS[rowOperatingState] + '该设备?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          changeAdminStatus(_this.AdminStatus)
            .then((response) => {
              if (response.success) {
                _this.getList()
              } else {
                _this.$notify.error('请求出错!')
              }
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    openPartnerEditDialog(actionType) {
      var _this = this
      _this.currentActionType = actionType
      _this.feDeviceAddressEditForm.agwId = _this.edgeDeviceId
      if (_this.currentActionType === 'add') {
        _this.editDialogTitle = '新增设备'

        _this.feDeviceAddressEditForm.adminState = 'UNLOCKED'
        _this.feDeviceAddressEditForm.operatingState = 'ENABLED'
      } else if (_this.currentActionType === 'edit') {
        _this.editDialogTitle = '修改设备'
        Vue.nextTick(function() {
          _this.feDeviceAddressEditForm.nid = _this.value.nid
          _this.feDeviceAddressEditForm.deviceId = _this.value.deviceId
          _this.feDeviceAddressEditForm.deviceName = _this.value.deviceName
          _this.feDeviceAddressEditForm.addrId = _this.value.addrId
          _this.feDeviceAddressEditForm.addrProtocol = _this.value.addrProtocol
          _this.feDeviceAddressEditForm.address = _this.value.address
          _this.feDeviceAddressEditForm.port = _this.value.port
          _this.feDeviceAddressEditForm.deviceServiceName =
            _this.value.deviceServiceName
          _this.feDeviceAddressEditForm.profileNid = _this.value.profileNid
          _this.feDeviceAddressEditForm.adminState = _this.value.adminState
          _this.feDeviceAddressEditForm.operatingState =
            _this.value.operatingState
          _this.feDeviceAddressEditForm.deviceDesc = _this.value.deviceDesc
          _this.feDeviceAddressEditForm.deviceLabels = _this.value.deviceLabels
          _this.feDeviceAddressEditForm.fileId = _this.value.fileId
          _this.feDeviceAddressEditForm.addrIdTask = _this.value.addrIdTask
          _this.feDeviceAddressEditForm.pathTask =
            _this.value.taskPath === null
              ? _this.value.taskTarget
              : _this.value.taskPath
          _this.feDeviceAddressEditForm.taskName = _this.value.taskName
          _this.feDeviceAddressEditForm.connectProtocol =
            _this.value.connectProtocol
          _this.feDeviceAddressEditForm.runOnce =
            _this.value.runOnce === null ? true : _this.value.runOnce
        })
      }
      _this.editDialogVisible = true
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.feDeviceAddressEditForm.resetFields()
      this.feDeviceAddressEditForm.addrProtocol = 'TCP'
      this.multipleSelection = []
    },
    saveFeDeviceAddress() {
      var _this = this
      this.$refs.feDeviceAddressEditForm.validate(function(valid) {
        if (valid) {
          if (_this.currentActionType === 'add') {
            saveFeDeviceAddress(_this.feDeviceAddressEditForm)
              .then((response) => {
                if (response.success) {
                  _this.$notify.success('保存成功!')
                  _this.closeEditDialog()
                  _this.getList()
                } else {
                  _this.$notify.error('请求出错!')
                }
              })
              .catch((error) => {
                console.log(error)
              })
          } else {
            editFeDeviceAddress(_this.feDeviceAddressEditForm)
              .then((response) => {
                if (response.success) {
                  _this.$notify.success('保存成功!')
                  _this.closeEditDialog()
                  _this.getList()
                } else {
                  _this.$notify.error('请求出错!')
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
        } else {
          return false
        }
      })
    },
    initParameterList() {
      this.profile.agwId = this.edgeDeviceId
      initParameterList(this.profile)
        .then((response) => {
          if (response.success) {
            this.feProfileList = response.feProfileList
          } else {
            this.feProfileList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    findFile(fileId) {
      this.FileId = fileId
    },
    closeDialog() {
      this.viewVisible = false
    },
    find() {
      var _this = this
      _this.File.FileId = _this.FileId
      find(_this.File)
        .then((response) => {
          if (response.success) {
            _this.viewVisible = true
            Vue.nextTick(function() {
              _this.jsonData = response.data
            })
          } else {
            _this.$notify.error('请求出错!')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    findProfile(profileNid) {
      var _this = this
      _this.fileList.FileId = profileNid
      findProfile(_this.fileList)
        .then((response) => {
          console.info(response)
          if (response.success) {
            _this.viewVisible = true
            Vue.nextTick(function() {
              _this.jsonData = response.data
            })
          } else {
            _this.$notify.error('请求出错!')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    deletePartner() {
      var _this = this
      this.$confirm('确定要删除该设备信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletePartner(_this.deviceId)
            .then((response) => {
              var result = response.data
              if (response.success) {
                _this.$notify.success('删除成功!')
                _this.getList()
                _this.loadAllMode()
                _this.connectionType = ''
              } else {
                _this.$notify.error(result.message)
              }
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch(() => {})
    },
    loadAllMode() {
      this.agwIdList.agwId = this.edgeDeviceId
      loadAllMode(this.agwIdList)
        .then((response) => {
          if (response.success) {
            this.ModeList = response.data
          } else {
            this.ModeList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handlePartnerCmd(cmd) {
      if (cmd === 'task') {
        this.task(this.value)
      } else if (cmd === 'audit') {
        this.openAuditDevice(this.value)
        this.configDialogVisible = true
      } else if (cmd === 'copy') {
        this.openCoopyDialog(this.value)
      } else if (cmd === 'copyMode') {
        this.openCopyMode(this.value)
      }
    },
    handlePartnerOpen(cmd) {
      if (cmd === 'add') {
        this.openPartnerEditDialog('add')
      } else if (cmd === 'addMode') {
        this.copyModeEditDialog()
      }
    },
    task(params) {
      var _this = this
      _this.deviceNid.deviceNid = params.nid
      _this.profileNames.profileName = params.profileName
      task(_this.deviceNid)
        .then((response) => {
          console.info(response.data)
          if (response.success) {
            if (response.data.length === 0) {
              this.$confirm('请先保存设备连接配置与读取位配置信息！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {})
                .catch((error) => {
                  console.log(error)
                })
            } else {
              _this.taskDialogVisible = true
              Vue.nextTick(function() {
                _this.feScheduleStrategyEditForm.agwId = _this.edgeDeviceId
                _this.feScheduleStrategyEditForm.scheduleName =
                  params.scheduleName == null ? '' : params.scheduleName
                _this.feScheduleStrategyEditForm.frequencyDay =
                  params.frequencyDay == null ? '' : params.frequencyDay
                _this.feScheduleStrategyEditForm.frequencyHour =
                  params.frequencyHour == null ? '' : params.frequencyHour
                _this.feScheduleStrategyEditForm.frequencyMinute =
                  params.frequencyMinute == null ? '' : params.frequencyMinute
                _this.feScheduleStrategyEditForm.frequencySecond =
                  params.frequencySecond == null ? '' : params.frequencySecond
                _this.feScheduleStrategyEditForm.startTime = params.startTime
                _this.feScheduleStrategyEditForm.endTime = params.endTime
                _this.feScheduleStrategyEditForm.taskName =
                  params.taskName === null ? '' : params.taskName
                _this.feScheduleStrategyEditForm.parameters = params.parameters
                _this.feScheduleStrategyEditForm.scheduleDesc =
                  params.scheduleDesc
                _this.feScheduleStrategyEditForm.address = params.addressTask
                _this.feScheduleStrategyEditForm.port = params.portTask
                _this.feScheduleStrategyEditForm.protocol = params.protocolTask
                _this.feScheduleStrategyEditForm.method = params.method
                _this.feScheduleStrategyEditForm.deviceServiceName =
                  params.deviceServiceName
                _this.feScheduleStrategyEditForm.deviceNid = params.nid
                _this.feScheduleStrategyEditForm.nid = _this.feScheduleStrategyEditForm.taskId =
                  params.taskId
                _this.feScheduleStrategyEditForm.pathTask = params.taskPath
                _this.feScheduleStrategyEditForm.deviceLabels =
                  params.deviceLabels
                _this.feScheduleStrategyEditForm.addrId = params.addrId
                _this.feScheduleStrategyEditForm.addrIdTask = params.addrIdTask
                _this.labels = params.taskId
                _this.feScheduleStrategyEditForm.deviceName = params.deviceName
                _this.feScheduleStrategyEditForm.createTimeTask =
                  params.createTimeTask
                _this.feScheduleStrategyEditForm.runOnce =
                  params.runOnce === null ? true : params.runOnce
                findFile(_this.profileNames)
                  .then((response) => {
                    if (response.success) {
                      _this.pathList = response.data
                    } else {
                      _this.pathList = []
                    }
                  })
                  .catch((error) => {
                    console.log(error)
                  })
                if (params.taskPath === null || params.taskPath === '') {
                  _this.staus = true
                } else {
                  _this.staus = false
                }
              })
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    openAuditDevice(params) {
      this.configDialogVisible = true
    },
    openCoopyDialog(params) {
      var _this = this
      _this.OpenCopyDialogVisible = true
      _this.copyDeviceEditForm.nid = params.nid
      _this.copyDeviceEditForm.agwId = params.agwId
    },
    openCopyMode(params) {
      var _this = this
      _this.editDialogMode = true
      _this.feEdgeDeviceEditMode.deviceId = params.deviceId
      _this.feEdgeDeviceEditMode.agwId = params.agwId
      _this.feEdgeDeviceEditMode.modeName = params.modeName
      _this.feEdgeDeviceEditMode.nid = params.nid
    },
    taskCloseDialogVisible() {
      this.taskDialogVisible = false
      this.$refs.feScheduleStrategyEditForm.resetFields()
    },
    savefeScheduleStrategy() {
      var _this = this
      _this.feScheduleStrategyEditForm.taskPath =
        _this.feScheduleStrategyEditForm.pathTask

      this.$refs.feScheduleStrategyEditForm.validate(function(valid) {
        if (valid) {
          if (_this.labels === null || _this.labels === '') {
            savefeScheduleStrategy(_this.feScheduleStrategyEditForm)
              .then((response) => {
                if (response.success) {
                  _this.$notify.success('保存成功!')
                  _this.taskCloseDialogVisible()
                  _this.getList()
                } else {
                  _this.$notify.error('请求出错!')
                }
              })
              .catch((error) => {
                console.log(error)
              })
          } else {
            editfeScheduleStrategy(_this.feScheduleStrategyEditForm)
              .then((response) => {
                if (response.success) {
                  _this.$notify.success('保存成功!')
                  _this.taskCloseDialogVisible()
                  _this.getList()
                } else {
                  _this.$notify.error('请求出错!')
                }
              })
              .catch((error) => {
                console.log(error)
              })
          }
        } else {
          return false
        }
      })
    },
    configCloseEditDialog() {
      this.configDialogVisible = false
    },
    saveConfigStrategy() {
      var _this = this
      _this.$refs.connectionForm.validate(function(valid) {
        if (valid) {
          _this.configDialogVisible = false
          _this.$notify({
            message: '配置成功!',
            type: 'success'
          })
        }
      })
    },
    saveCopyDevice() {
      var _this = this
      this.$refs.copyDeviceEditForm.validate(function(valid) {
        if (valid) {
          saveCopyDevice(_this.copyDeviceEditForm)
            .then((response) => {
              if (response.success) {
                _this.$notify.success('保存成功!')
                _this.closeCopyDialog()
                _this.getList()
              } else {
                _this.$notify.error('请求出错!')
              }
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          return false
        }
      })
    },
    closeCopyDialog() {
      this.OpenCopyDialogVisible = false
      this.copyDeviceEditForm.nid = ''
      this.copyDeviceEditForm.deviceName = ''
    },
    closeEditDialogmode() {
      this.editDialogMode = false
      this.$refs.feEdgeDeviceEditMode.resetFields()
      this.feEdgeDeviceEditMode.deviceId = ''
      this.feEdgeDeviceEditMode.modeName = ''
    },
    saveFeDeviceMode() {
      var _this = this
      this.$refs.feEdgeDeviceEditMode.validate(function(valid) {
        if (valid) {
          saveFeDeviceMode(_this.feEdgeDeviceEditMode)
            .then((response) => {
              if (response.success) {
                _this.$notify.success('保存成功!')
                _this.closeEditDialogmode()
                _this.getList()
              } else {
                _this.$notify.error('请求出错!')
              }
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          return false
        }
      })
    },
    copyModeEditDialog() {
      var _this = this
      _this.editDialogDevice = true
      _this.feDeviceAddress.agwId = _this.edgeDeviceId
    },
    copyModesave() {
      var _this = this
      this.$refs.feDeviceAddress.validate(function(valid) {
        if (valid) {
          copyModesave(_this.feDeviceAddress)
            .then((response) => {
              if (response.success) {
                _this.$notify.success('复制设备模板成功!')
                _this.closeDevice()
                _this.getList()
              } else {
                _this.$notify.error('请求出错!')
              }
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          return false
        }
      })
    },
    closeDevice() {
      this.editDialogDevice = false
      this.$refs.feDeviceAddress.resetFields()
      this.feDeviceAddress.id = ''
    }
  }
}
</script>
<style scoped>
.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 24px 0;
}
.el-divider__text,
.el-link {
  font-weight: 500;
  font-size: 16px;
}
.el-divider__text {
  position: absolute;
  background-color: #fff;
  padding: 0 20px;
  color: #303133a1;
}
.shou {
  cursor: pointer;
  text-decoration: underline;
}
</style>
