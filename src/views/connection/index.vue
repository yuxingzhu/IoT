<template>
  <div class="app-container">
    <div style="height:40px;width:100%;background-color: #fff;">
      <el-row>
        <el-col :span="17" style="font-size: 13px;font-weight: 400;font-family: 'Microsoft YaHei'">
          <span>设备名称：</span>{{ deviceInfo.deviceName }}
        </el-col>
        <el-col :span="5" style="text-align: right;">
          <el-button v-if="operationPermission==0" type="primary" @click="openFullScreen">部署</el-button>
          <el-button type="primary" @click="deploy">部署记录</el-button>
          <el-button type="primary" @click="test()">测试</el-button>
        </el-col>
      </el-row>
      <el-row style="color:rgba(96, 92, 92, 0.71);font-size: 12px;font-family: 'Microsoft YaHei';margin-top: 15px;">
        <el-col :span="4">
          设备状态： {{ deviceInfo.adminState==='UNLOCKED'?'启用' : '停用' }}
        </el-col>
        <el-col :span="10">
          <span>连接协议：</span>{{ connectionType }}
        </el-col>
      </el-row>
    </div>
    <el-divider />
    <div class="operation">
      <el-tooltip v-if="operationPermission==0" class="item" effect="dark" content="新增" placement="bottom">
        <el-button icon="el-icon-plus" @click="handleCreate" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="返回" placement="bottom">
        <el-button @click="$router.back(-1)">
          <svg-icon icon-class="back" />
        </el-button>
      </el-tooltip>
    </div>
    <OperateTable :table-data="tableData" :column-data="columnData" :operation-hidden="true">
      <template #configButton="slotProp">
        <el-tooltip v-if="operationPermission==0" class="item" effect="dark" content="修改" placement="bottom">
          <el-button icon="el-icon-edit" @click="handleUpdate(slotProp.row)" />
        </el-tooltip>
        <el-tooltip v-if="operationPermission==0" class="item" effect="dark" content="删除" placement="bottom">
          <el-button icon="el-icon-delete" @click="handleDelete(slotProp.row)" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="配置" placement="bottom">
          <el-button icon="el-icon-setting" @click="handleSet(slotProp.row)" />
        </el-tooltip>
      </template>
    </OperateTable>
    <div v-if="tagTableVisible == 'visible'" class="page-form">
      <FlexCard :title="connectionName">
        <div class="operation">
          <el-tooltip v-if="operationPermission==0" class="item" effect="dark" content="新增" placement="bottom">
            <el-button @click="handleTagCreate"><i class="el-icon-plus" /></el-button>
          </el-tooltip>
          <el-input v-model.trim="deviceInfoName" :maxlength="20" style="width:200px" placeholder="属性" />
          <el-tooltip content="重置">
            <el-button icon="el-icon-refresh" @click="resetQueryForm" />
          </el-tooltip>
          <el-tooltip content="搜索">
            <el-button icon="el-icon-search" @click="initTagList" />
          </el-tooltip>
          <el-tooltip v-if="operationPermission==0" class="item" effect="dark" content="导入配置" placement="bottom">
            <el-button @click="handleTagUpload"><i class="el-icon-upload" /></el-button>
          </el-tooltip>
          <el-tooltip v-if="operationPermission==0" class="item" effect="dark" content="下载配置模版" placement="bottom">
            <el-button @click="handleTagDownload"><i class="el-icon-download" /></el-button>
          </el-tooltip>
          <el-tooltip v-if="operationPermission==0" class="item" effect="dark" content="导出配置" placement="bottom">
            <el-button icon="el-icon-notebook-2" @click="handleExportFile" />
          </el-tooltip>
          <el-tooltip v-if="operationPermission==0" class="item" effect="dark" content="清空配置" placement="bottom">
            <el-button @click="deleteAll"><i class="el-icon-delete" /></el-button>
          </el-tooltip>
        </div>
        <OperateTable :table-data="tagTableData" :column-data="tagColumnData" :operation-hidden="operationPermission == 0">
          <template #configButton="slotProp">
            <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
              <el-button icon="el-icon-edit" @click="handleTagUpdate(slotProp.row)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button icon="el-icon-delete" @click="handleTagDelete(slotProp.row)" />
            </el-tooltip>
          </template>
        </OperateTable>
        <Pagination :total="tagsTableCount" :page.sync="tagQuery.page" :limit.sync="tagQuery.size" @pagination="initTagList" />
      </FlexCard>
    </div>
    <div class="dialog">
      <el-dialog :title="dataTitle" :visible.sync="connectionVisible" class="multi-line" :close-on-click-modal="false" @close="resetDataForm">
        <div class="page-form">
          <FlexCard :show-header="false">
            <CardForm legend="基础信息">
              <FlexForm ref="baseInfo" label-width="115px" form-name="baseForm" :form-data="baseForm.formData" :dynamic-form-model="baseForm.dynamicFormModel" :rules="baseForm.rules">
                <template #eventFormItem>
                  <el-form-item label="连接类型" :rules="baseForm.rules.configType">
                    <el-select v-model.trim="baseForm.dynamicFormModel.configType" :disabled="isUpdate" @change="configTypeChange">
                      <el-option label="读" :value="1" />
                      <el-option v-if="connectionType !='HTTP' && connectionType !='MICONNECT' && connectionType !='DLT645' && connectionType !='DLT645_1997'" label="写" :value="2" />
                    </el-select>
                  </el-form-item>
                </template>
              </FlexForm>
            </CardForm>
            <CardForm legend="连接配置" :class="{hidden: dataAccessFormClass}">
              <FlexForm ref="accessOptions" label-width="115px" :inline="true" :slice="2" form-name="accessForm" :form-data="accessForm.formData" :dynamic-form-model="accessForm.dynamicFormModel" :rules="accessForm.rules" />
            </CardForm>
            <CardForm v-if="this.connectionType == 'IEC101' || this.connectionType == 'IEC104'" legend="发送方式">
              <el-form ref="subStationForm" size="mini" :model="subStationModel" label-width="150px" :inline="true">
                <el-form-item>
                  <el-tooltip class="item" effect="dark" content="新增子站遥测值配置" placement="bottom">
                    <el-button style="margin-right: -25px;" icon="el-icon-plus" @click="handleSubStationCreate" />
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="子站遥测值发送方式">
                  <el-radio-group v-model.trim="subStationModel.substationmodetype" :disabled="isSubStationUpdate">
                    <el-radio :label="1">归一化</el-radio>
                    <el-radio :label="2">标度化</el-radio>
                    <!--                    <el-radio :label="3">短浮点</el-radio>-->
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <el-table size="small" :data="subStationModeTableData" border fit highlight-current-row style="width: 100%">

                <el-table-column label="遥测信息属性">
                  <template slot-scope="{row}">
                    <template v-if="row.edit">
                      <el-input v-model.trim="row.attribute" class="edit-input" size="small" />
                    </template>
                    <span v-else>{{ row.attribute }}</span>
                  </template>
                </el-table-column>

                <el-table-column v-if="this.subStationModel.substationmodetype==1" label="满码值">
                  <template slot-scope="{row}">
                    <template v-if="row.edit">
                      <el-input v-model.trim="row.fullcodevalue" type="number" class="edit-input" size="small" />
                    </template>
                    <span v-else>{{ row.fullcodevalue }}</span>
                  </template>
                </el-table-column>

                <el-table-column v-if="this.subStationModel.substationmodetype==2" label="系数">
                  <template slot-scope="{row}">
                    <template v-if="row.edit">
                      <el-input v-model.trim="row.coefficient" type="number" class="edit-input" size="small" />
                    </template>
                    <span v-else>{{ row.coefficient }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="单位">
                  <template slot-scope="{row}">
                    <template v-if="row.edit">
                      <el-input v-model.trim="row.unit" class="edit-input" size="small" />
                    </template>
                    <span v-else>{{ row.unit }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="120">
                  <template slot-scope="{row}">
                    <el-button v-if="row.edit" type="success" size="small" icon="el-icon-check" @click="confirmEdit(row)" />
                    <el-button v-if="!row.edit" type="primary" size="small" icon="el-icon-edit" @click="row.edit=!row.edit" />
                    <el-button v-if="!row.edit" type="primary" size="small" icon="el-icon-delete" @click="handleSubStationDelete(row)" />
                  </template>
                </el-table-column>
              </el-table>
            </CardForm>
          </FlexCard>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="connectionVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="tagTitle" :visible.sync="tagVisible" :close-on-click-modal="false" @close="resetForm('tagInfo','tagForm')">
        <FlexForm ref="tagInfo" form-name="tagForm" :form-data="tagForm.formData" :dynamic-form-model="tagForm.dynamicFormModel" :rules="tagForm.rules" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="tagVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleTagSubmit">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="editDialogTitle" :visible.sync="fileDialogVisible" :close-on-click-modal="false" @close="closeDialog">
        <div>
          <el-form ref="resourceFileForm" :model="resourceFileForm" :rules="resourceEditRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="24">
                <el-form-item label="选择文件" prop="path">
                  <el-col :span="24">
                    <el-upload
                      class="upload-demo"
                      :action="action"
                      :on-remove="handleRemove"
                      :on-error="onError"
                      :on-progress="onProgress"
                      :multiple="false"
                      :limit="1"
                      :auto-upload="true"
                      :data="uploadData"
                      :on-success="handleSuccess"
                      :before-upload="beforeUpload"
                      :file-list="fileList"
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">上传文件大小不能超过3MB,条数不能超过10000</div>
                    </el-upload>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div v-if="errorTableData.length>0">
                  <h4 style="color:#dc0d0d;text-indent:2px;padding:5px 0;border-left:10px solid #dc0d0d;border-top:1px solid #ccc;">错误列表</h4>
                  <el-table :data="errorTableData" style="width: 100%">
                    <el-table-column prop="name" width="180" align="center" label="名称" />
                    <el-table-column prop="error" align="center" label="原因" />
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-dialog>

      <el-dialog title="读写测试" :visible.sync="testVisible" :close-on-click-modal="false" style="width: 122%; margin-left: -6%" @close="closeTestDialog">
        <div>
          <el-form>
            <el-row>
              <el-col :span="20" style="margin-left: 0px; margin-top: 0px" hidden>
                {{ pathTestName }}
              </el-col>
            </el-row>
            <el-row style="margin-left: 40px; margin-top: 0px">
              <el-col :span="4">测试类型：</el-col>
              <el-col
                v-show="protocol === 'BECKHOFF_ADSNET' || protocol === 'OMRON' || protocol === 'BACNET' || protocol === 'SIEMENS_S7' || protocol === 'MITSUBISH_MC' || protocol === 'MODBUS_RTU' || protocol === 'IEC104' ||
                  protocol === 'IEC101' ||
                  protocol === 'CIP' ||
                  protocol === 'DF1' ||
                  protocol === 'OPCUA' ||
                  protocol === 'OPCDA' ||
                  protocol === 'MODBUS_TCP'
                "
                :span="20"
                style="margin-left: 0px; margin-top: 0px"
              >
                <template>
                  <el-radio-group v-model.trim="testType" style="margin-left: 0px !important; margin-top: 0px" @change="testTypeChange">
                    <el-radio :label="1">读测试</el-radio>
                    <el-radio :label="2">写测试</el-radio>
                  </el-radio-group>
                </template>
              </el-col>
              <el-col
                v-show="
                  protocol !== 'BECKHOFF_ADSNET' &&
                    protocol !== 'OMRON' &&
                    protocol !== 'BACNET' &&
                    protocol !== 'SIEMENS_S7' &&
                    protocol !== 'MITSUBISH_MC' &&
                    protocol !== 'MODBUS_RTU' &&
                    protocol !== 'IEC104' &&
                    protocol !== 'IEC101' &&
                    protocol !== 'CIP' &&
                    protocol !== 'DF1' &&
                    protocol !== 'OPCUA' &&
                    protocol !== 'OPCDA' &&
                    protocol !== 'MODBUS_TCP'
                "
                :span="20"
                style="margin-left: 0px; margin-top: 0px"
              >
                <template>
                  <el-radio-group v-model.trim="testType" style="margin-left: 0px !important; margin-top: 0px" @change="testTypeChange">
                    <el-radio :label="1">读测试</el-radio>
                  </el-radio-group>
                </template>
              </el-col>
            </el-row>
            <el-row v-if="testType === 2" style="margin-left: 40px; margin-top: 15px">
              <el-col :span="4" style="margin-top: 16px">属性名：</el-col>
              <el-col :span="10" style="margin-left: 0px; margin-top: 5px">
                <el-select v-model.trim="testContentLabel" placeholder="请选择">
                  <el-option v-for="writeTag in accesslist" :key="writeTag.name" :label="writeTag.name" :value="writeTag.name" />
                </el-select>
              </el-col>
            </el-row>
            <el-row v-if="testType === 2" style="margin-left: 40px; margin-top: 15px">
              <el-col :span="4" style="margin-top: 10px">属性值：</el-col>
              <el-col :span="10" style="margin-left: 0px; margin-top: 0px">
                <el-input v-model.trim="testContent" />
              </el-col>
            </el-row>
            <el-row style="margin-left: 40px; margin-top: 15px">
              <el-col :span="4" style="margin-left: 0px">
                <el-button type="primary" style="width: 60px" @click="searchContext(pathTestName)">测试</el-button>
              </el-col>
            </el-row>

            <el-row style="margin-left: 40px; margin-top: 19px">
              <el-col :span="4">测试结果：</el-col>
              <el-col v-show="contextResult" :span="19" style="margin-left: 85px; margin-top: -16px">
                <div v-show="contextTest === null" id="context" />
                <div v-show="contextTest !== null">
                  <json-viewer :value="contextTest" :expand-depth="5" boxed />
                </div>
              </el-col>

              <el-col v-show="!contextResult" :span="19" style="margin-left: 85px; margin-top: -15px; width: 77%">
                测试异常
                <el-collapse v-model.trim="activeNames" style="margin-top: 10px;">
                  <el-collapse-item title="异常详情" name="2">
                    <div id="contextTest1" style="word-break: break-all; word-wrap: break-word;word-break: normal; " />
                  </el-collapse-item>
                </el-collapse>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeTestDialog">关 闭</el-button>
        </div>
      </el-dialog>
      <el-dialog title="部署记录" :visible.sync="viewConfigDialogVisible" :close-on-click-modal="false" style="width:226%;margin-left: -56%;" @close="closePartnerViewConfigDialog">
        <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" style="width: 100%;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="">
                  <span>{{ props.row.deployMessage }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column v-if="type==1" label="部署网关" prop="edgeName" align="center" />
          <el-table-column v-if="type==2" label="部署节点" prop="edgeName" align="center" />
          <el-table-column label="部署方式" prop="deployWay" align="center">
            <template slot-scope="scope">
              {{ scope.row.deployWay === 0?'自动':'手动' }}
            </template>
          </el-table-column>
          <el-table-column label="部署结果" prop="deployResult" align="center">
            <template slot-scope="scope">
              {{ scope.row.deployResult === 0?'成功':( scope.row.deployResult === 1?'失败':'待部署') }}
            </template>
          </el-table-column>
          <el-table-column label="部署者" prop="userName" align="center" />
          <el-table-column label="部署时间" prop="deployTime" width="150" align="center" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
        <div slot="footer">
          <el-button icon="fa-ban" @click="closePartnerViewConfigDialog">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import JsonViewer from 'vue-json-viewer'
import FlexForm from '@/components/FlexForm/index'
import Pagination from '@/components/Pagination/index'
import OperateTable from '@/components/FlexTable/OperateTable/index'
import FlexCard from '@/components/FlexCard/index'
import CardForm from '@/components/FlexCard/CardForm/index'

import {
  list,
  save,
  deleteNid,
  listTag,
  saveTag,
  deleteTagNid,
  findDeviceInfo,
  deleteAll,
  flushEdgeAgw,
  flushNodeAgw,
  offLIneEdgeAgw,
  findTaskByAgwId,
  findByNid,
  queryCommandFieldList,
  task,
  getProfilePath,
  getList
} from '@/api/connection'
import {
  searchContext,
  searchContextTest
} from '@/api/nedevice'
import { setModel } from '@/utils/form'

import {
  connectionData,
  connectionWriteData,
  tagData,
  writeTagData,
  tagTableColumnData,
  writeTagTableColumnData
} from './consts/data'
import { fetchCommandName } from '../../api/connection'

const _ = require('lodash')
Vue.use(JsonViewer)
export default {
  name: 'Connection',
  components: { OperateTable, FlexForm, Pagination, FlexCard, CardForm },
  data() {
    return {
      connectionName: '',
      isUpdate: false,
      isSubStationUpdate: false,
      isTagUpdate: false,
      deviceNid: 0,
      profileNid: 0,
      connectionNid: '',
      agwId: 0,
      tagNid: '',
      dataTitle: '',
      tagTitle: '',
      readCount: 0,
      writeCount: 0,
      tagCommands: {},
      configType: -1,
      connectionType: 'MODBUS_RTU',
      tagsTableCount: 0,
      dataAccessFormClass: false,
      tagQuery: {
        page: 1,
        size: 10,
        sort: 'createTime,desc'
      },
      deviceInfo: {
        deviceName: '',
        adminState: ''
      },
      connectionVisible: false,
      tagTableVisible: 'hidden',
      tagVisible: false,
      subStationModel: {
        substationmodetype: 1
      },
      baseForm: {
        formData: [
          {
            type: 'input',
            name: 'configName',
            label: '连接名称',
            value: ''
          },
          {
            type: 'input',
            name: 'endpoint',
            label: '地址',
            value: ''
          }
        ],
        dynamicFormModel: { configType: '' },
        rules: {
          configName: {
            required: true,
            message: '请输入连接名称',
            trigger: 'blur'
          },
          endpoint: [
            { required: true, message: '请输入地址', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (this.connectionType === 'MODBUS_TCP') {
                  if (
                    !/^(modbus\.tcp):\/\/((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/.test(
                      value
                    )
                  ) {
                    callback('地址格式：modbus.tcp://ip:port')
                  } else {
                    callback()
                  }
                } else if (this.connectionType === 'MODBUS_RTU') {
                  callback()
                } else if (this.connectionType === 'HTTP') {
                  if (
                    !/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
                      value
                    )
                  ) {
                    callback(
                      '地址示例：http://www.sojson.com/open/api/weather/json.shtml'
                    )
                  } else {
                    callback()
                  }
                } else if (this.connectionType === 'MTCONNECT') {
                  if (
                    !/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(
                      value
                    )
                  ) {
                    callback(
                      '地址示例：http://www.sojson.com/open/api/weather/json.shtml'
                    )
                  } else {
                    callback()
                  }
                } else if (this.connectionType === 'OPCUA') {
                  if (
                    !/^opc\.tcp:\/\/((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))(\/(.*)+)$/.test(
                      value
                    )
                  ) {
                    callback('地址格式：opc.tcp://ip:port/path_name')
                  } else {
                    callback()
                  }
                } else if (
                  this.connectionType === 'MITSUBISH_MC' ||
                  this.connectionType === 'SIEMENS_S7' ||
                  this.connectionType === 'BECKHOFF_ADSNET'
                ) {
                  if (
                    !/^plc:\/\/((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))$/.test(
                      value
                    )
                  ) {
                    callback('地址格式:plc://ip:port')
                  } else {
                    callback()
                  }
                } else if (this.connectionType === 'CIP') {
                  if (
                    !/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/.test(
                      value
                    )
                  ) {
                    callback('地址格式:ip')
                  } else {
                    callback()
                  }
                } else if (this.connectionType === 'BACNET') {
                  if (value.length < 19) {
                    callback('local_ip:remote_ip:remote_port:instance_id', true)
                  } else {
                    callback()
                  }
                } else {
                  callback()
                }
              },
              trigger: 'change'
            }
          ],
          configType: {
            required: true,
            message: '请选择连接类型',
            trigger: 'change'
          }
        }
      },
      accessForm: {
        formData: [],
        dynamicFormModel: {},
        rules: {
          slaveId: [
            { required: true, message: '请输入从站地址', trigger: 'blur' }
          ],
          offset: [
            { required: true, message: '请输入地址位', trigger: 'blur' }
          ],
          quantity: [
            { required: true, message: '请输入读取位数', trigger: 'blur' }
          ],
          dataBits: [
            { required: true, message: '请输入数据位', trigger: 'blur' }
          ],
          stopBits: [
            { required: true, message: '请输入停止位', trigger: 'blur' }
          ],
          functionCode: [
            { required: true, message: '请选择读取方法', trigger: 'change' }
          ],
          baudRate: [
            { required: true, message: '请选择波特率', trigger: 'change' }
          ],
          parity: [
            { required: true, message: '请选择校验方式', trigger: 'change' }
          ],
          model: [{ required: true, message: '请选择型号', trigger: 'change' }],
          address: [
            { required: true, message: '请输入电表地址', trigger: 'change' }
          ],
          mode: [
            { required: true, message: '请选择工作模式', trigger: 'change' }
          ],
          username: [
            { required: true, message: '请选择用户名', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ],
          progId: [
            { required: true, message: '请输入程序ID', trigger: 'change' }
          ]
        }
      },
      tagForm: {
        formData: [],
        dynamicFormModel: {},
        rules: {
          dataName: [
            { required: true, message: '请输入属性名称', trigger: 'change' },
            {
              validator: (rule, value, callback) => {
                if (this.configType === 1) {
                  if (_.indexOf(this.tagCommands.readCommands, value) === -1) {
                    callback('该属性名称尚未录入')
                  }
                } else if (this.configType === 2) {
                  if (_.indexOf(this.tagCommands.writeCommands, value) === -1) {
                    callback('该属性名称尚未录入')
                  }
                }
                callback()
              },
              trigger: 'change'
            }
          ],
          valueIndex: [
            { required: true, message: '请输入读取位', trigger: 'change' },
            {
              validator: (rule, value, callback) => {
                if (!/^[1-9]\d*|0$/.test(value)) {
                  callback('读取位为非负整数')
                }
                callback()
              },
              trigger: 'change'
            }
          ],
          readMethod: [
            { required: true, message: '请选择读取方法', trigger: 'change' }
          ],
          // valueExpression: [
          //   { required: true, message: '请输入表达式', trigger: 'blur' }
          // ],
          method: [
            { required: true, message: '请选择方法', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入属性地址', trigger: 'blur' }
          ],
          functionCode: [
            { required: true, message: '请选择写功能码', trigger: 'change' }
          ],
          offset: [
            { required: true, message: '请输入地址位', trigger: 'blur' }
          ],
          nodeId: [
            { required: true, message: '请输入节点路径', trigger: 'blur' }
          ],
          ruleId: {
            required: true,
            message: '请输入数据标识',
            trigger: 'change'
          },
          dataType: [
            { required: true, message: '请选择数据类型', trigger: 'change' }
          ],
          valueAddr: [
            { required: true, message: '请输入读取位', trigger: 'change' }
          ]
        }
      },
      columnData: [
        {
          label: '连接名称',
          name: 'configName',
          width: '200'
        },
        {
          label: '连接类型',
          name: 'configType',
          type: 'format',
          items: [
            {
              key: 1,
              value: '读'
            },
            {
              key: 2,
              value: '写'
            }
          ]
        },
        {
          label: '创建时间',
          name: 'createTime'
        }
      ],
      tableData: [
        {
          configName: '连接1',
          configType: '写',
          createTime: '2019-08-28 12:23:32'
        }
      ],
      tagColumnData: [
        {
          label: '属性',
          name: 'dataName',
          width: '200'
        },
        {
          label: '读取位',
          name: 'valueIndex'
        },
        {
          label: '读取方法',
          name: 'readMethod'
        },
        {
          label: '读取表达式',
          name: 'valueExpression'
        }
      ],
      tagTableData: [],
      subStationModeTableData: [],
      deviceInfoName: '',
      editDialogTitle: '',
      errorTableData: [],
      fileDialogVisible: false,
      resourceFileForm: {
        // id: '',
        // path: '',
        // realName: '',
        // agwId: ''
      },
      resourceEditRules: {
        path: [
          {
            required: true,
            message: '请选择文件!'
          }
        ]
      },
      action: process.env.VUE_APP_BASE_API + '/ddaconfig/uploadFile',
      uploadData: {},
      fileList: [],
      fileTitle: '',
      agwIdList: {
        agwId: ''
      },
      deployTasks: {},
      feEdgeDevice: {},
      createTime: '',
      status: '',
      type: '',
      testVisible: false,
      pathTask: '',
      accesslist: [],
      pathTest: '',
      pathTestName: '',
      testType: 1,
      testContentLabel: '',
      testContent: '',
      contextResult: true,
      activeNames: '',
      Path: {
        textTask: '',
        agwId: ''
      },
      context: '',
      demo: '',
      contextTest: {},
      neDevice: [],
      deviceIdList: {
        nid: ''
      },
      commandList: {},
      deviceNids: {
        deviceNid: ''
      },
      testDevice: {
        profileNid: '',
        agwId: '',
        deviceNid: '',
        connectProtocol: ''
      },
      protocol: '',
      taskDialogVisible: false,
      profileNames: {
        profileName: ''
      },
      viewConfigDialogVisible: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        deployEdge: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'deployTime',
        order: 'desc'
      }
    }
  },
  computed: {
    isFins() {
      return this.accessForm.dynamicFormModel.model
    },
    ...mapGetters(['operationPermission'])
  },
  watch: {
    configType: function(val) {
      if (val === 1) {
        this.accessForm.formData = connectionData[this.connectionType]
        this.tagForm.formData = tagData[this.connectionType]
        this.tagColumnData = tagTableColumnData[this.connectionType]
        this.tagTitle = '读取位'
      } else if (val === 2) {
        this.accessForm.formData = connectionData[this.connectionType]
        if (
          this.connectionType === 'MODBUS_RTU' ||
          this.connectionType === 'MODBUS_TCP'
        ) {
          this.accessForm.formData = connectionWriteData[this.connectionType]
        }
        this.tagForm.formData = writeTagData[this.connectionType]
        this.tagColumnData = writeTagTableColumnData[this.connectionType]
        this.tagTitle = '写入位'
      }
      this.accessForm.dynamicFormModel = {}
      this.tagForm.dynamicFormModel = {}
      setModel(this, 'accessForm')
      setModel(this, 'tagForm')
    },
    subStationModeTableData: function(val) {
      if (val.length >= 1) {
        this.isSubStationUpdate = true
      } else {
        this.isSubStationUpdate = false
      }
    },
    isFins(val) {
      if (this.connectionType === 'OMRON') {
        if (val === 'HOST_LINK') {
          const ct = 'OMRON_HOST_LINK'
          this.accessForm.formData = connectionData[ct]
          if (this.dataTitle === '新增连接') {
            this.accessForm.dynamicFormModel = {}
            setModel(this, 'accessForm')
          }
        } else if (val === 'FINS') {
          this.accessForm.formData = connectionData[this.connectionType]
          if (this.dataTitle === '新增连接') {
            this.accessForm.dynamicFormModel = {}
            setModel(this, 'accessForm')
          }
        }
      }
    }
  },
  created: function() {
    this.deviceNid = this.$route.query.deviceNid
    this.connectionType = this.$route.query.connectProtocol
    this.agwId = this.$route.query.agwId
    this.type = this.$route.query.type
    this.profileNid = this.$route.query.profileNid
    this.accessForm.formData = connectionData[this.connectionType]
    this.tagForm.formData = tagData[this.connectionType]
    if (this.connectionType === 'OPCUA' || this.connectionType === 'HTTP') {
      this.dataAccessFormClass = true
    }
  },
  mounted: function() {
    this.initList()
    this.initBaseConfigDynamicFromModel()
    this.initTagCommands()
    this.queryById()
  },
  methods: {
    configTypeChange: function(selValue) {
      this.configType = selValue
    },
    initTagCommands: function() {
      const params = {
        profileNid: this.profileNid,
        deviceNid: this.deviceNid
      }
      fetchCommandName(params).then((response) => {
        this.tagCommands = response.data
      })
    },
    initList: function() {
      list(this.deviceNid).then((response) => {
        this.tableData = response.data
        this.readCount = response.readCount
        this.writeCount = response.writeCount
      })

      findDeviceInfo(this.deviceNid).then((response) => {
        if (response.success) {
          this.deviceInfo.deviceName = response.data[0].deviceName
          this.deviceInfo.adminState = response.data[0].adminState
        }
      })
    },
    initBaseConfigDynamicFromModel: function() {
      setModel(this, 'baseForm')
      setModel(this, 'accessForm')
      setModel(this, 'tagForm')
    },
    getRefComponent: function(_this, childName, componentName) {
      if (typeof componentName === 'undefined') {
        return this.$refs[childName]
      } else {
        return this.$refs[childName].$refs[componentName]
      }
    },
    handleSubmit: function() {
      const baseData = Object.assign(
        {
          nid: this.connectionNid,
          protocol: this.connectionType,
          deviceNid: this.deviceNid,
          agwId: this.agwId
        },
        this.baseForm.dynamicFormModel
      )
      const accessData = {
        accessOptions: Object.assign(
          {
            protocol: this.connectionType,
            agwId: this.agwId
          },
          this.accessForm.dynamicFormModel
        )
      }

      if (
        this.connectionType === 'IEC101' ||
        this.connectionType === 'IEC104'
      ) {
        accessData.accessOptions = Object.assign(
          {},
          accessData.accessOptions,
          this.subStationModel,
          { substationmode: this.subStationModeTableData }
        )
      }

      let submitFlag = true
      let errorMsg = ''

      if (
        this.connectionType !== 'MODBUS_RTU' &&
        this.connectionType !== 'MODBUS_TCP' &&
        !this.isUpdate
      ) {
        if (
          this.connectionType === 'OPCDA' ||
          this.connectionType === 'DF1' ||
          this.connectionType === 'IEC101' ||
          this.connectionType === 'IEC104' ||
          this.connectionType === 'CIP' ||
          this.connectionType === 'OMRON' ||
          this.connectionType === 'BACNET' ||
          this.connectionType === 'BECKHOFF_ADSNET' ||
          this.connectionType === 'MITSUBISH_MC' ||
          this.connectionType === 'SIEMENS_S7' ||
          this.connectionType === 'OPCUA'
        ) {
          if (this.readCount >= 1 && this.configType === 1) {
            submitFlag = false
            errorMsg = '该协议仅支持一条读取连接'
          } else if (this.writeCount >= 1 && this.configType === 2) {
            submitFlag = false
            errorMsg = '该协议仅支持一条写入连接'
          }
        } else {
          if (this.readCount >= 1) {
            submitFlag = false
            errorMsg = '该协议仅支持一条读取连接'
          }
        }
      }

      const data = Object.assign(baseData, accessData)
      this.$refs['baseInfo'].$refs['baseForm'].validate((valid) => {
        this.$refs['accessOptions'].$refs['accessForm'].validate((valid2) => {
          if (valid && valid2) {
            if (submitFlag) {
              save(data).then((response) => {
                this.$notify({
                  message: '保存成功',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.initList()
              })
              this.connectionVisible = false
            } else {
              this.$notify({
                message: errorMsg,
                type: 'error',
                duration: 2000
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      })
    },
    handleCreate: function() {
      this.connectionVisible = true
      this.tagTableVisible = 'hidden'
      this.connectionNid = ''
      this.configType = 1
      this.isUpdate = false
      this.baseForm.dynamicFormModel.configType = 1
      this.dataTitle = '新增连接'
    },
    handleUpdate: function(row) {
      this.tagTableVisible = 'hidden'
      this.connectionNid = row.nid
      this.dataTitle = '修改连接'
      this.configType = row.configType
      this.isUpdate = true
      this.baseForm.dynamicFormModel.configType = row.configType
      this.initFormData('baseForm', row)
      const accessFormObject = JSON.parse(row.jsonAccessOptions)
      if (accessFormObject.protocol === 'OMRON') {
        if (accessFormObject.model === 'HOST_LINK') {
          this.accessForm.dynamicFormModel.model = 'HOST_LINK'
          this.$nextTick(() => {
            const ct = 'OMRON_HOST_LINK'
            this.accessForm.formData = connectionData[ct]
            this.accessForm.dynamicFormModel = accessFormObject
          })
        }
      } else {
        this.initFormData('accessForm', accessFormObject)
      }
      if (
        accessFormObject.protocol === 'IEC101' ||
        accessFormObject.protocol === 'IEC104'
      ) {
        _.each(accessFormObject.substationmode, (val) => {
          _.set(val, 'edit', false)
          if (val.fullcodevalue !== undefined) {
            val.fullcodevalue = val.fullcodevalue.toFixed(2)
          }
          if (val.coefficient !== undefined) {
            val.coefficient = val.coefficient.toFixed(2)
          }
        })
        this.subStationModeTableData = accessFormObject.substationmode
        this.subStationModel.substationmodetype =
          accessFormObject.substationmodetype
      }
      this.connectionVisible = true
    },
    handleDelete: function(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteNid(row.nid).then((response) => {
            this.$notify({
              type: 'success',
              message: '删除成功!'
            })
            this.tagTableVisible = 'hidden'
            this.initList()
          })
        })
        .catch(() => {})
    },
    handleSet: function(row) {
      this.tagTableVisible = 'visible'
      const itemName = row.configType === 1 ? '读取位' : '写入位'
      this.connectionName = row.configName + itemName + '配置:'
      this.fileTitle =
        row.configName + (row.configType === 1 ? '_read' : '_write') + '_config'
      this.connectionNid = row.nid
      this.configType = row.configType
      this.initTagList()
    },
    initTagList: function() {
      const _this = this
      _this.tagTableData = []
      const params = Object.assign(
        { configNid: this.connectionNid, configType: this.configType },
        this.tagQuery
      )
      listTag(params).then((response) => {
        const result = response.data
        const deviceinfo = this.deviceInfoName
        if (result !== undefined) {
          if (deviceinfo === '') {
            _this.tagsTableCount = response.totalRowCount
            _.each(result, function(value) {
              _this.tagTableData.push(
                Object.assign({ nid: value.nid }, JSON.parse(value.accessData))
              )
            })
          } else {
            _.each(result, function(value) {
              if ((JSON.parse(value.accessData).dataName).indexOf(deviceinfo) != -1) {
                _this.tagTableData.push(
                  Object.assign(
                    { nid: value.nid },
                    JSON.parse(value.accessData)
                  )
                )
              }
            })
            _this.tagsTableCount = _this.tagTableData.length
          }
          this.initTagCommands()
        }
      })
    },
    handleTagCreate: function() {
      this.tagNid = ''
      this.tagVisible = true
      this.isTagUpdate = false
    },
    handleTagUpload: function() {
      this.editDialogTitle = '导入配置文件'
      this.uploadData = {
        protocol: this.connectionType,
        tagColumnData: JSON.stringify(this.tagColumnData),
        configNid: this.connectionNid,
        configType: this.configType,
        deviceNid: this.deviceNid,
        profileNid: this.profileNid
      }
      this.fileDialogVisible = true
    },
    handleExportFile: function() {
      let headers = ''
      let columnData = ''
      this.tagColumnData.forEach((element) => {
        headers = headers + element.label + ','
        columnData = columnData + element.name + ','
      })
      window.open(
        process.env.VUE_APP_BASE_API +
          '/ddaconfig/exportFile?headers=' +
          headers +
          '&title=' +
          this.fileTitle +
          '&protocol=' +
          this.connectionType +
          '&configType=' +
          this.configType +
          '&tagColumnData=' +
          columnData +
          '&configId=' +
          this.connectionNid
      )
    },
    handleTagDownload: function() {
      let headers = ''
      this.tagColumnData.forEach((element) => {
        headers = headers + element.label + ','
      })
      window.open(
        process.env.VUE_APP_BASE_API +
          '/ddaconfig/downloadModel?headers=' +
          headers +
          '&title=' +
          this.fileTitle +
          '&protocol=' +
          this.connectionType +
          '&configType=' +
          this.configType
      )
    },
    deleteAll: function() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            configNid: this.connectionNid,
            configType: this.configType
          }
          deleteAll(params).then((res) => {
            if (res.success) {
              this.$notify({
                message: '删除成功',
                type: 'success'
              })
              this.initTagList()
            }
          })
        })
        .catch(() => {})
    },
    handleTagUpdate: function(row) {
      this.tagVisible = true
      this.isTagUpdate = true
      this.tagNid = row.nid
      if (this.configType === 1) {
        this.tagCommands.readCommands.push(row.dataName)
      } else if (this.configType === 2) {
        this.tagCommands.writeCommands.push(row.dataName)
      }
      this.initFormData('tagForm', row)
    },
    handleTagSubmit: function() {
      let data = {}
      if (this.connectionType === 'MODBUS_RTU' && this.configType === 1) {
        data = Object.assign(
          {},
          {
            nid: this.tagNid,
            configNid: this.connectionNid,
            configType: this.configType
          },
          {
            accessData: JSON.stringify(
              Object.assign(
                {
                  protocol: this.connectionType,
                  functionCode: null,
                  offset: null
                },
                this.tagForm.dynamicFormModel
              )
            )
          }
        )
      } else {
        data = Object.assign(
          {},
          {
            nid: this.tagNid,
            configNid: this.connectionNid,
            configType: this.configType
          },
          {
            accessData: JSON.stringify(
              Object.assign(
                { protocol: this.connectionType },
                this.tagForm.dynamicFormModel
              )
            )
          }
        )
      }
      this.$refs['tagInfo'].$refs['tagForm'].validate((valid) => {
        if (valid) {
          saveTag(data).then((response) => {
            this.$notify({
              message: '保存成功',
              type: 'success',
              duration: this.$store.state.settings.duration
            })
            this.initTagList()
          })
          this.tagVisible = false
        } else {
          console.info('error submit')
        }
      })
    },
    handleTagDelete: function(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTagNid(row.nid).then((response) => {
            this.$notify({
              type: 'success',
              message: '删除成功!'
            })
            this.initTagList()
          })
        })
        .catch(() => {})
    },
    initFormData: function(formName, formData) {
      const _this = this
      this.$nextTick(function() {
        _.forIn(this[formName].dynamicFormModel, function(formItem, key) {
          _this[formName].dynamicFormModel[key] = formData[key]
        })
      })
    },
    handleSubStationCreate: function() {
      this.subStationModeTableData.push({
        telemetry_id: '',
        attribute: '',
        fullcodevalue: '',
        coefficient: '',
        unit: '',
        edit: true
      })
    },
    handleSubStationDelete: function(row) {
      this.subStationModeTableData = _.without(
        this.subStationModeTableData,
        row
      )
    },
    confirmEdit(row) {
      row.edit = false
    },
    resetDataForm: function() {
      this.resetForm('baseInfo', 'baseForm')
      this.resetForm('accessOptions', 'accessForm')
      if (
        this.connectionType === 'IEC101' ||
        this.connectionType === 'IEC104'
      ) {
        this.subStationModeTableData = []
        this.subStationModel.substationmodetype = 1
      }
    },
    resetForm: function(refName, formName) {
      if (refName === 'tagInfo' && this.isTagUpdate) {
        if (this.configType === 1) {
          this.tagCommands.readCommands = _.without(
            this.tagCommands.readCommands,
            this.tagForm.dynamicFormModel.dataName
          )
        } else if (this.configType === 2) {
          this.tagCommands.writeCommands = _.without(
            this.tagCommands.writeCommands,
            this.tagForm.dynamicFormModel.dataName
          )
        }
      }
      this.$refs[refName].$refs[formName].resetFields()
      this.baseForm.dynamicFormModel.configType = ''
    },
    resetQueryForm() {
      this.deviceInfoName = ''
    },
    closeDialog: function() {
      this.fileDialogVisible = false
      this.$refs.resourceFileForm.resetFields()
      this.uploadData = {}
      this.errorTableData = []
      this.fileList.shift()
      this.initTagList()
    },
    handleRemove(file, fileList) {},
    onError(err, file, fileList) {
      console.info(err)
      this.loadings.close()
      this.closeDialog()
      this.$notify.error({
        title: '错误',
        message: '上传失败！'
      })
    },
    onProgress(event, file, fileList) {
      // console.log(file.percentage)
      this.loadings = this.$loading({
        lock: true,
        text: '正在上传中...',
        fontSize: '100px',
        spinner: 'el-icon-loading',
        spinnerColor: 'red',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    handleSuccess(response, file, fileList) {
      this.loadings.close()
      if (response.success) {
        if (response.errorList.length === 0) {
          this.$notify({
            message: '上传成功!',
            type: 'success'
          })
        }
        this.errorTableData = response.errorList
        if (this.errorTableData.length === 0) {
          this.fileDialogVisible = false
        }
      } else {
        fileList.shift()
        this.$notify.error({
          title: '错误',
          message: response.message
        })
      }
    },
    beforeUpload(file) {
      this.$refs.resourceFileForm.resetFields()
      this.errorTableData.length = 0
    },
    findTaskByAgwId() {
      this.agwIdList.agwId = this.agwId
      findTaskByAgwId(this.agwIdList)
        .then((response) => {
          if (response.success) {
            this.deployTasks = response.data
            if (this.deployTasks !== null) {
              this.createTime = this.deployTasks.executeTime
            }
            this.feEdgeDevice = response.edge
            this.status = this.feEdgeDevice.status
          } else {
            this.dcDeviceTopiclist = []
            this.createTime = ''
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    openFullScreen() {
      if (this.type === '1') {
        const loading = this.$loading({
          lock: true,
          text: '正在部署中...',
          fontSize: '100px',
          spinner: 'el-icon-loading',
          spinnerColor: 'red',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.agwIdList.agwId = this.agwId
        flushEdgeAgw(this.agwIdList)
          .then((response) => {
            if (response.success) {
              if (response.msg !== '网关离线') {
                if (response.success) {
                  loading.close()
                  this.$notify({
                    message: '网关部署成功!',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                } else {
                  loading.close()
                  this.$notify.error({
                    title: '错误',
                    message: '网关部署失败！'
                  })
                }
                this.findTaskByAgwId()
              } else {
                loading.close()
                this.$confirm(
                  '该网关不在线，部署任务将在网关上线后自行执行，请确认是否执行？',
                  '提示',
                  {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }
                )
                  .then(() => {
                    offLIneEdgeAgw(this.agwIdList).then((response) => {
                      if (response.success) {
                        loading.close()
                        this.$notify({
                          message: '网关进入待部署状态!',
                          type: 'success',
                          duration: this.$store.state.settings.duration
                        })
                      } else {
                        loading.close()
                        this.$notify.error({
                          title: '错误',
                          message: '请求出错！'
                        })
                      }
                    })
                  })
                  .catch(() => {
                    loading.close()
                  })
                this.findTaskByAgwId()
              }
            } else {
              loading.close()
              this.$notify.error({
                title: '错误',
                message: '请求出错！'
              })
            }
          })
          .catch((error) => {
            loading.close()
            console.log(error)
          })
      } else if (this.type === '2') {
        if (!this.status) {
          this.$notify({
            message: '节点不在线，暂无法部署!',
            type: 'warning'
          })
        } else {
          const loading = this.$loading({
            lock: true,
            text: '正在部署中...',
            fontSize: '100px',
            spinner: 'el-icon-loading',
            spinnerColor: 'red',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.agwIdList.agwId = this.edgeDeviceId
          flushNodeAgw(this.agwIdList)
            .then((response) => {
              if (response.success) {
                loading.close()
                this.$notify({
                  message: '节点部署成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
              } else {
                loading.close()
                this.$notify.error({
                  title: '错误',
                  message: '节点部署失败！'
                })
              }
              this.findTaskByAgwId()
            })
            .catch((error) => {
              loading.close()
              console.log(error)
            })
        }
      }
    },
    queryById() {
      this.deviceIdList.nid = this.deviceNid
      findByNid(this.deviceIdList)
        .then((response) => {
          if (response.success) {
            this.neDevice = response.data
          } else {
            this.neDevice = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    queryCommandFieldList(param) {
      this.deviceIdList.nid = this.deviceNid
      queryCommandFieldList(this.deviceIdList)
        .then((response) => {
          if (response.success) {
            this.commandList = response.data
          } else {
            this.commandList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    test() {
      this.$nextTick(() => {
        if (this.neDevice.deviceId === '') {
          this.$confirm('请先部署设备！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {})
            .catch((error) => {
              console.log(error)
            })
        } else {
          this.deviceNids.deviceNid = this.neDevice.nid
          this.queryCommandFieldList(this.neDevice)
          this.profileNames.profileName = this.neDevice.profileName
          this.testDevice.profileNid = this.neDevice.profileNid
          this.testDevice.agwId = this.neDevice.agwId
          this.testDevice.deviceNid = this.neDevice.nid
          this.testDevice.connectProtocol = this.neDevice.connectProtocol
          this.protocol = this.neDevice.connectProtocol
          this.contextTest = null

          task(this.deviceNids).then((response) => {
            if (response.success) {
              getProfilePath(this.testDevice)
                .then((response) => {
                  if (response.success) {
                    this.testVisible = true
                    this.pathTask = response.data
                    this.pathTest = this.pathTask[0].name
                    this.pathTestName = this.pathTask[0].path
                    this.accesslist = response.value
                    this.testType = 1
                    this.jsonTest = null
                  } else {
                    this.$notify({
                      title: '错误',
                      message: response.message,
                      type: 'warning'
                    })
                    this.pathTask = []
                    this.accesslist = []
                  }
                })
                .catch((error) => {
                  console.log(error)
                })
            }
          })
        }
      })
    },
    closeTestDialog() {
      this.testVisible = false
      this.resetTest()
    },
    testTypeChange() {
      this.resetTest()
    },
    resetTest() {
      this.testContent = ''
      this.testContentLabel = ''
      this.contextResult = true
      var divs = document.getElementById('context')
      divs.innerHTML = ''
      var div = document.getElementById('contextTest1')
      div.innerHTML = ''
      this.jsonTest = null
      this.contextTest = null
    },
    searchContext(pathTest) {
      this.contextResult = true
      this.contextTest = null
      var divs = document.getElementById('context')
      divs.innerHTML = ''
      var DIV = document.getElementById('contextTest1')
      DIV.innerHTML = ''
      this.Path.textTask = pathTest
      this.Path.agwId = this.agwId
      var testPath = '{}'
      if (this.testContentLabel !== '') {
        testPath =
          '{"' + this.testContentLabel + '":"' + this.testContent + '"}'
      }
      if (this.testType === 1) {
        const loading = this.$loading({
          lock: true,
          text: '正在测试中...',
          fontSize: '100px',
          spinner: 'el-icon-loading',
          spinnerColor: 'red',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        searchContext(this.Path)
          .then((response) => {
            this.context = response.data
            if (response.success) {
              loading.close()
              this.jsonTest = response.data
              this.activeNames = ''
              var div = document.getElementById('context')
              if (this.jsonTest === '') {
                div.innerHTML = '无返回结果'
              } else {
                this.contextTest = JSON.parse(this.jsonTest)
              }
            } else {
              loading.close()
              this.jsonTest = null
              this.contextResult = false
              this.activeNames = ''
              var divs = document.getElementById('context')
              divs.innerHTML =
                'com.certus.okr.support.HttpClientUtils$HttpClientException: Read timed out; nested exception is java.net.SocketTimeoutException: Read timed out'
            }
          })
          .catch((error) => {
            loading.close()
            this.contextResult = false
            this.activeNames = ''
            var div = document.getElementById('contextTest1')
            div.innerHTML = error
            console.log(error)
          })
      } else {
        if (this.testContentLabel === '') {
          this.$notify.error({
            title: '错误',
            message: '请选择属性名！'
          })
        } else if (this.testContent === '') {
          this.$notify.error({
            title: '错误',
            message: '请输入属性值！'
          })
        } else {
          const loading = this.$loading({
            lock: true,
            text: '正在测试中...',
            fontSize: '100px',
            spinner: 'el-icon-loading',
            spinnerColor: 'red',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          searchContextTest(pathTest, this.agwId, testPath)
            .then((response) => {
              this.context = response.data
              if (response.success) {
                loading.close()
                this.context = response.data
                this.jsonTest = response.data
                this.activeNames = ''
                var Div = document.getElementById('context')
                if (this.jsonTest === '') {
                  Div.innerHTML = '测试成功'
                } else {
                  this.contextTest = JSON.parse(this.jsonTest)
                }
              } else {
                loading.close()
                this.jsonTest = {}
                this.contextResult = false
                this.activeNames = ''
                var divs = document.getElementById('context')
                divs.innerHTML =
                  'com.certus.okr.support.HttpClientUtils$HttpClientException: Read timed out; nested exception is java.net.SocketTimeoutException: Read timed out'
              }
            })
            .catch((error) => {
              loading.close()
              this.contextResult = false
              this.activeNames = ''
              var div = document.getElementById('contextTest1')
              div.innerHTML = error
              console.log(error)
            })
        }
      }
    },
    deploy() {
      this.listQuery.deployEdge = this.agwId
      this.viewConfigDialogVisible = true
      this.getList()
    },
    getList() {
      this.listQuery.deployEdge = this.agwId
      this.listLoading = true
      getList(this.listQuery).then((response) => {
        if (response.success) {
          this.list = response.data
          this.total = response.totalRowCount
        } else {
          this.list = []
          this.total = 0
        }
        this.listLoading = false
      })
    },
    closePartnerViewConfigDialog() {
      this.viewConfigDialogVisible = false
      this.listQuery = {
        deployEdge: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'deployTime',
        order: 'desc'
      }
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
.tagForm > div:first-child {
  width: 100px !important;
  text-align: right;
  margin-right: 0px;
}
.el-collapse {
  border: 1px solid #ebeef5;
}
.el-collapse-item__header.is-active {
  border-bottom-color: #ebeef5;
}
.el-collapse-item__header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 25px;
  line-height: 48px;
  background-color: #fff;
  color: #303133;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
  font-size: 12px;
  font-weight: 500;
  -webkit-transition: border-bottom-color 0.3s;
  transition: border-bottom-color 0.3s;
  outline: 0;
  margin-left: 10px;
}
.el-collapse-item__content {
  font-size: 13px;
  color: #303133;
  line-height: 1.769230769230769;
  margin-left: 4px;
}
.el-loading-spinner .el-loading-text {
  color: $el-loading-spinner;
  margin: 3px 0;
  font-size: 14px;
}
.el-loading-spinner i {
  color: $el-loading-spinner;
}
</style>
