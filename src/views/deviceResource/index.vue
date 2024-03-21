<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="24" class="table-filter">
            <el-form ref="filterForm" :inline="true" :model="listQuery" label-width="0px" class="filterForm" @submit.native.prevent>

              <el-form-item prop="projectId" placeholder="项目名称">
                <el-select v-model.trim="listQuery.projectId" placeholder="项目名称" @change="initAgwtList(listQuery.projectId)">
                  <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id" />
                </el-select>
              </el-form-item>

              <el-form-item prop="agwId" placeholder="网关名称">
                <el-select v-model.trim="listQuery.agwId" placeholder="网关名称" @change="initAgwtListdata(listQuery.agwId)">
                  <el-option v-for="item in egwList" :key="item.edgeDeviceId" :label="item.edgeDeviceName" :value="item.edgeDeviceId" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-input v-model.trim="listQuery.deviceName" :maxlength="20" placeholder="设备名称" />
              </el-form-item>
              <el-form-item>
                <el-select v-model.trim="listQuery.connectProtocol" style="width: 180px" placeholder="连接协议">
                  <el-option label="MODBUS_TCP" value="MODBUS_TCP" />
                  <el-option label="MODBUS_RTU" value="MODBUS_RTU" />
                  <el-option label="OPCUA" value="OPCUA" />
                  <el-option label="HTTP" value="HTTP" />
                  <el-option label="MITSUBISH_MC" value="MITSUBISH_MC" />
                  <el-option label="SIEMENS_S7" value="SIEMENS_S7" />
                  <el-option label="OMRON" value="OMRON" />
                  <el-option label="DLT645" value="DLT645" />
                  <el-option label="DLT645_1997" value="DLT645_1997" />
                  <el-option label="DF1" value="DF1" />
                  <el-option label="IEC101" value="IEC101" />
                  <el-option label="IEC104" value="IEC104" />
                  <el-option label="CIP" value="CIP" />
                  <el-option label="OPCDA" value="OPCDA" />
                  <el-option label="BACNET" value="BACNET" />
                  <el-option label="BECKHOFF_ADSNET" value="BECKHOFF_ADSNET" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model.trim="listQuery.deviceStatus" style="width: 180px" placeholder="在线状态">
                  <el-option label="在线" value="true" />
                  <el-option label="离线" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-tooltip content="重置">
                  <el-button icon="el-icon-refresh" @click="resetQueryForm"/>
                </el-tooltip>
                <el-tooltip content="搜索">
                  <el-button icon="el-icon-search" @click="getList"/>
                </el-tooltip>
                <el-tooltip content="导出数据">
                  <el-button icon="el-icon-download"  @click="onload"/>
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-table ref="multipleTable" v-loading="listLoading" :data="list" stripe size="mini" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" cell-class-name="table_cell">
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column label="项目名称" prop="projectName" align="center" />
        <el-table-column label="网关名称" prop="edgeDeviceName" align="center" />
        <el-table-column label="设备名称" prop="deviceName" align="center" />
        <el-table-column label="网关类型" prop="gatewayCategory" align="center" />
        <el-table-column label="设备编码" prop="deviceEncoding" width="200" align="center" />
        <el-table-column label="设备型号" prop="deviceModel" width="200" align="center" />
        <el-table-column label="设备位置" prop="deviceLocations" width="200" align="center" />
        <el-table-column label="数据模型" prop="profileName" align="center">
          <template scope="scope">
            <span class="shou" @click="findList(scope.row.profileNid,scope.row.profileName)">{{ scope.row.profileName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="连接协议" prop="connectProtocol" align="center" />
        <el-table-column label="设备地址" prop="endPoint" align="center" width="150" />
        <el-table-column label="在线状态" prop=" deviceStatus" align="center">
          <template slot-scope="scope">
            <svg-icon
              :icon-class="
                scope.row.edgeStatue === false
                  ? 'online'
                  : scope.row.deviceStatus
                    ? 'online'
                    : 'online'
              "
            />
            {{
              scope.row.edgeStatue === false
                ? "在线"
                : scope.row.deviceStatus
                  ? "在线"
                  : "在线"
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="设备状态" prop="showAdminState" align="center">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.showAdminState ? 'unlock' : 'lock'" />
            {{ scope.row.adminState === "UNLOCKED" ? "启用" : "停用" }}
          </template>
        </el-table-column>
        <el-table-column label="任务状态" prop="runOnce" align="center">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.runOnce ? 'run' : 'stop'" />
            {{ scope.row.runOnce ? "启用" : "停用" }}
          </template>
        </el-table-column>
        <el-table-column label="任务执行频率" prop="translate" align="center">
          <template slot-scope="scope">
            {{ scope.row.runOnce ? scope.row.translate : "" }}
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template slot-scope="scope">
            <el-tooltip  content="修改" placement="bottom">
              <el-button size="small"  :disabled="scope.row.gatewayCategory =='工业级DTU'" icon="el-icon-edit" @click="openPartnerEditDialog('edit',scope.row)" class="elbuttondefault" />
            </el-tooltip>
            <el-tooltip  content="测试" placement="bottom" style="margin-left: 1px">
              <el-button size="small" :disabled="!scope.row.edgeStatue && scope.row.type == 1" icon="el-icon-paperclip" @click="test(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
            <!-- <el-tooltip  content="采集任务配置" placement="bottom" style="margin-left: 1px">
              <el-button size="small" icon="el-icon-setting" @click="task(scope.row)" />
            </el-tooltip> -->
            <el-tooltip content="配置协议" placement="bottom" style="margin-left: 1px">
              <el-button size="small" icon="el-icon-s-ticket" @click="openConfigDevice(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
            <el-tooltip content="查看数据" placement="bottom" style="margin-left:1px">
              <el-button size="small" icon="el-icon-notebook-2" @click="openDataView(scope.row)" class="elbuttondefault"/>
            </el-tooltip>
            <!-- <el-tooltip  content="删除" placement="bottom" style="margin-left: 1px">
              <el-button size="small" icon="el-icon-delete" @click="deletePartner(scope.row)" />
            </el-tooltip>
            <el-tooltip  content="更多操作" placement="bottom" style="margin-left: 1px">
              <el-dropdown @command="handlePartnerCmd(arguments[0], scope.row)">
                <el-button icon="el-icon-more" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="copy">复制</el-dropdown-item>
                  <el-dropdown-item command="copyMode">设为模板</el-dropdown-item>
                  <el-dropdown-item command="updateState">
                    {{
                      scope.row.adminState === "UNLOCKED" ? "停用" : "启用"
                    }}设备</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <el-dialog :title="editDialogTitle" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="closeEditDialog">
        <div>
          <el-form ref="feDeviceAddressEditForm" :model="feDeviceAddressEditForm" :rules="feDeviceAddressEditRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="项目名称" prop="" >
                  <el-col :span="22">
                    <el-input v-model.trim="feDeviceAddressEditForm.projectName" :maxlength="200"  :disabled="true"/>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="网关名称" prop="">
                  <el-col :span="22">
                    <el-input v-model.trim="feDeviceAddressEditForm.edgeDeviceName" :maxlength="200" :disabled="true"/>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="设备名称" prop="">
                  <el-col :span="22">
                    <el-input v-model.trim="feDeviceAddressEditForm.deviceName" :maxlength="200" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="设备编码" prop="">
                  <el-col :span="22">
                    <el-input v-model.trim="feDeviceAddressEditForm.deviceEncoding" :maxlength="200" :disabled="true"/>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="设备型号" prop="">
                  <el-col :span="22">
                    <el-input v-model.trim="feDeviceAddressEditForm.deviceModel" :maxlength="200" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="设备位置" prop="">
                  <el-col :span="22">
                    <el-input v-model.trim="feDeviceAddressEditForm.deviceLocations" :maxlength="200" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="设备地址" prop="">
                  <el-col :span="22">
                    <el-input v-model.trim="feDeviceAddressEditForm.addrId" :maxlength="200" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="连接协议" prop="connectProtocol">
                  <el-col :span="22">
                    <el-select v-model.trim="feDeviceAddressEditForm.connectProtocol" style="width: 100%" disabled>
                      <el-option label="MODBUS_TCP" value="MODBUS_TCP" />
                      <el-option label="MODBUS_RTU" value="MODBUS_RTU" />
                      <el-option label="OPCUA" value="OPCUA" />
                      <el-option label="HTTP" value="HTTP" />
                      <el-option label="MITSUBISH_MC" value="MITSUBISH_MC" />
                      <el-option label="SIEMENS_S7" value="SIEMENS_S7" />
                      <el-option label="OMRON" value="OMRON" />
                      <el-option label="DLT645" value="DLT645" />
                      <el-option label="DLT645_1997" value="DLT645_1997" />
                      <el-option label="DF1" value="DF1" />
                      <el-option label="IEC101" value="IEC101" />
                      <el-option label="IEC104" value="IEC104" />
                      <el-option label="CIP" value="CIP" />
                      <el-option label="OPCDA" value="OPCDA" />
                      <el-option label="BACNET" value="BACNET" />
                      <el-option label="BECKHOFF_ADSNET" value="BECKHOFF_ADSNET" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="数据模型" prop="profileNid">
                  <el-col :span="22">
                    <el-select disabled v-model.trim="feDeviceAddressEditForm.profileNid" style="width: 100%" @change="findFile(feDeviceAddressEditForm.profileNid)">
                      <el-option v-for="item in feProfileList" :key="item.nid" :label="item.profileName" :value="item.nid" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="设备状态" prop="adminState">
                  <el-col :span="22">
                    <el-select v-model.trim="feDeviceAddressEditForm.adminState" style="width: 100%">
                      <el-option label="启用" value="UNLOCKED" />
                      <el-option label="停用" value="LOCKED" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="在线状态">
                  <el-col :span="22">
                    <el-select v-model.trim="feDeviceAddressEditForm.deviceStatus"  placeholder="在线" style="width: 100%" disabled>
                      <el-option label="在线" :value="true" />
                      <el-option label="在线" :value="false"/>
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
      <el-dialog :title="editDialogTitle" :visible.sync="viewVisible" style="width: 190%; margin-left: -40%" :close-on-click-modal="false" @close="closeDialog">
        <el-table ref="multipleTable" v-loading="listLoading" :data="resourceList" stripe size="mini" style="width: 100%;">
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column v-if="type==1" label="部署网关" prop="edgeName" align="center" />
          <el-table-column label="名称" prop="name" width="180" align="center" />
          <el-table-column label="描述" prop="description" align="center" />
          <el-table-column label="读写属性" prop="resourceReadWrites" align="center">
            <template scope="scope">
              {{ scope.row.resourceReadWrites=== 'RW' ?'读写' : (scope.row.resourceReadWrites=== 'R'?'只读':'只写' ) }}
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="resUnit" align="center" />
        </el-table>
        <pagination v-show="restotal>0" :total="restotal" :page.sync="Query.currentPage" :limit.sync="Query.pageSize" @pagination="findList('', '')" />
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeDialog">关 闭</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="editDialogTitle" :visible.sync="OpenCopyDialogVisible" :close-on-click-modal="false" @close="closeCopyDialog">
        <div>
          <el-form ref="copyDeviceEditForm" :model="copyDeviceEditForm" :rules="copyDeviceEditFormRule" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="新设备名称" prop="deviceName">
                  <el-col :span="21" style="margin-left: 0px">
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

      <el-dialog :title="editDialogTitle" :visible.sync="editDialogMode" :close-on-click-modal="false" @close="closeEditDialogmode">
        <div>
          <el-form ref="feEdgeDeviceEditMode" :model="feEdgeDeviceEditMode" :rules="feDeviceAddressEditRulesMode" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="模板名称" prop="modeName">
                  <el-col :span="21" style="margin-left: 0px">
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

      <el-dialog :title="editDialogTitle" :visible.sync="testVisible" :close-on-click-modal="false" style="width: 122%; margin-left: -6%" @close="closeTestDialog">
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
                v-show="
                  protocol === 'BECKHOFF_ADSNET' ||
                    protocol === 'OMRON' ||
                    protocol === 'BACNET' ||
                    protocol === 'SIEMENS_S7' ||
                    protocol === 'MITSUBISH_MC' ||
                    protocol === 'MODBUS_RTU' ||
                    protocol === 'IEC104' ||
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
                    <div
                      id="contextTest1"
                      style="
                        word-break: break-all;
                        word-wrap: break-word;
                        word-break: normal;
                      "
                    />
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

      <el-dialog :title="editDialogTitle" :visible.sync="editDialogDevice" :close-on-click-modal="false" @close="closeDevice">
        <div>
          <el-form ref="feDeviceAddress" :model="feDeviceAddress" :rules="feDeviceAddresRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="设备型号" prop="id">
                  <el-col :span="21" style="margin-left: 0px">
                    <el-select v-model.trim="feDeviceAddress.id" style="width: 100%">
                      <el-option v-for="item in ModeList" :key="item.id" :label="item.modeName" :value="item.id" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="设备名称" prop="deviceName">
                  <el-col :span="21" style="margin-left: 0px">
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

      <el-dialog :title="editDialogTitle" :visible.sync="auditDialogVisible" :close-on-click-modal="false" @close="closeAuditDialog">
        <div>
          <el-form ref="auditForm" :model="auditForm" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="20">
                <el-form-item label="设备属性" prop="propertyName">
                  <el-col :span="21">
                    <el-select v-model.trim="auditForm.propertyName" @change="onChange(auditForm.propertyName)">
                      <el-option v-for="item in auditList" :key="item.name" :label="item.name" :value="item.name" />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="dataList !== 0">
              <el-col :span="20">
                <div
                  id="myChart"
                  :style="{
                    width: '100%',
                    height: '300px',
                    marginLeft: '50px',
                  }"
                />
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeAuditDialog">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="editDialogTitle" :visible.sync="taskDialogVisible" :close-on-click-modal="false" @close="taskCloseDialogVisible">
        <div>
          <el-form ref="feScheduleStrategyEditForm" :model="feScheduleStrategyEditForm" :rules="feScheduleStrategyEditRules" label-width="100px" size="mini" @submit.native.prevent>
            <el-row>
              <el-col :span="24">
                <el-form-item label="任务状态" prop="runOnce">
                  <el-col :span="20">
                    <el-switch v-model.trim="feScheduleStrategyEditForm.runOnce" :disabled="staus" active-color="#13ce66" />
                    <!-- <el-select v-model.trim="feScheduleStrategyEditForm.runOnce" :disabled="staus" style="width:100%">
                      <el-option label="启用" :value="true" />
                      <el-option label="停用" :value="false" />
                    </el-select> -->
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="执行频率" prop="frequency">
                  <input v-model.trim="feScheduleStrategyEditForm.frequency" type="hidden">
                  <el-col :span="4">
                    <el-input v-model.trim="feScheduleStrategyEditForm.frequencyDay" :maxlength="20" />
                  </el-col>
                  <el-col :span="1" style="padding-top: 0%; margin-left: 5px; margin-right: 0%">
                    <span>日</span>
                  </el-col>

                  <el-col :span="4">
                    <el-input v-model.trim="feScheduleStrategyEditForm.frequencyHour" :maxlength="20" />
                  </el-col>
                  <el-col :span="1" style="padding-top: 0%; margin-left: 5px; margin-right: 0%">
                    <span>时</span>
                  </el-col>

                  <el-col :span="4">
                    <el-input v-model.trim="feScheduleStrategyEditForm.frequencyMinute" :maxlength="20" />
                  </el-col>
                  <el-col :span="1" style="padding-top: 0%; margin-left: 5px; margin-right: 0%">
                    <span>分</span>
                  </el-col>

                  <el-col :span="4">
                    <el-input v-model.trim="feScheduleStrategyEditForm.frequencySecond" :maxlength="20" />
                  </el-col>
                  <el-col :span="1" style="padding-top: 0%; margin-left: 5px; margin-right: 0%">
                    <span>秒</span>
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

      <el-dialog :title="editDialogTitle" :visible.sync="dataViewDialogVisible" :close-on-click-modal="false" width="60%" @close="dataViewCloseDialogVisible">
        <div>
          <el-table v-loading="dataViewLoading" :data="dataViewList" stripe size="mini">
            <div v-if="headerList.length > 0">
              <el-table-column label="序号" type="index" width="80" align="center" />
            </div>
            <el-table-column v-for="item in headerList" :key="item.name" :prop="item.name" :label="item.labelName" align="center" />
          </el-table>
          <pagination v-show="dataViewTotal > 0" :total="dataViewTotal" :page.sync="dataViewQuery.currentPage" :limit.sync="dataViewQuery.pageSize" @pagination="getDataViewList" />
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import JsonViewer from 'vue-json-viewer'
import echarts from 'echarts'
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
  copyModesave,
  openAuditDevice,
  loadLine,
  queryCommandFieldList,
  getProfilePath,
  getDataViewList,
  initProjectList,
  initAgwtList,
  findList
} from '@/api/deviceResource'
import { searchContext, searchContextTest } from '@/api/nedevice'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { log } from 'util'
const DEVICE_STATUS = {
  1: '启用',
  0: '停用'
}
const deviceStatus = [
  {
    id: true,
    name: '在线'
  },
  {
    id: false,
    name: '离线'
  }
]
const deviceStatusKeyValue = formatterList(deviceStatus)

function formatterList(list) {
  return list.reduce((pre, cur) => {
    pre[cur.id] = cur.name
    return pre
  }, {})
}

Vue.use(JsonViewer)
export default {
  name: 'Device',
  components: { Pagination },
  filters: {
    deviceStatusFilter(key){
      return deviceStatusKeyValue[key]
    }
  },
  data() {
    return {
      jsonData: {},
      jsonTest: {},
      submiting: false,
      list: [],
      resourceList: [],
      restotal: 0,
      total: 0,
      dataViewTotal: 0,
      listLoading: false,
      dataViewLoading: false,
      listQuery: {
        gatewayCategory:'',
        projectName:'',
        edgeDeviceName:'',
        agwId: '',
        deviceName: '',
        connectProtocol: '',
        deviceStatus: '',
        projectId: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc',
        deviceModel:'',
        deviceEncoding:'',
        deviceLocations:''
      },
      headerList: [],
      dataViewList: [],
      dataViewQuery: {
        agwId: '',
        deviceName: '',
        profileNid: '',
        currentPage: 1,
        pageSize: 10
      },
      dataViewDialogVisible: false,
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
        deviceModel:'',
        deviceLocations:'',
        nid: '',
        deviceName: '',
        deviceDesc: '',
        adminState: '',
        operatingState: '',
        addrId: '',
        deviceServiceName: 'device-simple',
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
        runOnce: false
      },
      feDeviceAddressEditRules: {
        // deviceName: [
        //   {
        //     required: true,
        //     message: '请输入设备名称!',
        //     trigger: 'change'
        //   }
        // ],
        // profileNid: [
        //   {
        //     required: true,
        //     message: '请选择设备模型!',
        //     trigger: 'change'
        //   }
        // ],
        // deviceServiceName: [
        //   {
        //     required: true,
        //     message: '请选择设备服务!',
        //     trigger: 'change'
        //   }
        // ],
        // adminState: [
        //   {
        //     required: true,
        //     message: '请选择管理状态!',
        //     trigger: 'change'
        //   }
        // ],
        // operatingState: [
        //   {
        //     required: true,
        //     message: '请选择操作状态!',
        //     trigger: 'change'
        //   }
        // ],

        // connectProtocol: [
        //   {
        //     required: true,
        //     message: '请选择连接协议!',
        //     trigger: 'change'
        //   }
        // ]
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
      testDevice: {
        profileNid: '',
        agwId: '',
        deviceNid: '',
        connectProtocol: ''
      },
      protocol: '',
      connectionType: '',
      ModeList: [],
      agwIdList: {
        agwId: ''
      },
      taskDialogVisible: false,
      feScheduleStrategyEditForm: {
        edgeDeviceName:'',
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
        deviceServiceName: 'device-simple',
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
        runOnce: false,
        taskCreateTime: '',
        nid: '',
        resource: ''
      },
      feScheduleStrategyEditRules: {
        frequency: [
          {
            validator: (rule, value, callback) => {
              const reg = /^[0-9]*[1-9][0-9]*$/
              const runOnce = this.feScheduleStrategyEditForm.runOnce
              const d = this.feScheduleStrategyEditForm.frequencyDay
              const h = this.feScheduleStrategyEditForm.frequencyHour
              const m = this.feScheduleStrategyEditForm.frequencyMinute
              const s = this.feScheduleStrategyEditForm.frequencySecond
              if (
                runOnce === true &&
                d === '' &&
                h === '' &&
                m === '' &&
                s === ''
              ) {
                callback('执行频率频率不能为空！')
              } else if (d !== '' && !reg.test(d)) {
                callback('请填写正整数!')
              } else if (h !== '' && !reg.test(h)) {
                callback('请填写正整数!')
              } else if (m !== '' && !reg.test(m)) {
                callback('请填写正整数!')
              } else if (s !== '' && !reg.test(s)) {
                callback('请填写正整数!')
              }
              callback()
            },
            trigger: 'blur'
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
            message: '请输入设备名称!',
            trigger: 'blur'
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
            message: '请输入模板名称!',
            trigger: 'blur'
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
            message: '请选择设备型号!',
            trigger: 'change'
          }
        ],
        deviceName: [
          {
            required: true,
            message: '请输入设备名称!',
            trigger: 'blur'
          }
        ]
      },
      auditDialogVisible: false,
      auditList: [],
      auditForm: {
        agwId: '',
        propertyName: '',
        deviceName: ''
      },
      auditProperty: {
        auditProperty: ''
      },
      verticalDate: [],
      horizontalData: [],
      dataList: 0,
      deviceIdList: {
        nid: ''
      },
      commandList: {},
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
      statue: false,
      type: '',
      deledata: [],
      projectList: [],
      egwList: [],
      projectIds: {
        projectId: ''
      },
      Query: {
        FileId: '',
        name: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'nid',
        order: 'desc'
      }
    }
  },
  computed: {
    ...mapGetters(['operationPermission'])
  },
  created() {
    // this.listQuery.agwId=this.$router.query.row.edgeDeviceName
    // console.log(this.listQuery.agwId,"445")
    this.Querys()
    this.initProjectList()
    this.getList()
    this.initParameterList()
    this.loadAllMode()
    this.resetQueryForm()
    // console.info(this.edgeDeviceId)
  },
  methods: {
      onload() {
      // let size = this.listQuery.pageSize;
      this.listQuery.pageSize = 1000000;
      getList(this.listQuery).then((response) => { 
        this.listQuery.pageSize = 10;
        if (response.success) {
          // if(!response.data)return
          // for (var i = 0; i < response.data.length; i++) {
          //   if (response.data[i].adminState === 'UNLOCKED') {
          //     response.data[i].showAdminState = true
          //   } else {
          //     response.data[i].showAdminState = false
          //   }
          //   if (response.data[i].operatingState === 'ENABLED') {
          //     response.data[i].showOperatingState = 1
          //   } else {
          //     response.data[i].showOperatingState = 0
          //   }
          // }
          let arrs = [];
          arrs = response.data;
          arrs.map((el,index)=>{
         if(el.deviceStatus==true){
         el.deviceStatus="在线"
         }else{
          el.deviceStatus="离线"
         }
         el.index=index/1+1;
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
          "项目名称",
          "网关名称",
          "设备名称",
          "设备编码",
          "设备型号",
          "设备位置",
          "数据模型",
          "连接协议",
          "设备地址",
          "在线状态",
        ]; // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "index",
          "projectName",
          "edgeDeviceName",
          "deviceName",
        "deviceEncoding",
         "deviceModel",
          "deviceLocations",
          "profileName",
         "connectProtocol",
          "endPoint",
          "deviceStatus",
        ]; // 上面的index、nickName、name是tableData里对象的属性key值
        const list1 = arr; //把要导出的数据tableData存到list
        const data = this.formatJson(filterVal, list1);
        export_json_to_excel(tHeader,data,"设备列表"); //最后一个是表名字
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    handlePartnerCmd(cmd, row) {
      if (cmd === 'copy') {
        this.openCoopyDialog(row)
      } else if (cmd === 'copyMode') {
        this.openCopyMode(row)
      } else if (cmd === 'updateState') {
        this.changeAdminStatus(event, row)
      }
    },

    initParams() {
      if (this.$route.query.edgeDeviceId !== undefined) {
        this.edgeDeviceId = this.$route.query.edgeDeviceId
      }
      if (this.$route.query.type !== undefined) {
        this.type = this.$route.query.type
      }
    },
    initProjectList() {
      initProjectList()
        .then((response) => {
          if (response.success) {
            this.projectList = response.data
          } else {
            this.projectList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    initAgwtList(projectId) {
      this.projectIds.projectId = projectId
      this.listQuery.projectName=projectId
      console.log(this.projectId)
      initAgwtList(this.projectIds)
        .then((response) => {
          if (response.success) {
            console.log(this.egwList)
            this.egwList = response.data
          } else {
            this.egwList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    initAgwtListdata(agwId){
      this.listQuery.edgeDeviceName = agwId
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then((response) => {
        console.log(response,"getList")
        if (response.success) {
          // if(!response.data)return
          // for (var i = 0; i < response.data.length; i++) {
          //   if (response.data[i].adminState === 'UNLOCKED') {
          //     response.data[i].showAdminState = true
          //   } else {
          //     response.data[i].showAdminState = false
          //   }
          //   if (response.data[i].operatingState === 'ENABLED') {
          //     response.data[i].showOperatingState = 1
          //   } else {
          //     response.data[i].showOperatingState = 0
          //   }
          // }
          this.list = response.data
          this.total = response.totalRowCount
        } else {
          this.list = []
          this.total = []
        }
       
        this.returnQuery()
        this.listLoading = false
      })
    },
    returnQuery() {
      this.$router.push(
        `/deviceResource?agwId=${this.listQuery.agwId}&deviceName=${this.listQuery.deviceName}&connectProtocol=${this.listQuery.connectProtocol}&deviceStatus=${this.listQuery.deviceStatus}&projectId=${this.listQuery.projectId}&currentPage=${this.listQuery.currentPage}&pageSize=${this.listQuery.pageSize}`
      )
    },
    Querys() {
      this.listQuery.agwId = this.$route.query.agwId || ''
      this.listQuery.deviceName = this.$route.query.deviceName || ''
      this.listQuery.connectProtocol = this.$route.query.connectProtocol || ''
      this.listQuery.deviceStatus = this.$route.query.deviceStatus || ''
      this.listQuery.projectId = this.$route.query.projectId || ''
      this.listQuery.currentPage = +this.$route.query.currentPage || 1
      this.listQuery.pageSize = +this.$route.query.pageSize || 10
    },
    findList(profileNid, name) {
      this.editDialogTitle = '查看设备模型'
      this.viewVisible = true
      this.listLoading = true
      if (profileNid !== '') {
        this.Query.FileId = profileNid
        this.Query.name = ''
      }
      findList(this.Query).then((response) => {
        if (response.success) {
          this.resourceList = response.data
          this.restotal = response.totalRowCount
        } else {
          this.resourceList = []
          this.restotal = []
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
      this.listQuery = {
        agwId: '',
        deviceName: '',
        connectProtocol: '',
        deviceStatus: '',
        projectId: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'createTime',
        order: 'desc'
      }
      this.egwList = []
    },
    changeAdminStatus(event, row) {
      console.info(row.deviceName)
      var rowOperatingState = 0
      var smessage = 'LOCKED'
      if (row.adminState === 'UNLOCKED') {
        rowOperatingState = 0
      } else {
        rowOperatingState = 1
      }
      if (rowOperatingState === 0) {
        smessage = 'LOCKED'
      } else {
        smessage = 'UNLOCKED'
      }
      this.AdminStatus.nid = row.nid
      this.AdminStatus.adminState = smessage
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
          changeAdminStatus(this.AdminStatus)
            .then((response) => {
              if (response.success) {
                this.getList()
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '请求出错！'
                })
              }
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch(() => {})
    },
    openPartnerEditDialog(actionType, row) {
      this.currentActionType = actionType
      this.feDeviceAddressEditForm.agwId = this.edgeDeviceId
      if (this.currentActionType === 'add') {
        this.editDialogTitle = '新增设备'
        this.feDeviceAddressEditForm.adminState = 'UNLOCKED'
        this.feDeviceAddressEditForm.operatingState = 'ENABLED'
      } else if (this.currentActionType === 'edit') {
        this.editDialogTitle = '修改设备'
        this.$nextTick(() => {
          this.feDeviceAddressEditForm.addrId=row.addrId
          this.feDeviceAddressEditForm.deviceStatus=row.deviceStatus
          this.feDeviceAddressEditForm.nid = row.nid
          this.feDeviceAddressEditForm.projectName=row.projectName
          this.feDeviceAddressEditForm.projectId = row.projectId
          this.feDeviceAddressEditForm.edgeDeviceName = row.edgeDeviceName
          this.feDeviceAddressEditForm.deviceName = row.deviceName
          this.feDeviceAddressEditForm.deviceEncoding = row.deviceEncoding
          this.feDeviceAddressEditForm.deviceModel = row.deviceModel
          this.feDeviceAddressEditForm.address = row.address
          this.feDeviceAddressEditForm.deviceLocations = row.deviceLocations
          this.feDeviceAddressEditForm.deviceServiceName = row.deviceServiceName
          this.feDeviceAddressEditForm.profileNid = row.profileNid
          this.FileId = row.profileNid
          this.feDeviceAddressEditForm.adminState = row.adminState
          this.feDeviceAddressEditForm.operatingState = row.operatingState
          this.feDeviceAddressEditForm.deviceDesc = row.deviceDesc
          this.feDeviceAddressEditForm.deviceLabels = row.deviceLabels
          this.feDeviceAddressEditForm.fileId = row.fileId
          this.feDeviceAddressEditForm.addrIdTask = row.addrIdTask
          this.feDeviceAddressEditForm.resource = row.profileName
          this.feDeviceAddressEditForm.taskName = row.taskName
          this.feDeviceAddressEditForm.connectProtocol = row.connectProtocol
          this.feDeviceAddressEditForm.runOnce =
            row.runOnce === null ? false : row.runOnce
        })
      }
      this.editDialogVisible = true
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.$refs.feDeviceAddressEditForm.resetFields()
      this.feDeviceAddressEditForm.addrProtocol = 'TCP'
      this.multipleSelection = []
    },
    saveFeDeviceAddress() {
      this.$refs['feDeviceAddressEditForm'].validate((valid) => {
        if (valid) {
          if (this.currentActionType === 'add') {
            saveFeDeviceAddress(this.feDeviceAddressEditForm)
              .then((response) => {
                if (response.success) {
                  this.closeEditDialog()
                  this.getList()
                  this.$notify({
                    message: '保存成功',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
                }
              })
              .catch((error) => {
                console.log(error)
              })
          } else {
            editFeDeviceAddress(this.feDeviceAddressEditForm)
              .then((response) => {
                if (response.success) {
                  this.closeEditDialog()
                  this.getList()
                  this.$notify({
                    message: '保存成功!',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
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
      initParameterList()
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
      this.Query = {
        FileId: '',
        name: '',
        currentPage: 1,
        pageSize: 10,
        orderby: 'nid',
        order: 'desc'
      }
    },
    find() {
      this.File.FileId = this.FileId
      find(this.File)
        .then((response) => {
          if (response.success) {
            this.viewVisible = true
            this.$nextTick(() => {
              this.jsonData = JSON.parse(response.data)
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '请求出错！'
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    findProfile(profileNid) {
      this.fileList.FileId = profileNid
      findProfile(this.fileList)
        .then((response) => {
          console.info(response)
          if (response.success) {
            this.editDialogTitle = '查看设备模型'
            this.viewVisible = true
            this.$nextTick(() => {
              this.jsonData = JSON.parse(response.data)
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '请求出错！'
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    deletePartner(row) {
      this.$confirm('请确认是否删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deviceId.nid = row.nid
          deletePartner(this.deviceId)
            .then((response) => {
              if (response.success) {
                this.$notify({
                  message: '删除成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.getList()
                this.loadAllMode()
                this.connectionType = ''
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '请求出错！'
                })
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
    handlePartnerOpen(cmd) {
      if (cmd === 'add') {
        this.editDialogTitle = '新增设备'
        this.openPartnerEditDialog('add')
      } else if (cmd === 'addMode') {
        this.copyModeEditDialog()
      }
    },
    task(params) {
      this.editDialogTitle = '采集任务配置'
      this.deviceNid.deviceNid = params.nid
      this.profileNames.profileName = params.profileName
      this.queryCommandFieldList(params)
      task(this.deviceNid)
        .then((response) => {
          // console.log(response.data)
          if (response.success) {
            this.taskDialogVisible = true
            this.$nextTick(() => {
              this.feScheduleStrategyEditForm.agwId = this.edgeDeviceId
              this.feScheduleStrategyEditForm.scheduleName =
                params.scheduleName == null ? '' : params.scheduleName
              this.feScheduleStrategyEditForm.frequencyDay =
                params.frequencyDay == null ? '' : params.frequencyDay
              this.feScheduleStrategyEditForm.frequencyHour =
                params.frequencyHour == null ? '' : params.frequencyHour
              this.feScheduleStrategyEditForm.frequencyMinute =
                params.frequencyMinute == null ? '' : params.frequencyMinute
              this.feScheduleStrategyEditForm.frequencySecond =
                params.frequencySecond == null ? '' : params.frequencySecond
              this.feScheduleStrategyEditForm.startTime = params.startTime
              this.feScheduleStrategyEditForm.endTime = params.endTime
              this.feScheduleStrategyEditForm.taskName =
                params.taskName === null ? '' : params.taskName
              this.feScheduleStrategyEditForm.parameters = params.parameters
              this.feScheduleStrategyEditForm.scheduleDesc = params.scheduleDesc
              this.feScheduleStrategyEditForm.address = params.addressTask
              this.feScheduleStrategyEditForm.port = params.portTask
              this.feScheduleStrategyEditForm.protocol = params.protocolTask
              this.feScheduleStrategyEditForm.method = params.method
              this.feScheduleStrategyEditForm.deviceServiceName =
                params.deviceServiceName
              this.feScheduleStrategyEditForm.deviceNid = params.nid
              this.feScheduleStrategyEditForm.nid =
                this.feScheduleStrategyEditForm.taskId = params.taskId
              this.feScheduleStrategyEditForm.resource =
                params.profileName === null ? '' : params.profileName
              this.feScheduleStrategyEditForm.deviceLabels = params.deviceLabels
              this.feScheduleStrategyEditForm.addrId = params.addrId
              this.feScheduleStrategyEditForm.addrIdTask = params.addrIdTask
              this.labels = params.taskId
              this.feScheduleStrategyEditForm.deviceName = params.deviceName
              this.feScheduleStrategyEditForm.createTimeTask =
                params.createTimeTask
              this.feScheduleStrategyEditForm.runOnce =
                params.runOnce === null ? false : params.runOnce
              findFile(this.profileNames)
                .then((response) => {
                  if (response.success) {
                    this.pathList = response.data
                  } else {
                    this.pathList = []
                  }
                })
                .catch((error) => {
                  console.log(error)
                })
              if (params.taskPath === null || params.taskPath === '') {
                this.staus = true
              } else {
                this.staus = false
              }
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    openConfigDevice(params) {
      if (params.type === 1) {
        this.$router.push(
          `/connection?deviceNid=${params.nid}&connectProtocol=${params.connectProtocol}&agwId=${params.agwId}&profileNid=${params.profileNid}&type=1`
        )
      } else if (params.type === 2) {
        this.$router.push(
          `/connections?deviceNid=${params.nid}&connectProtocol=${params.connectProtocol}&agwId=${params.agwId}&profileNid=${params.profileNid}&type=2`
        )
      }
    },
    openDataView(params) {
      this.$router.push(
        `/openDataView?agwId=${params.agwId}&deviceName=${params.deviceName}&profileNid=${params.profileNid}`
      )
    },
    openCoopyDialog(params) {
      this.editDialogTitle = '复制设备'
      this.OpenCopyDialogVisible = true
      this.copyDeviceEditForm.nid = params.nid
      this.copyDeviceEditForm.agwId = params.agwId
    },
    openCopyMode(params) {
      this.editDialogTitle = ' 设为模板'
      this.editDialogMode = true
      this.feEdgeDeviceEditMode.deviceId = params.deviceId
      this.feEdgeDeviceEditMode.agwId = params.agwId
      this.feEdgeDeviceEditMode.modeName = params.modeName
      this.feEdgeDeviceEditMode.nid = params.nid
    },
    taskCloseDialogVisible() {
      this.taskDialogVisible = false
      this.$refs.feScheduleStrategyEditForm.resetFields()
    },
    dataViewCloseDialogVisible() {
      this.taskDialogVisible = false
    },
    savefeScheduleStrategy() {
      this.$refs['feScheduleStrategyEditForm'].validate((valid) => {
        if (valid) {
          if (this.labels === null || this.labels === '') {
            savefeScheduleStrategy(this.feScheduleStrategyEditForm)
              .then((response) => {
                if (response.success) {
                  this.$notify({
                    message: '保存成功!',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.taskCloseDialogVisible()
                  this.getList()
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
                }
              })
              .catch((error) => {
                console.log(error)
              })
          } else {
            editfeScheduleStrategy(this.feScheduleStrategyEditForm)
              .then((response) => {
                if (response.success) {
                  this.$notify({
                    message: '保存成功!',
                    type: 'success',
                    duration: this.$store.state.settings.duration
                  })
                  this.taskCloseDialogVisible()
                  this.getList()
                } else {
                  this.$notify.error({
                    title: '错误',
                    message: '请求出错！'
                  })
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
      this.$refs['connectionForm'].validate((valid) => {
        if (valid) {
          this.configDialogVisible = false
          this.$notify({
            message: '配置成功!',
            type: 'success',
            duration: this.$store.state.settings.duration
          })
        }
      })
    },
    saveCopyDevice() {
      this.$refs['copyDeviceEditForm'].validate((valid) => {
        if (valid) {
          saveCopyDevice(this.copyDeviceEditForm)
            .then((response) => {
              if (response.success) {
                this.$notify({
                  message: '保存成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.closeCopyDialog()
                this.getList()
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '请求出错！'
                })
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
      this.$nextTick(() => {
        this.$refs['feEdgeDeviceEditMode'].clearValidate()
      })
    },
    saveFeDeviceMode() {
      this.$refs['feEdgeDeviceEditMode'].validate((valid) => {
        if (valid) {
          saveFeDeviceMode(this.feEdgeDeviceEditMode)
            .then((response) => {
              if (response.success) {
                this.$notify({
                  message: '保存成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.closeEditDialogmode()
                this.getList()
                this.loadAllMode()
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '请求出错！'
                })
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
      this.editDialogTitle = '新增设备(从模板)'
      this.editDialogDevice = true
      this.feDeviceAddress.agwId = this.edgeDeviceId
    },
    copyModesave() {
      this.$refs['feDeviceAddress'].validate((valid) => {
        if (valid) {
          copyModesave(this.feDeviceAddress)
            .then((response) => {
              if (response.success) {
                this.$notify({
                  message: '保存成功!',
                  type: 'success',
                  duration: this.$store.state.settings.duration
                })
                this.closeDevice()
                this.getList()
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '请求出错！'
                })
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
    },
    openAuditDevice(value) {
      this.auditForm.propertyName = ''
      this.verticalDate = []
      this.horizontalData = []
      this.auditProperty.profileNid = value.profileNid
      openAuditDevice(this.auditProperty)
        .then((response) => {
          if (response.success) {
            this.auditList = response.data
            if (this.auditList.length > 0) {
              this.auditForm.deviceName = value.deviceName
              this.auditForm.propertyName = this.auditList[0].name
              this.auditForm.agwId = this.edgeDeviceId
              this.loadLine()
            }
          } else {
            this.auditList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    closeAuditDialog() {
      this.auditDialogVisible = false
    },
    onChange(propertyName) {
      this.verticalDate = []
      this.horizontalData = []
      this.auditForm.propertyName = propertyName
      this.loadLine()
    },
    loadLine() {
      loadLine(this.auditForm)
        .then((response) => {
          if (response.success) {
            this.dataList = response.data.length
            if (response.data.length > 0) {
              for (let i = 0; i < response.data.length; i++) {
                this.verticalDate[i] = response.data[i].value
                this.horizontalData[i] = response.data[i].created
              }
              this.drawLine()
            } else {
              this.$notify({
                title: '警告',
                message: '该属性暂无采集数据！',
                type: 'warning'
              })
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '请求出错！'
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: this.legendDate
        },
        grid: {
          top: '7%',
          left: '1.2%',
          right: '4.2%',
          bottom: '2%',
          containLabel: true,
          backgroundColor: 'transparent'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.horizontalData,
            nameTextStyle: {
              color: '#0098ad'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            nameTextStyle: {
              color: '#0098ad'
            }
          }
        ],
        series: [
          {
            name: '采集值',
            type: 'line',
            stack: '总量',
            lineStyle: {
              normal: {
                color: '#3d889e'
              }
            },
            areaStyle: {
              normal: {
                color: '#3d889e'
              }
            },
            data: this.verticalDate,
            smooth: true
          }
        ]
      })
    },
    queryCommandFieldList(param) {
      this.deviceIdList.nid = param.nid
      queryCommandFieldList(this.deviceIdList)
        .then((response) => {
          if (response.success) {
            this.commandList = response.data
            this.feScheduleStrategyEditForm.resource = this.commandList[0].name
          } else {
            this.commandList = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    test(params) {
      if (params.deviceId === '') {
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
        this.editDialogTitle = '读写测试'
        this.deviceNid.deviceNid = params.nid
        this.profileNames.profileName = params.profileName
        this.testDevice.profileNid = params.profileNid
        this.testDevice.agwId = params.agwId
        this.edgeDeviceId = params.agwId
        this.testDevice.deviceNid = params.nid
        this.testDevice.connectProtocol = params.connectProtocol
        this.protocol = params.connectProtocol
        this.contextTest = null
        this.queryCommandFieldList(params)
        task(this.deviceNid).then((response) => {
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
      this.Path.agwId = this.edgeDeviceId
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
          .catch((errors) => {
            loading.close()
            this.contextResult = false
            this.activeNames = ''
            var div = document.getElementById('contextTest1')
            div.innerHTML = errors
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
          searchContextTest(pathTest, this.edgeDeviceId, testPath)
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
    dataView(row) {
      this.dataViewLoading = true
      this.editDialogTitle = '查看数据'
      this.dataViewQuery.agwId = row.agwId
      this.dataViewQuery.deviceName = row.deviceName
      this.dataViewQuery.profileNid = row.profileNid
      this.dataViewDialogVisible = true
      this.getDataViewList()
    },
    getDataViewList() {
      getDataViewList(this.dataViewQuery).then((response) => {
        if (response.data.length > 0) {
          this.headerList = response.data
          this.dataViewList = response.dataList
          this.dataViewTotal = response.totalRowCount
        } else {
          this.dataViewList = []
          this.dataViewTotal = 0
          this.headerList = []
        }
        this.dataViewLoading = false
      })
    }
  }
}
</script>
<style >
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
.el-switch__label--left {
  position: relative;
  left: 44px;
  color: #fff;
  z-index: -1111;
  margin-right: 3px;
}
.el-switch__label--right {
  position: relative;
  right: 44px;
  color: #fff;
  z-index: -1111;
  margin-left: 3px;
}
.el-switch__label.is-active {
  z-index: 1111;
  color: #fff;
}
.el-switch__label--left {
  position: relative;
  left: 46px;
  color: #fff;
  z-index: -1111;
}
.el-switch__label--right {
  position: relative;
  right: 46px;
  color: #fff;
  z-index: -1111;
}
.el-switch__label--right.is-active {
  z-index: 1111;
  color: #fff !important;
}
.el-switch__label--left.is-active {
  z-index: 1111;
  color: #605d5d !important;
}
.el-switch__label * {
  line-height: 1;
  font-size: 12px;
  display: inline-block;
}
.el-switch__core {
  margin: 0;
  position: relative;
  width: 40px;
  height: 18px;
  border: 1px solid #dcdfe6;
  outline: 0;
  border-radius: 9px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #dcdfe6;
  -webkit-transition: border-color 0.3s, background-color 0.3s;
  transition: border-color 0.3s, background-color 0.3s;
  vertical-align: middle;
}
.el-radio.is-bordered {
  border-radius: 4px;
  border: 0px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 40px;
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
</style>

<style lang="scss" >
@import '~@/styles/variables.scss';
.el-loading-spinner.el-loading-text  {
  color: $el-loading-spinner;
  margin: 3px 0;
  font-size: 14px;
}
.el-loading-spinner i  {
  color: $el-loading-spinner;
}
.table_cell .cell{
	white-space: nowrap;
}
</style>
