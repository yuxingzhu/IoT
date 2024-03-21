<template>
  <div class="app-container">
    <div style="height:40px;width:100%;background-color: #fff;">
      <el-row>
        <el-col :span="19" style="font-size: 13px;font-weight: 400;font-family: 'Microsoft YaHei'">
          <span>模版名称：</span>{{ deviceInfo.deviceName }}
        </el-col>
      </el-row>
      <el-row style="color:rgba(96, 92, 92, 0.71);font-size: 12px;font-family: 'Microsoft YaHei';margin-top: 15px;">
        <el-col :span="10">
          <span>模版协议：</span>{{ connectionType }}
        </el-col>
      </el-row>
    </div>
    <el-divider />
    <div class="operation">
      <el-tooltip  class="item" effect="dark" content="新增" placement="bottom">
        <el-button icon="el-icon-plus" @click="handleCreate"/>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="返回" placement="bottom">
        <el-button @click="$router.back(-1)"><svg-icon icon-class="back" />返回</el-button>
      </el-tooltip>
    </div>
    <OperateTable :table-data="tableData" :column-data="columnData" :operation-hidden="true">
      <template #configButton="slotProp">
        <el-tooltip  class="item" effect="dark" content="修改" placement="bottom">
          <el-button icon="el-icon-edit" @click="handleUpdate(slotProp.row)" class="elbuttondefault">修改</el-button>
        </el-tooltip>
        <el-tooltip  class="item" effect="dark" content="删除" placement="bottom">
          <el-button icon="el-icon-delete" @click="handleDelete(slotProp.row)" class="elbuttondefault">删除</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="配置" placement="bottom">
          <el-button icon="el-icon-setting" @click="handleSet(slotProp.row)" class="elbuttondefault">配置</el-button>
        </el-tooltip>
      </template>
    </OperateTable>
    <div v-if="tagTableVisible == 'visible'" class="page-form">
      <FlexCard :title="connectionName">
        <div class="operation">
          <el-tooltip  class="item" effect="dark" content="新增" placement="bottom">
            <el-button @click="handleTagCreate"><i class="el-icon-plus" />新增</el-button>
          </el-tooltip>
          <el-input v-model.trim="deviceInfoName" :maxlength="20" style="width:200px" placeholder="属性" />
          <el-tooltip content="重置">
            <el-button icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
          </el-tooltip>
          <el-tooltip content="搜索">
            <el-button icon="el-icon-search" @click="initTagList" >搜索</el-button>
          </el-tooltip>
          <el-tooltip  class="item" effect="dark" content="导入" placement="bottom">
            <el-button @click="handleTagUpload"><i class="el-icon-upload" />导入</el-button>
          </el-tooltip>
          <el-tooltip  class="item" effect="dark" content="下载模版" placement="bottom">
            <el-button @click="handleTagDownload"><i class="el-icon-download" />下载</el-button>
          </el-tooltip>
          <el-tooltip  class="item" effect="dark" content="清空配置" placement="bottom">
            <el-button @click="deleteAll"><i class="el-icon-delete" />清空</el-button>
          </el-tooltip>
        </div>
        <OperateTable :table-data="tagTableData" :column-data="tagColumnData" >
          <template #configButton="slotProp">
            <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
              <el-button icon="el-icon-edit" @click="handleTagUpdate(slotProp.row)" class="elbuttondefault">修改</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button icon="el-icon-delete" @click="handleTagDelete(slotProp.row)" class="elbuttondefault">删除</el-button>
            </el-tooltip>
          </template>
        </OperateTable>
        <Pagination
          :total="tagsTableCount"
          :page.sync="tagQuery.page"
          :limit.sync="tagQuery.size"
          @pagination="initTagList"
        />
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
                    <el-button
                      v-if="row.edit"
                      type="success"
                      size="small"
                      icon="el-icon-check"
                      @click="confirmEdit(row)"
                    />
                    <el-button
                      v-if="!row.edit"
                      type="primary"
                      size="small"
                      icon="el-icon-edit"
                      @click="row.edit=!row.edit"
                    />
                    <el-button
                      v-if="!row.edit"
                      type="primary"
                      size="small"
                      icon="el-icon-delete"
                      @click="handleSubStationDelete(row)"
                    />
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FlexForm from '@/components/FlexForm/index'
import Pagination from '@/components/Pagination/index'
import OperateTable from '@/components/FlexTable/OperateTable/index'
import FlexCard from '@/components/FlexCard/index'
import CardForm from '@/components/FlexCard/CardForm/index'

