<template>
  <div>
    <div v-if="!isChildren" class="app-container">
      <div class="filter-container">
        <el-row>
          <el-col :span="24" class="table-filter">
            <el-form
              ref="filterForm"
              :inline="true"
              :model="listQuery"
              label-width="0px"
              class="filterForm"
              @submit.native.prevent
            >
              <el-form-item>
                <el-tooltip  content="新增">
                  <el-button
                    class="filter-item"
                    icon="el-icon-plus"
                    @click="openPartnerEditDialog('add', '')"
                  />
                </el-tooltip>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model.trim="listQuery.edgeDeviceName"
                  :maxlength="20"
                  placeholder="网关名称"
                />
              </el-form-item>
              <el-form-item>
                <el-autocomplete
                  v-model.trim="listQuery.area"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="地区"
                />
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model.trim="listQuery.projectId"
                  placeholder="所属项目"
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.id"
                    :label="item.projectName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model.trim="listQuery.gatewayType"
                  placeholder="请选择网关类型"
                >
                  <el-option
                    v-for="item in projectobjt"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-tooltip content="重置">
                <el-button icon="el-icon-refresh" @click="resetQueryForm" />
              </el-tooltip>
              <el-tooltip content="查询">
                <el-button icon="el-icon-search" @click="getList" />
              </el-tooltip>
              <el-tooltip content="排序">
                <el-button @click="dictionarysort">排序</el-button>
              </el-tooltip>
              <el-tooltip content="批量导入" >
                <el-button class="filter-item" @click="dialogVisible = true"
                  >批量导入
                </el-button>
              </el-tooltip>
              <el-tooltip content="下载模板">
                <el-button @click="downloadTemplate">下载模板</el-button>
              </el-tooltip>
              <el-tooltip content="导出">
                <el-button icon="el-icon-download" @click="onload" />
              </el-tooltip>
              <el-tooltip content="测试">
                <el-button icon="el-icon-download" @click="onload1"
                  >测试</el-button
                >
              </el-tooltip>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <!-- v-loading="listLoading" -->
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="list"
        stripe
        size="mini"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="60" align="center" />
        <el-table-column
          label="网关名称"
          prop="edgeDeviceName"
          width="220"
          align="center"
        >
          <template scope="scope">
            <span>{{ scope.row.edgeDeviceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备SN" prop="deviceSn" align="center" />
        <el-table-column
          label="网关位置"
          prop="devicePosition"
          align="center"
          width="200"
        />
        <el-table-column
          label="空间标识"
          prop="deviceLocation"
          align="center"
        />
        <el-table-column
          label="IP地址"
          prop="ipAddress"
          width="100"
          align="center"
        />
        <el-table-column
          label="MAC地址"
          prop="mac"
          width="150"
          align="center"
        />
        <el-table-column label="网关型号" prop="gatewayType" align="center" />
        <el-table-column label="地区" prop="area" align="center" />
        <el-table-column label="网关任务" prop="gatewayTasks" align="center" />
        <el-table-column label="所属项目" prop="projectName" align="center" />
        <el-table-column label="网关告警" prop="gatewayAlarms" align="center">
          <template scope="scope">
            <el-button
              :type="scope.row.gatewayAlarms=='告警'?'danger':scope.row.gatewayAlarms=='正常'?'success':'info'"
              circle
              style="border-radius: 10px"
            >
              {{scope.row.gatewayAlarms}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <template scope="scope">
            <svg-icon :icon-class="scope.row.status ? 'online' : 'offline'" />
            {{ scope.row.status ? "在线" : "离线" }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="SIM卡号" prop="simCard" align="center" /> -->
        <el-table-column label="授权状态" prop="isLasted" align="center">
          <template scope="scope">
            <!-- <el-tag :type="scope.row.authorizationCode == null?'warning': (scope.row.isLasted ? 'danger': 'success')">{{scope.row.authorizationCode == null?'未激活': (scope.row.isLasted ? '已过期': '已激活')}}</el-tag>-->
            <svg-icon
              :icon-class="
                scope.row.authorizationCode == null ||
                scope.row.authorizationCode == ''
                  ? 'status-icon-pendingactivations'
                  : scope.row.isLasted
                  ? '132-Expired-1'
                  : 'status-icon-pendingactivations-1'
              "
            />
            {{
              scope.row.authorizationCode == null ||
              scope.row.authorizationCode == ""
                ? "未激活"
                : scope.row.isLasted
                ? "已过期"
                : "已激活"
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
          width="140"
        />
        <el-table-column label="操作" width="350" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
             
              content="修改"
              placement="bottom"
            >
              <el-button
                size="small"
                icon="el-icon-edit"
                @click="openPartnerEditDialog('edit', scope.row)"
                class="elbuttondefault"
              />
            </el-tooltip>
            <el-tooltip
              content="查看数据"
              placement="bottom"
              style="margin-left: 1px"
            >
              <el-button
                size="small"
                icon="el-icon-notebook-2"
                @click="openDataView(scope.row)"
                class="elbuttondefault"
              />
            </el-tooltip>
            <el-tooltip
             
              content="网关授权"
              placement="bottom"
              style="margin-left: 1px"
            >
              <el-button
                size="small"
                icon="el-icon-magic-stick"
                @click="handleCmd(scope.row)"
                class="elbuttondefault"
              />
            </el-tooltip>
            <el-tooltip
              v-if="isCamera"
              content="摄像机配置"
              placement="bottom"
              style="margin-left: 1px"
              class="elbuttondefault"
            >
              <el-button
                size="small"
                :disabled="!scope.row.isEffective"
                icon="el-icon-setting"
                @click="handlePartnerCmd('camera', scope.row)"
                class="elbuttondefault"
              />
            </el-tooltip>
            <!--
            <el-tooltip content="网络功能配置" placement="bottom" style="margin-left:1px">
              <el-button size="small" :disabled="!( scope.row.isEffective) " icon="el-icon-monitor" @click="handlePartnerCmd('gatewayConfig',scope.row)" />
            </el-tooltip>-->
            <el-tooltip
              content="配置"
              placement="bottom"
              style="margin-left: 1px"
              class="elbuttondefault"
            >
              <el-button
                size="small"
                :disabled="!scope.row.isEffective"
                icon="el-icon-setting"
                @click="handlePartnerCmd('view', scope.row)"
                class="elbuttondefault"
              />
            </el-tooltip>
            <el-tooltip
              content="监控"
              placement="bottom"
              style="margin-left: 1px"
            >
              <el-button
                size="small"
                :disabled="!(scope.row.status && scope.row.isEffective)"
                icon="el-icon-video-camera"
                @click="handlePartnerCmd('monitor', scope.row)"
                class="elbuttondefault"
              />
            </el-tooltip>
            <!--
            <el-tooltip content="远程登录" placement="bottom" style="margin-left:1px">
              <el-button size="small" :disabled="!(scope.row.status)" icon="el-icon-s-platform" @click="link(scope.row)" />
            </el-tooltip>-->
            <el-tooltip
             
              content="删除"
              placement="bottom"
              style="margin-left: 1px"
            >
              <el-button
                size="small"
                icon="el-icon-delete"
                @click="deletePartner(scope.row)"
                class="elbuttondefault"
              />
            </el-tooltip>
            <el-tooltip
              content="更多操作"
              placement="bottom"
              style="margin-left: 1px"
            >
              <el-dropdown
                @command="handlePartnerCmds(arguments[0], scope.row)"
              >
                <el-button icon="el-icon-more" class="elbuttondefault" />
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item command="gatewayConfig" :disabled="! scope.row.isEffective">网络功能配置</el-dropdown-item>
                  <el-dropdown-item command="links" :disabled="!(scope.row.status && scope.row.isEffective)">远程登录</el-dropdown-item>
                  <el-dropdown-item command="history" :disabled="! scope.row.isEffective">升级历史</el-dropdown-item> -->
                  <el-dropdown-item
                    command="findFilter"
                    :disabled="!scope.row.isEffective"
                  >
                    清洗策略详情
                  </el-dropdown-item>
                  <el-dropdown-item
                  
                    command="removeFilter"
                    :disabled="!(scope.row.status && scope.row.isEffective)"
                    >清空清洗策略
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
        @close="closeEditDialog"
      >
        <div>
          <el-form
            ref="feEdgeDeviceEditForm"
            :model="feEdgeDeviceEditForm"
            :rules="feDeviceAddressEditRules"
            label-width="100px"
            size="mini"
            @submit.native.prevent
          >
            <el-row>
              <el-col :span="20">
                <el-form-item label="网关名称" prop="edgeDeviceName">
                  <el-col :span="22">
                    <el-input
                      v-model.trim="feEdgeDeviceEditForm.edgeDeviceName"
                      :maxlength="10000"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="MAC地址" prop="mac">
                  <el-col :span="22">
                    <el-input
                      v-if="'add' == currentActionType"
                      v-model.trim="feEdgeDeviceEditForm.mac"
                      :maxlength="10000"
                    />
                    <el-input
                      v-else
                      v-model.trim="feEdgeDeviceEditForm.mac"
                      :disabled="true"
                      :maxlength="10000"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="所属项目" prop="projectId">
                  <el-col :span="22">
                    <el-select
                      v-model.trim="feEdgeDeviceEditForm.projectId"
                      placeholder="请选择项目"
                    >
                      <el-option
                        v-for="item in projectList"
                        :key="item.id"
                        :label="item.projectName"
                        :value="item.id"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="设备SN" prop="deviceSn">
                  <el-col :span="22">
                    <el-input v-model.trim="feEdgeDeviceEditForm.deviceSn" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="网关类型" prop="gatewayType">
                  <el-col :span="22">
                    <el-select
                      v-model.trim="feEdgeDeviceEditForm.gatewayType"
                      placeholder="请选择网关类型"
                    >
                      <el-option
                        v-for="item in projectobjt"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="20">
                <el-form-item label="地区" prop="area">
                  <el-col :span="22">
                    <el-cascader
                      v-model.trim="areaList"
                      :props="props"
                      :options="cityData"
                      :show-all-levels="false"
                      style="width: 100%"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="空间标识" prop="deviceLocation">
                  <el-col :span="22">
                    <el-input
                      v-model.trim="feEdgeDeviceEditForm.deviceLocation"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="网关位置" prop="devicePosition">
                  <el-col :span="22">
                    <el-input
                      v-model.trim="feEdgeDeviceEditForm.devicePosition"
                      :maxlength="10000"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="SIM卡号" prop="simCard">
                  <el-col :span="22">
                    <el-input
                      v-model.trim="feEdgeDeviceEditForm.simCard"
                      :maxlength="10000"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="网关型号" prop="gatewayId">
                  <el-col :span="22">
                    <el-select
                      v-model.trim="feEdgeDeviceEditForm.gatewayId"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in gatawayList"
                        :key="item.id"
                        :label="item.gatewayModel"
                        :value="item.id"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeEditDialog">取 消</el-button>
          <el-button
            type="primary"
            icon="fa-save"
            :loading="submiting"
            @click="saveFeDeviceAddress"
            >确 定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="editDialogTitle"
        :visible.sync="editDialogMode"
        :close-on-click-modal="false"
        @close="closeEditDialogmode"
      >
        <div>
          <el-form
            ref="feEdgeDeviceEditMode"
            :model="feEdgeDeviceEditMode"
            :rules="feDeviceAddressEditRulesMode"
            label-width="100px"
            size="mini"
            @submit.native.prevent
          >
            <el-row>
              <el-col :span="20">
                <el-form-item label="版本号" prop="versionName">
                  <el-col :span="21" style="margin-left: 0px">
                    <el-select
                      v-model.trim="feEdgeDeviceEditMode.versionName"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in ModeList"
                        :key="item.versionName"
                        :label="item.versionName"
                        :value="item.versionName"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeEditDialogmode"
            >取 消
          </el-button>
          <el-button
            type="primary"
            icon="fa-save"
            :loading="submiting"
            @click="saveFeDeviceMode"
            >确 定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="historyTitle"
        :visible.sync="showHistoryDialog"
        :close-on-click-modal="false"
        style="width: 150%; margin-left: -19%"
        @close="closeHistoryDialog"
      >
        <div>
          <template>
            <el-table
              ref="multipleTableB"
              v-loading="loadingFieldList"
              :data="tableData"
              stripe
              size="mini"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column
                label="序号"
                type="index"
                width="80"
                align="center"
              />
              <el-table-column
                prop="versionName"
                label="版本名称"
                width="200"
                align="center"
              />
              <el-table-column
                prop="createTime"
                label="升级时间"
                align="center"
              />
            </el-table>
            <pagination
              v-show="fieldQueryTotal > 0"
              :total="fieldQueryTotal"
              :page.sync="fieldQueryForm.currentPage"
              :limit.sync="fieldQueryForm.pageSize"
              @pagination="getHistorys"
            />
          </template>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeHistoryDialog">关 闭</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="查看数据"
        :visible.sync="openDialog"
        :close-on-click-modal="false"
        style="width: 100%; margin-left: 0%"
        @close="closeDialog"
      >
        <div>
          <el-row
            style="
              width: 100%;
              border-top: 0px solid #dcdfe6;
              margin-top: -15px;
            "
          >
            <el-col :span="24">
              <div
                style="
                  margin-left: 10%;
                  width: 100%;
                  border: 0px solid #dcdfe6;
                  font-size: 14px;
                  font-family: Microsoft YaHei;
                "
              >
                <el-row style="margin-top: 0px">
                  <el-col :span="10">网关名称</el-col>
                  <el-col :span="14">{{ detailForm.edgeDeviceName }}</el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="10">网关位置</el-col>
                  <el-col :span="14">{{ detailForm.devicePosition }}</el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="10">IP地址</el-col>
                  <el-col :span="14">{{ detailForm.ipAddress }}</el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="10">MAC地址</el-col>
                  <el-col :span="14">{{ detailForm.mac }}</el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="10">地区</el-col>
                  <el-col :span="14">{{ detailForm.area }}</el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="10">所属项目</el-col>
                  <el-col :span="14">{{ detailForm.projectName }}</el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="10">序列号</el-col>
                  <el-col :span="14">{{ detailForm.serialNum }}</el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="10">SIM卡号</el-col>
                  <el-col :span="14">{{ detailForm.simCard }}</el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="10">状态</el-col>
                  <el-col :span="14"
                    >{{ detailForm.status ? " 在线" : "离线" }}
                  </el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                  <el-col :span="10">授权状态</el-col>
                  <el-col :span="14"
                    >{{
                      detailForm.authorizationCode == null ||
                      detailForm.authorizationCode == ""
                        ? "未激活"
                        : detailForm.isLasted
                        ? "已过期"
                        : "已激活"
                    }}
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeDialog">关 闭</el-button>
        </div>
      </el-dialog>

      <el-dialog
        :title="codeTitle"
        :visible.sync="showCodeDialog"
        :close-on-click-modal="false"
        style="width: 100%"
        @close="closeCodeDialog"
      >
        <div>
          <el-form
            ref="feEdgeDeviceEditCode"
            :model="feEdgeDeviceEditCode"
            :rules="feDeviceAddressEditRulesCode"
            label-width="100px"
            size="mini"
            @submit.native.prevent
          >
            <el-row>
              <el-col :span="20">
                <el-form-item label="授权码" prop="authorizationCode">
                  <el-col :span="22">
                    <el-input
                      v-model.trim="feEdgeDeviceEditCode.authorizationCode"
                      :maxlength="10000"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row
              v-if="errorMessage !== ''"
              style="width: 100%; border-top: 1px solid #dcdfe6"
            >
              <el-col :span="20">
                <h4
                  style="
                    margin-left: 45px;
                    color: #dc0d0d;
                    text-indent: 2px;
                    padding: 5px 0;
                    border-left: 10px solid #dc0d0d;
                    border-top: 0px solid #ccc;
                  "
                >
                  错误信息
                </h4>
                <div
                  style="
                    margin-left: 45px;
                    width: 84%;
                    border: 0px solid #dcdfe6;
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                  "
                >
                  {{ errorMessage }}
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeCodeDialog">取 消</el-button>
          <el-button
            type="primary"
            icon="fa-save"
            :loading="submiting"
            @click="saveFeDeviceCode"
            >确 定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="授权信息"
        :visible.sync="showAuthorwareCodeDialog"
        :close-on-click-modal="false"
        style="width: 110%"
        @close="closeAuthorwareCodeDialog"
      >
        <div>
          <el-row
            style="
              width: 100%;
              border-top: 0px solid #dcdfe6;
              margin-top: -15px;
            "
          >
            <el-col :span="24">
              <div
                v-if="isLasted"
                style="
                  margin-left: 30px;
                  width: 100%;
                  border: 0px solid #dcdfe6;
                  font-size: 14px;
                  font-family: Microsoft YaHei;
                "
              >
                <el-col :span="24" style="margin-top: 0px">
                  <div>授权码: {{ authorizationCode }}</div>
                </el-col>
                <el-col :span="24" style="margin-top: 15px">
                  <div>
                    有效期: {{ authorizationTime }} 至
                    {{ authorizationDeadline }}
                  </div>
                </el-col>
                <el-col :span="20" style="margin-top: 15px">
                  <div>授权状态: 已过期</div>
                </el-col>
                <el-col :span="20" style="margin-top: 15px">
                  <el-button @click="reloadAuth(edgeId)">重新授权</el-button>
                </el-col>
              </div>
              <div
                v-if="!isLasted"
                style="
                  margin-left: 30px;
                  width: 100%;
                  border: 0px solid #dcdfe6;
                  font-size: 14px;
                  font-family: Microsoft YaHei;
                "
              >
                <el-col :span="24" style="margin-top: 0px">
                  <div>授权码: {{ authorizationCode }}</div>
                </el-col>
                <el-col :span="24" style="margin-top: 15px">
                  <div>
                    有效期: {{ authorizationTime }} 至
                    {{ authorizationDeadline }}
                  </div>
                </el-col>
                <el-col :span="20" style="margin-top: 15px">
                  <div>授权状态: 已激活</div>
                </el-col>
              </div>
            </el-col>
          </el-row>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeAuthorwareCodeDialog"
            >取 消
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="detailTitle"
        :visible.sync="showDetailDialog"
        :close-on-click-modal="false"
        style="width: 150%; margin-left: -19%"
        @close="closeDetailDialog"
      >
        <div>
          <template>
            <el-table
              ref="multipleTableC"
              v-loading="loadingDetailList"
              :data="detailData"
              stripe
              size="mini"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column
                label="序号"
                type="index"
                width="80"
                align="center"
              />
              <el-table-column
                prop="fieldName"
                label="校验字段名称"
                width="200"
                align="center"
              />
              <el-table-column
                label="规则名称"
                prop="ruleName"
                width="200"
                align="center"
              >
                <template slot-scope="scope">
                  {{
                    scope.row.ruleName === "max"
                      ? "最大值"
                      : scope.row.ruleName === "min"
                      ? "最小值"
                      : scope.row.ruleName === "equals"
                      ? "等于"
                      : "区间"
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="ruleValue" label="规则值" align="center" />
            </el-table>
            <pagination
              v-show="detailQueryTotal > 0"
              :total="detailQueryTotal"
              :page.sync="detailQueryForm.currentPage"
              :limit.sync="detailQueryForm.pageSize"
              @pagination="getDetail"
            />
          </template>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeDetailDialog">关 闭</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="批量导入"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        @close="closeEditDia"
      >
        <div>
          <el-form
            ref="feEdgeForm"
            :model="feEdgeForm"
            label-width="100px"
            size="mini"
            @submit.native.prevent
          >
            <el-row>
              <el-col :span="20">
                <el-form-item label="所属项目" prop="projectId">
                  <el-col :span="22">
                    <el-select
                      v-model.trim="feEdgeForm.projectId"
                      placeholder="请选择项目"
                    >
                      <el-option
                        v-for="item in projectList"
                        :key="item.id"
                        :label="item.projectName"
                        :value="item.id"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="网关型号" prop="gatewayId">
                  <el-col :span="22">
                    <el-select
                      v-model.trim="feEdgeForm.gatewayId"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in gatawayList"
                        :key="item.id"
                        :label="item.gatewayModel"
                        :value="item.id"
                      />
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="地区" prop="area">
                  <el-col :span="22">
                    <el-cascader
                      v-model="feEdgeForm.area"
                      :props="props"
                      :options="cityData"
                      :show-all-levels="false"
                      style="width: 100%"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="22">
                <el-form-item label="导入文件" prop="area">
                  <el-col :span="20">
                    <el-upload
                      style="display: inline-block"
                      action="string"
                      :limit="1"
                      :file-list="feEdgeForm.fileList"
                      :on-error="loadFileError"
                      :before-upload="beforeUpload"
                      accept=".xlsx,.xls"
                      :show-file-list="false"
                      :on-change="beforeAvatarUploadone"
                      :auto-upload="false"
                    >
                      <el-button>导入文件</el-button></el-upload
                    >
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer">
          <el-button icon="fa-ban" @click="closeEditDia">取 消</el-button>
          <el-button
            type="primary"
            icon="fa-save"
            :loading="submiting"
            @click="uploadFile"
            >确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<script>
 import { mapGetters } from "vuex";
import {
  batchimport,
  deleteLocal,
  deletePartner,
  dictionarysort,
  download,
  editFeDeviceAddress,
  findAllVersion,
  gatway,
  getAll,
  getDetail,
  getHistory,
  getList,
  getProjectList,
  querySearchAsync,
  removeFilter,
  saveFeDeviceAddress,
  updateCode,
} from "@/api/edgeDevice";
import { city } from "@/api/city";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "EdgeDevice",
  components: { Pagination },
  data() {
    return {
      alarms: "",
      btnColor: "",
      fileList: [],
      dataForms: {
        barCode: "",
        loading: false,
      },
      feEdgeForm: {
        gatewayId: "",
        projectId: "",
        area: "",
      },
      index: 1,
      colorbog: " ",
      desc: "",
      loadingText: "正在执行...",
      dialogVisible: false,
      submiting: false,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        edgeDeviceName: "",
        area: "",
        agwId: "",
        projectId: "",
        currentPage: 1,
        pageSize: 10,
        project: "",
        orderby: "createTime",
        order: "asc",
        gatewayType: "",
      },
      data: {
        edgeDeviceName: "",
        area: "",
        agwId: "",
        projectId: "",
        currentPage: 1,
        pageSize: 10,
        orderby: "createTime",
        order: "desc",
        gatewayType: "",
      },
      length: 0,
      disabled: true,
      abled: true,
      dialogVisible: false,
      editDialogVisible: false,
      feEdgeDeviceEditForm: {
        edgeDeviceId: "",
        edgeDeviceName: "",
        edgeGroupId: "",
        devicePosition: "",
        ipAddress: "",
        mac: "",
        deviceDesc: "",
        edgeCloudId: "",
        area: "",
        simCard: "",
        gatewayId: "",
        projectId: "",
        deviceSn: "",
        gatewayType: "",
        deviceLocation: "",
      },

      feDeviceAddressEditRules: {
        edgeDeviceName: [
          {
            required: true,
            message: "请输入名称!",
            trigger: "blur",
          },
        ],
        mac: [
          {
            required: true,
            message: "请输入MAC地址!",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              if (!/^([a-fA-F0-9]{2}:){5}([a-fA-F0-9]{2})$/.test(value)) {
                callback("MAC地址格式为00:00:00:00:00:00形式！");
              }
              callback();
            },
            trigger: "blur",
          },
        ],
      },
      currentActionType: "add",
      editDialogTitle: "",
      cityData: "",
      item: "",
      props: {
        label: "name",
        value: "name",
        children: "cities",
      },
      value: {},
      idList: [],
      deviceId: {
        edgeDeviceId: "",
      },
      areaList: [],
      edgeIp: {
        ipAddress: "",
      },
      editDialogMode: false,
      feEdgeDeviceEditMode: {
        edgeDeviceId: "",
        versionName: "",
      },
      feDeviceAddressEditRulesMode: {
        versionName: [
          {
            required: true,
            message: "请选择版本号!",
            trigger: "change",
          },
        ],
      },
      ModeList: [],
      fieldQueryForm: {
        edgeDeviceId: "",
        pageSize: 10,
        currentPage: 1,
        orderby: "createTime",
        order: "desc",
      },
      historyTitle: "升级历史",
      fieldQueryTotal: 0,
      tableData: [],
      showHistoryDialog: false,
      fieldQuering: false,
      loadingFieldList: false,
      detailTitle: "清洗策略详情",
      showDetailDialog: false,
      loadingDetailList: false,
      detailData: [],
      detailQueryForm: {
        edgeDeviceId: "",
        pageSize: 10,
        currentPage: 1,
        orderby: "createTime",
        order: "desc",
      },
      detailQueryTotal: 0,
      isCamera: false,
      showCodeDialog: false,
      codeTitle: "网关授权",
      feEdgeDeviceEditCode: {
        edgeDeviceId: "",
        authorizationCode: "",
      },
      feDeviceAddressEditRulesCode: {
        authorizationCode: [
          {
            required: true,
            message: "请输入授权码!",
            trigger: "blur",
          },
        ],
      },
      errorMessage: "",
      showAuthorwareCodeDialog: false,
      authorizationCode: "",
      authorizationDeadline: "",
      authorizationTime: "",
      isLasted: false,
      edgeId: "",
      gatawayList: [],
      openDialog: false,
      projectList: [],
      projectobjt: [],
      detailForm: {
        edgeDeviceId: "",
        edgeDeviceName: "",
        edgeGroupId: "",
        devicePosition: "",
        ipAddress: "",
        mac: "",
        gatewayType: "",
        deviceLocation: "",
        deviceSn: "",
        deviceDesc: "",
        edgeCloudId: "",
        serialNum: "",
        area: "",
        simCard: "",
        gatewayId: "",
        projectId: "",
        projectName: "",
        status: "",
        isLasted: "",
        authorizationCode: "",
      },
    };
  },
  created() {
    this.isChildren = this.$route.meta.isChildren;
    this.getList();
    this.initCityData();
    this.getAll();
  },
  computed: {
    ...mapGetters(["operationPermission"]),
  },
  methods: {
    onload1() {
      this.$router.push({ name: "Iframe" });
    },
    onload() {
      let size = this.listQuery.pageSize;
      this.listQuery.pageSize = 1000000;
      getList(this.listQuery).then((response) => {
        this.listQuery.pageSize = 10;
        if (response.success) {
          let arrs = [];
          arrs = response.data;
          arrs.map((el, index) => {
            if (el.status == true) {
              el.status = "在线";
            } else {
              el.status = "离线";
            }
            if (el.isLasted == true) {
              el.isLasted = "已过期";
            } else if (el.isLasted == false) {
              el.isLasted = "已激活";
            } else {
              el.isLasted = "未激活";
            }
            el.index = index / 1 + 1;
          });
          this.$nextTick(() => {
            this.exportExcel(arrs);
          });
        }
      });
    },
    exportExcel(arr) {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../../Excel/Export2Excel"); //注意这个Export2Excel路径
        const tHeader = [
          "序号",
          "网关名称",
          "设备SN",
          "网关位置",
          "空间标识",
          "IP地址",
          "MAC地址",
          "网关类型",
          "地区",
          "网关任务",
          "所属项目",
          "网关告警",
          "状态",
          "授权状态",
          "创建时间",
        ]; // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "index",
          "edgeDeviceName",
          "deviceSn",
          "devicePosition",
          "deviceLocation",
          "ipAddress",
          "mac",
          "gatewayType",
          "area",
          "gatewayTasks",
          "projectName",
          "gatewayAlarms",
          "status",
          "isLasted",
          "createTime",
        ]; // 上面的index、nickName、name是tableData里对象的属性key值
        const list1 = arr; //把要导出的数据tableData存到list
        const data = this.formatJson(filterVal, list1);
        export_json_to_excel(tHeader, data, "网关管理"); //最后一个是表名字
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },

    handlePartnerCmds(cmd, row) {
      if (cmd === "history") {
        this.getHistory(row);
      } else if (cmd === "removeFilter") {
        this.removeFilter(row);
      } else if (cmd === "findFilter") {
        this.findFilter(row);
      } else if (cmd === "links") {
        this.link(row);
      } else if (cmd === "gatewayConfig") {
        this.$router.push(
          `/gatewayConfig?edgeDeviceId=${row.edgeDeviceId}&type=1`
        );
      }
    },

    findAllVersion() {
      findAllVersion()
        .then((response) => {
          if (response.success) {
            this.ModeList = response.data;
          } else {
            this.ModeList = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 导入前检查文件
    beforeUpload(file) {
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!extension && !extension2) {
        this.$message({
          message: "上传模板只能是xls、xlsx格式!",
          type: "error",
        });
      }
      if (!isLt2M) {
        console.log("上传模板大小不能超过 2MB!");
        this.$message({
          message: "上传模板大小不能超过 2MB!",
          type: "error",
        });
      }
      return extension || extension2 || isLt2M;
    },
    // 批量导入
    loadFileError() {
      this.$message({
        message: "文件上传失败!",
        type: "error",
      });
    },
    loadFileSuccess() {
      this.$message({
        message: "文件上传成功!",
        type: "success",
      });
    },
    beforeAvatarUploadone(file, fileList) {
      this.feEdgeForm.fileList = file.raw;
    },
    uploadFile() {
      const File = this.feEdgeForm.fileList;
      let formDataInfo = new FormData();
      formDataInfo.append("area", this.feEdgeForm.area.join(","));
      formDataInfo.append("file", File);
      formDataInfo.append("gatewayId", this.feEdgeForm.gatewayId);
      formDataInfo.append("projectId", this.feEdgeForm.projectId);
      batchimport(formDataInfo).then((res) => {
        this.getList();
        this.$message({
          message: "批量导入成功",
          type: "success",
        });
        this.dialogVisible = false;
      });
    },
    dictionarysort() {
      this.listLoading = true;
      dictionarysort(this.data).then((response) => {
        if (response.success) {
          this.list = response.data;
          this.total = response.totalRowCount;
        } else {
          this.list = [];
          this.total = [];
        }
        this.listLoading = false;
        // this.editDialogMode = false;
      });
      this.getProjectList();
      this.gatway();
    },
    // 下载模版
    downloadTemplate() {
      download()
        .then((res) => {
          console.log(res.data, "file>>>>>>");
          if (res.data.size > 0) {
            const blob = new Blob([res.data]); // 构造一个blob对象来处理数据
            const fileName = "template.xls"; // 导出文件名
            const link = document.createElement("a"); // 创建a标签
            link.download = fileName; // a标签添加属性
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click(); // 执行下载
            URL.revokeObjectURL(link.href); // 释放url
            document.body.removeChild(link); // 释放标签
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 网关管理
    getAll() {
      getAll()
        .then((response) => {
          if (response.success) {
            console.log(response.data);
            this.gatawayList = response.data;
          } else {
            this.gatawayList = [];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getList() {
      this.listLoading = true;
      getList(this.listQuery).then((response) => {
        if (response.success) {
          this.total = response.totalRowCount;
          this.list = response.data;
          this.list.map((el) => {
            if (
              el.gatewayAlarms == "警告" ||
              el.gatewayAlarms == "一般严重" ||
              el.gatewayAlarms == "灾难"
            ) {
              el.gatewayAlarms = "告警";
              this.btnColor = "danger";
            } else if (
              el.gatewayAlarms == "未分类" ||
              el.gatewayAlarms == "咨询" ||
              el.gatewayAlarms == "正常"
            ) {
              el.gatewayAlarms = "正常";
              this.btnColor = "success";
            }else if (
              el.gatewayAlarms == null 
            ) {
              el.gatewayAlarms = "离线";
              
            }
          });
        } else {
          this.list = [];
          this.total = [];
        }
        this.listLoading = false;
      });
      this.getProjectList();
      this.gatway();
    },
    getProjectList() {
      getProjectList().then((response) => {
        if (response.success) {
          this.projectList = response.data;
        } else {
          this.projectList = [];
        }
      });
    },
    gatway() {
      gatway().then((response) => {
        if (response.success) {
          this.projectobjt = response.data;
        } else {
          this.projectobjt = [];
        }
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
        this.idList.push(this.value.edgeDeviceId);
        this.deviceId.edgeDeviceId = this.idList.toString();
      }
      if (this.length > 1) {
        this.abled = false;
        this.disabled = true;
        for (var i = 0; i < this.length; i++) {
          this.idList.push(this.multipleSelection[i].edgeDeviceId);
        }
        this.deviceId.edgeDeviceId = this.idList.toString();
      }
      if (this.length === 0) {
        this.abled = true;
        this.disabled = true;
      }
    },
    resetQueryForm() {
      this.listQuery = {
        edgeDeviceName: "",
        area: "",
        agwId: "",
        currentPage: 1,
        pageSize: 10,
        orderby: "createTime",
        order: "desc",
      };
    },
    querySearchAsync(queryString, cb) {
      var list = [{}];
      var params = Object.assign({}, { area: queryString });
      querySearchAsync(params)
        .then((response) => {
          list = response.data;
          cb(list);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    closeEditDia() {
      this.dialogVisible = false;
    },
    closeEditDialog() {
      this.editDialogVisible = false;
      this.$refs.feEdgeDeviceEditForm.resetFields();
      this.feEdgeDeviceEditForm.edgeDeviceId = "";
      this.feEdgeDeviceEditForm.ipAddress = "";
      this.areaList = [];
      this.multipleSelection = [];
      this.feEdgeDeviceEditForm.area = "";
    },
    openPartnerEditDialog(actionType, row) {
      this.currentActionType = actionType;
      if (this.currentActionType === "add") {
        this.editDialogTitle = "新增网关信息";
        console.log(row, "rewrwrew");
      } else if (this.currentActionType === "edit") {
        this.editDialogTitle = "修改网关信息";
        this.$nextTick(() => {
          this.feEdgeDeviceEditForm.edgeDeviceId = row.edgeDeviceId;
          this.feEdgeDeviceEditForm.edgeDeviceName = row.edgeDeviceName;
          this.feEdgeDeviceEditForm.deviceDesc = row.deviceDesc;
          this.feEdgeDeviceEditForm.devicePosition = row.devicePosition;
          this.feEdgeDeviceEditForm.ipAddress = row.ipAddress;
          this.feEdgeDeviceEditForm.edgeGroupId = row.edgeGroupId;
          this.feEdgeDeviceEditForm.edgeCloudId = row.edgeCloudId;
          this.feEdgeDeviceEditForm.mac = row.mac;
          this.feEdgeDeviceEditForm.serialNum = row.serialNum;
          this.feEdgeDeviceEditForm.simCard = row.simCard;
          this.feEdgeDeviceEditForm.gatewayId = row.gatewayId;
          this.feEdgeDeviceEditForm.projectId = row.projectId;
          this.feEdgeDeviceEditForm.deviceSn = row.deviceSn;
          this.feEdgeDeviceEditForm.gatewayType = row.gatewayType;
          this.feEdgeDeviceEditForm.deviceLocation = row.deviceLocation;
          this.areaList = row.area.split(",");
        });
      }
      this.editDialogVisible = true;
    },
    saveFeDeviceAddress() {
      this.$refs["feEdgeDeviceEditForm"].validate((valid) => {
        if (valid) {
          this.feEdgeDeviceEditForm.area = this.areaList.toString();
          if (this.currentActionType === "add") {
            saveFeDeviceAddress(this.feEdgeDeviceEditForm)
              .then((response) => {
                if (response.success) {
                  this.$notify({
                    message: "保存成功",
                    type: "success",
                    duration: this.$store.state.settings.duration,
                  });
                  this.closeEditDialog();
                  this.feEdgeDeviceEditForm.area = [];
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
            editFeDeviceAddress(this.feEdgeDeviceEditForm)
              .then((response) => {
                if (response.success) {
                  this.$notify({
                    message: "保存成功",
                    type: "success",
                    duration: this.$store.state.settings.duration,
                  });
                  this.closeEditDialog();
                  this.feEdgeDeviceEditForm.area = [];
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
    initCityData() {
      this.cityData = city;
      // console.log(this.cityData)
    },
    deletePartner(row) {
      this.$confirm("请确认是否删除该记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deviceId.edgeDeviceId = row.edgeDeviceId;
          deletePartner(this.deviceId)
            .then((response) => {
              if (response.success) {
                if (response.msg === "网关删除成功") {
                  this.$notify.success("删除成功!");
                  this.getList();
                } else {
                  this.deleteLocal(this.deviceId).then((response) => {
                    if (response.success) {
                      this.$notify({
                        message: "数据删除成功!",
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
                  });
                }
              } else {
                this.$notify.error({
                  title: "错误",
                  message: "请求出错！",
                });
              }
            })
            .catch(() => {
              this.$notify.error({
                title: "错误",
                message: "请求出错！",
              });
            });
        })
        .catch(() => {
          this.$notify.error({
            title: "错误",
            message: "请求出错！",
          });
        });
    },
    handlePartnerCmd(cmd, row) {
      if (cmd === "view") {
        this.$router.push(`/config?edgeDeviceId=${row.edgeDeviceId}&type=1`);
      } else if (cmd === "camera") {
        this.$router.push(`/camera?edgeDeviceId=${row.edgeDeviceId}`);
      } else if (cmd === "monitor") {
        if (row.status) {
          this.$router.push(`/monitor?edgeDeviceId=${row.edgeDeviceId}`);
        }
      }
    },
    handleVersion(cmd, row) {
      this.editDialogMode = true;
      this.editDialogTitle = "升级版本";
    },
    closeEditDialogmode() {
      this.editDialogMode = false;
      this.feEdgeDeviceEditMode.versionName = "";
      this.$nextTick(() => {
        this.$refs["feEdgeDeviceEditMode"].clearValidate();
      });
    },
    saveFeDeviceMode() {},
    findProfile(row, isReported) {
      if (isReported === true) {
        this.$router.push(`/config?edgeDeviceId=${row.edgeDeviceId}`);
      }
    },
    removeFilter(row) {
      this.$confirm("请确认是否清空该网关清洗配置?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.edgeIp.ipAddress = row.ipAddress;
          removeFilter(this.edgeIp)
            .then((response) => {
              if (response.success) {
                this.$notify({
                  message: "清除成功!",
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
    deleteParent(deviceId) {
      deleteLocal(deviceId).then((response) => {
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
      });
    },
    link(row) {
      window.open(
        "http://121.196.53.34:49999/?hostname=" +
          row.ipAddress +
          "&username=root&password=YWJjMTIzQENUUw==",
        "_blank"
      );
    },
    getHistory(row) {
      this.showHistoryDialog = true;
      this.fieldQueryForm.edgeDeviceId = row.edgeDeviceId;
      getHistory(this.fieldQueryForm).then((response) => {
        if (response.success) {
          this.tableData = response.data;
          this.fieldQueryTotal = response.totalRowCount;
        } else {
          this.tableData = [];
          this.fieldQueryTotal = 0;
        }
        this.loadingFieldList = false;
      });
    },
    batchimport() {
      batchimport().then((response) => {
        console.log(response);
      });
    },
    getHistorys() {
      this.showHistoryDialog = true;
      getHistory(this.fieldQueryForm).then((response) => {
        if (response.success) {
          this.tableData = response.data;
          this.fieldQueryTotal = response.totalRowCount;
        } else {
          this.tableData = [];
          this.fieldQueryTotal = 0;
        }
        this.loadingFieldList = false;
      });
    },
    closeHistoryDialog() {
      this.showHistoryDialog = false;
      this.fieldQueryForm = {
        edgeDeviceId: "",
        pageSize: 10,
        currentPage: 1,
        orderby: "createTime",
        order: "desc",
      };
    },
    findFilter(row) {
      this.showDetailDialog = true;
      this.detailQueryForm.edgeDeviceId = row.edgeDeviceId;
      getDetail(this.detailQueryForm).then((response) => {
        if (response.success) {
          this.detailData = response.data;
          this.detailQueryTotal = response.totalRowCount;
          if (this.detailData.length > 0) {
            this.detailTitle = "清洗策略详情";
          }
        } else {
          this.detailData = [];
          this.detailQueryTotal = 0;
        }
        this.loadingDetailList = false;
      });
    },

    getDetail() {
      this.showDetailDialog = true;
      getDetail(this.detailQueryForm).then((response) => {
        if (response.success) {
          this.detailData = response.data;
          this.detailQueryTotal = response.totalRowCount;
          if (this.detailData.length > 0) {
            this.detailTitle = "清洗策略详情";
          }
        } else {
          this.detailData = [];
          this.detailQueryTotal = 0;
        }
        this.loadingDetailList = false;
      });
    },
    closeDetailDialog() {
      this.showDetailDialog = false;
      this.detailTitle = "清洗策略详情";
      this.detailQueryForm = {
        edgeDeviceId: "",
        pageSize: 10,
        currentPage: 1,
        orderby: "createTime",
        order: "desc",
      };
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.detailData.length !== 0) {
          return {
            rowspan: this.detailData.length,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    handleCmd(row) {
      this.edgeId = row.edgeDeviceId;
      if (row.authorizationCode != null && row.authorizationCode !== "") {
        this.$nextTick(() => {
          this.isLasted = row.isLasted;
          this.authorizationCode = row.authorizationCode;
          this.authorizationDeadline = row.authorizationDeadline;
          this.authorizationTime = row.authorizationTime;
        });
        this.showAuthorwareCodeDialog = true;
      } else {
        this.$nextTick(() => {
          this.feEdgeDeviceEditCode.edgeDeviceId = row.edgeDeviceId;
          this.feEdgeDeviceEditCode.authorizationCode = row.authorizationCode;
        });
        this.showCodeDialog = true;
      }
    },
    closeCodeDialog() {
      this.showCodeDialog = false;
      this.errorMessage = "";
      this.$nextTick(() => {
        this.$refs["feEdgeDeviceEditCode"].clearValidate();
      });
    },

    saveFeDeviceCode() {
      this.$refs["feEdgeDeviceEditCode"].validate((valid) => {
        if (valid) {
          updateCode(this.feEdgeDeviceEditCode)
            .then((response) => {
              if (response.success) {
                if (response.data === "3") {
                  this.closeCodeDialog();
                  this.$alert(
                    response.authorizationCode +
                      "<span>授权成功</span><br>" +
                      " <span>有效期至</span>" +
                      response.authorizationDeadline,
                    "网关授权信息",
                    {
                      dangerouslyUseHTMLString: true,
                      confirmButtonText: "确定",
                      callback: (action) => {
                        this.getList();
                      },
                    }
                  );
                } else {
                  this.errorMessage = response.message;
                }
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
      });
    },
    closeAuthorwareCodeDialog() {
      this.showAuthorwareCodeDialog = false;
    },
    reloadAuth(reloadAuth) {
      this.showAuthorwareCodeDialog = false;
      this.$nextTick(() => {
        this.feEdgeDeviceEditCode.edgeDeviceId = reloadAuth;
      });
      this.showCodeDialog = true;
    },
    openDataView(row) {
      this.detailForm = {
        edgeDeviceId: row.edgeDeviceId,
        edgeDeviceName: row.edgeDeviceName,
        edgeGroupId: row.edgeGroupId,
        devicePosition: row.devicePosition,
        ipAddress: row.ipAddress,
        mac: row.mac,
        deviceDesc: row.deviceDesc,
        edgeCloudId: row.edgeCloudId,
        serialNum: row.serialNum,
        area: row.area,
        simCard: row.simCard,
        gatewayId: row.gatewayId,
        projectId: row.projectId,
        gatewayType: row.gatewayType,
        projectName: row.projectName,
        status: row.status,
        isLasted: row.isLasted,
        authorizationCode: row.authorizationCode,
      };
      this.openDialog = true;
    },
    closeDialog() {
      this.openDialog = false;
      this.detailForm = {
        edgeDeviceId: "",
        edgeDeviceName: "",
        edgeGroupId: "",
        devicePosition: "",
        ipAddress: "",
        mac: "",
        deviceDesc: "",
        edgeCloudId: "",
        serialNum: "",
        area: "",
        simCard: "",
        gatewayId: "",
        projectId: "",
        gatewayType: "",
        projectName: "",
        status: "",
        isLasted: "",
        authorizationCode: "",
      };
    },
  },
};
</script>
<style>
.shou {
  cursor: pointer;
}
.el-button--default {
  border-radius: 5px !important;
}
.elbuttondefault {
  background: #ffffff !important;
  color: #000000 !important;
}
#app .el-button--small {
  border-radius: 0px;
  padding: 9px 9px;
}
.orange {
  background-color: #fdad4e;
}
.green {
  background-color: #3abe65;
}
.red {
  background-color: #e25050;
}
</style>