import { list, save, deleteNid, listTag, saveTag, deleteTagNid, findDeviceInfo, deleteAll } from '@/api/connModel'
import { setModel } from '@/utils/form'

import { connectionData, connectionWriteData, tagData, writeTagData, tagTableColumnData, writeTagTableColumnData } from './consts/data'
import { fetchCommandName } from '../../api/connModel'

const _ = require('lodash')

export default {
  name: 'Connection',
  components: { OperateTable, FlexForm, Pagination, FlexCard, CardForm },
  data() {
    return {
      connectionName: '',
      isUpdate: false,
      isSubStationUpdate: false,
      isTagUpdate: false,
      modeId: 0,
      profileNid: 0,
      connectionId: '',
      agwId: 0,
      tagId: '',
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
        deviceName: ''
      },
      connectionVisible: false,
      tagTableVisible: 'hidden',
      tagVisible: false,
      subStationModel: {
        substationmodetype: 1
      },
      baseForm: {
        formData: [{
          type: 'input',
          name: 'configName',
          label: '连接名称',
          value: ''
        }, {
          type: 'input',
          name: 'endpoint',
          label: '地址',
          value: ''
        }],
        dynamicFormModel: { configType: '' },
        rules: {
          configName: { required: true, message: '请输入连接名称', trigger: 'blur' },
          endpoint: [{ required: true, message: '请输入地址', trigger: 'blur' }, {
            validator: (rule, value, callback) => {
              if (this.connectionType === 'MODBUS_TCP') {
                if (!/^(modbus\.tcp):\/\/((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))$/.test(value)) {
                  callback('地址格式：modbus.tcp://ip:port')
                } else {
                  callback()
                }
              } else if (this.connectionType === 'MODBUS_RTU') {
                callback()
              } else if (this.connectionType === 'HTTP') {
                if (!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(value)) {
                  callback('地址示例：http://www.sojson.com/open/api/weather/json.shtml')
                } else {
                  callback()
                }
              } else if (this.connectionType === 'MTCONNECT') {
                if (!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(value)) {
                  callback('地址示例：http://www.sojson.com/open/api/weather/json.shtml')
                } else {
                  callback()
                }
              } else if (this.connectionType === 'OPCUA') {
                if (!/^opc\.tcp:\/\/((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))(\/([0-9a-zA-Z\/]+)+)$/.test(value)) {
                  callback('地址格式：opc.tcp://ip:port/path_name')
                } else {
                  callback()
                }
              } else if (this.connectionType === 'MITSUBISH_MC' || this.connectionType === 'SIEMENS_S7' || this.connectionType === 'BECKHOFF_ADSNET') {
                if (!/^plc:\/\/((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))$/.test(value)) {
                  callback('地址格式:plc://ip:port')
                } else {
                  callback()
                }
              } else if (this.connectionType === 'CIP') {
                if (!/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/.test(value)) {
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
            }, trigger: 'change'
          }],
          configType: { required: true, message: '请选择连接类型', trigger: 'change' }
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
          model: [
            { required: true, message: '请选择型号', trigger: 'change' }
          ],
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
            { validator: (rule, value, callback) => {
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
            }, trigger: 'change' }
          ],
          valueIndex: [
            { required: true, message: '请输入读取位', trigger: 'change' },
            { validator: (rule, value, callback) => {
              if (!/^[1-9]\d*|0$/.test(value)) {
                callback('读取位为非负整数')
              }
              callback()
            }, trigger: 'change' }
          ],
          readMethod: [
            { required: true, message: '请选择读取方法', trigger: 'change' }
          ],
          valueExpression: [
            { required: true, message: '请输入表达式', trigger: 'blur' }
          ],
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
          ruleId: { required: true, message: '请输入数据标识', trigger: 'change' },
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
          items: [{
            key: 1,
            value: '读'
          }, {
            key: 2,
            value: '写'
          }]
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
      action: process.env.VUE_APP_BASE_API + '/connModel/uploadFile',
      uploadData: {},
      fileList: [],
      fileTitle: ''
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
        if (this.connectionType === 'MODBUS_RTU' || this.connectionType === 'MODBUS_TCP') {
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
    this.modeId = this.$route.query.modeId
    this.connectionType = this.$route.query.connectProtocol
    this.agwId = this.$route.query.agwId
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
  },
  methods: {
    configTypeChange: function(selValue) {
      this.configType = selValue
    },
    initTagCommands: function() {
      const params = {
        profileNid: this.profileNid,
        modeId: this.modeId
      }
      fetchCommandName(params).then(response => {
        this.tagCommands = response.data
      })
    },
    initList: function() {
      list(this.modeId).then(response => {
        this.tableData = response.data
        this.readCount = response.readCount
        this.writeCount = response.writeCount
      })
      findDeviceInfo(this.modeId).then((response) => {
        if (response.success) {
          this.deviceInfo.deviceName = response.data[0].modeName
        }
      })
    },
    initBaseConfigDynamicFromModel: function() {
      setModel(this, 'baseForm')
      setModel(this, 'accessForm')
      setModel(this, 'tagForm')
    },
    getRefComponent: function(_this, childName, componentName) {
      if (typeof (componentName) === 'undefined') {
        return this.$refs[childName]
      } else {
        return this.$refs[childName].$refs[componentName]
      }
    },
    handleSubmit: function() {
      const baseData = Object.assign({ id: this.connectionId, protocol: this.connectionType, modeId: this.modeId }, this.baseForm.dynamicFormModel)
      const accessData = {
        accessOptions: Object.assign({
          protocol: this.connectionType
        }, this.accessForm.dynamicFormModel)
      }

      if (this.connectionType === 'IEC101' || this.connectionType === 'IEC104') {
        accessData.accessOptions = Object.assign({}, accessData.accessOptions, this.subStationModel, { substationmode: this.subStationModeTableData })
      }

      let submitFlag = true
      let errorMsg = ''

      if (this.connectionType !== 'MODBUS_RTU' && this.connectionType !== 'MODBUS_TCP' && !this.isUpdate) {
        if (this.connectionType === 'OPCDA' || this.connectionType === 'DF1' || this.connectionType === 'IEC101' || this.connectionType === 'IEC104' || this.connectionType === 'CIP' || this.connectionType === 'OMRON' || this.connectionType === 'BACNET' || this.connectionType === 'BECKHOFF_ADSNET' || this.connectionType === 'MITSUBISH_MC' || this.connectionType === 'SIEMENS_S7' || this.connectionType === 'OPCUA') {
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
              save(data).then(response => {
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
      this.connectionId = ''
      this.configType = 1
      this.isUpdate = false
      this.baseForm.dynamicFormModel.configType = 1
      this.dataTitle = '新增连接'
    },
    handleUpdate: function(row) {
      this.tagTableVisible = 'hidden'
      this.connectionId = row.id
      this.modeId = row.modeId
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
          }
          )
        }
      } else {
        this.initFormData('accessForm', accessFormObject)
      }
      if (accessFormObject.protocol === 'IEC101' || accessFormObject.protocol === 'IEC104') {
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
        this.subStationModel.substationmodetype = accessFormObject.substationmodetype
      }
      this.connectionVisible = true
    },
    handleDelete: function(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNid(row.id).then(response => {
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
          this.tagTableVisible = 'hidden'
          this.initList()
        })
      }).catch(() => {
      })
    },
    handleSet: function(row) {
      this.tagTableVisible = 'visible'
      const itemName = row.configType === 1 ? '读取位' : '写入位'
      this.connectionName = row.configName + itemName + '配置:'
      this.fileTitle = row.configName + (row.configType === 1 ? '_read' : '_write') + '_config'
      this.connectionId = row.id
      this.configType = row.configType
      this.initTagList()
    },
    initTagList: function() {
      const _this = this
      _this.tagTableData = []
      const params = Object.assign({ accessId: this.connectionId, configType: this.configType }, this.tagQuery)
      listTag(params).then(response => {
        const result = response.data
        const deviceinfo = this.deviceInfoName
        if (result !== undefined) {
          if (deviceinfo === '') {
            _this.tagsTableCount = response.totalRowCount
            _.each(result, function(value) {
              _this.tagTableData.push(Object.assign({ id: value.id }, JSON.parse(value.accessData)))
            })
          } else {
            _.each(result, function(value) {
              if ((JSON.parse(value.accessData)).dataName === deviceinfo) {
                _this.tagTableData.push(Object.assign({ id: value.id }, JSON.parse(value.accessData)))
              }
            })
            _this.tagsTableCount = _this.tagTableData.length
          }
          this.initTagCommands()
        }
      })
    },
    handleTagCreate: function() {
      this.tagId = ''
      this.tagVisible = true
      this.isTagUpdate = false
    },
    handleTagUpload: function() {
      this.editDialogTitle = '导入配置文件'
      this.uploadData = {
        protocol: this.connectionType,
        tagColumnData: JSON.stringify(this.tagColumnData),
        accessId: this.connectionId,
        configType: this.configType,
        modeId: this.modeId,
        profileNid: this.profileNid
      }
      this.fileDialogVisible = true
    },
    handleTagDownload: function() {
      let headers = ''
      this.tagColumnData.forEach(element => {
        headers = headers + element.label + ','
      })
      window.open(process.env.VUE_APP_BASE_API + '/ddaconfig/downloadModel?headers=' + headers + '&title=' + this.fileTitle + '&protocol=' + this.connectionType + '&configType=' + this.configType)
    },
    deleteAll: function() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          accessId: this.connectionId,
          configType: this.configType
        }
        deleteAll(params).then(res => {
          if (res.success) {
            this.$notify({
              message: '删除成功',
              type: 'success'
            })
            this.initTagList()
          }
        })
      }).catch(() => {
      })
    },
    handleTagUpdate: function(row) {
      this.tagVisible = true
      this.isTagUpdate = true
      this.tagId = row.id
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
        data = Object.assign({}, { id: this.tagId, accessId: this.connectionId, configType: this.configType }, { accessData: JSON.stringify(Object.assign({ protocol: this.connectionType, functionCode: null, offset: null }, this.tagForm.dynamicFormModel)) })
      } else {
        data = Object.assign({}, { id: this.tagId, accessId: this.connectionId, configType: this.configType }, { accessData: JSON.stringify(Object.assign({ protocol: this.connectionType }, this.tagForm.dynamicFormModel)) })
      }
      this.$refs['tagInfo'].$refs['tagForm'].validate((valid) => {
        if (valid) {
          saveTag(data).then(response => {
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
      }).then(() => {
        deleteTagNid(row.id).then(response => {
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
          this.initTagList()
        })
      }).catch(() => {
      })
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
      this.subStationModeTableData = _.without(this.subStationModeTableData, row)
    },
    confirmEdit(row) {
      row.edit = false
    },
    resetDataForm: function() {
      this.resetForm('baseInfo', 'baseForm')
      this.resetForm('accessOptions', 'accessForm')
      if (this.connectionType === 'IEC101' || this.connectionType === 'IEC104') {
        this.subStationModeTableData = []
        this.subStationModel.substationmodetype = 1
      }
    },
    resetForm: function(refName, formName) {
      if (refName === 'tagInfo' && this.isTagUpdate) {
        if (this.configType === 1) {
          this.tagCommands.readCommands = _.without(this.tagCommands.readCommands, this.tagForm.dynamicFormModel.dataName)
        } else if (this.configType === 2) {
          this.tagCommands.writeCommands = _.without(this.tagCommands.writeCommands, this.tagForm.dynamicFormModel.dataName)
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
    }
  }
}
</script>

<style lang="scss">
.tagForm>div:first-child{
  width: 100px !important;
  text-align: right;
  margin-right: 0px;
}
</style>
