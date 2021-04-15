<template>
  <div class="app-container">
    <div class="opera">
      <div class="opera-look">
          <el-form :inline="true" label-position="right">
              <el-form-item>
                  <el-select  v-model="selectData.status" placeholder="状态"  clearable>
                      <el-option
                      v-for="item in statusData"
                      :key="item.status"
                      :label="item.name"
                      :value="item.status"
                     >
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                  <el-input placeholder="机器人账号" v-model="selectData.account" clearable></el-input>
              </el-form-item>
              <el-form-item>
                  <el-input placeholder="机器人wxid" v-model="selectData.wxid" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button  type="primary"   @click="getQuery" class="bgc-btm">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button  type="primary"   @click="reset" class="bgc-btm">重置</el-button>
              </el-form-item>
               <el-form-item>
                 <el-button type="primary"   @click="importRobot" class="bgc-btm">导入机器人</el-button>
              </el-form-item>
               <el-form-item>
                 <el-button type="primary"   @click="lookConfig" class="bgc-btm">查号配置</el-button>
              </el-form-item>
               <el-form-item>
                 <el-button type="primary"  @click="batchHeatbeat(2)"  class="bgc-btm">批量检测</el-button>
              </el-form-item>
              <el-form-item>
                 <el-button type="primary"  @click="batchRelogin(2)"   class="bgc-btm">批量重登</el-button>
              </el-form-item>
               <el-form-item>
                 <el-button type="primary"  @click="batchRemove"  class="bgc-btm">批量删除</el-button>
              </el-form-item>
          </el-form> 
      </div>
  </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
       @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="ID" width="55">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="机器人账号">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="机器人wxid"   align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wxid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态"   align="center">
        <template slot-scope="scope">
          <!-- {{ scope.row.status }} -->
          <span v-if="scope.row.status == 1">在线</span>
          <span v-if="scope.row.status == 2">掉线</span>
          <span v-if="scope.row.status == 3">封号</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="登录返回" width="300" align="center">
        <template slot-scope="scope">
          {{scope.row.login_result}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="今日查号" >
        <template slot-scope="scope">
          <!-- <i class="el-icon-time" /> -->
          <span>{{ scope.row.today_query_count }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="最新状态时间" >
        <template slot-scope="scope">
          <!-- <i class="el-icon-time" /> -->
          <span>{{ formFormat(scope.row.updated_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
      <template slot-scope="scope">
          <span @click="batchHeatbeat(1,scope.row.id)" style="color: rgb(64, 158, 255);cursor: pointer;margin-right: 10px">检测心跳</span>
          <span @click="batchRelogin(1,scope.row.id)" style="color: rgb(64, 158, 255);cursor: pointer">重新登录</span>
      </template>
    </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[20, 40, 60, 80, 100]"
      :page-size="limit"
      layout="total, prev, pager, next, sizes"
      :total="totalNum">
      </el-pagination>
    </div>


    <!-- 导入机器人 -->
    <el-dialog
      title="导入机器人"
      :visible.sync="isImportShow"
      width="620px"
      :before-close="handleClose">
      <div class="create-content">
        <div class="text-ti">
          <p>机器人登录格式：</p>
          <p>账号----密码----62 / 16数据----代理IP----代理用户名----代理密码</p>
          <p style="color: #ccc">代理为可选项，如果没有则不填</p>
        </div>
         <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="importBody">
          </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="isImportShow=false">取 消</el-button>
          <el-button type="primary" @click="importConfirm">导入</el-button>
      </span>
      </el-dialog>
      <!-- 查号配置 -->
      <el-dialog
      title="查号配置"
      :visible.sync="isConfigShow"
      width="620px"
      :before-close="handleClose">
      <div class="create-content">
        <div class="text-ti">
          <p>机器人「今日查号」数量等于此限制将在今天停止工作，第二天会恢复</p>
        </div>
        <el-form :inline="true" label-width="100px" class="demo-form-inline">
          <el-form-item   label="查号限额">
            <el-input-number :controls="false" placeholder="1-999" style="width: 400px;" v-model="lookNum"  :precision="0" :min="1" :max="999"></el-input-number>
          </el-form-item>
          <!-- <el-form-item   label="查号方式" prop="locationCode">
            <el-radio-group v-model="queryType" @change="typeChange">
              <el-radio :label="1">微信搜索限制</el-radio>
              <el-radio :label="3">验群限制</el-radio>
            </el-radio-group>  
          </el-form-item> -->
        </el-form>
        
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="isConfigShow=false">取 消</el-button>
          <el-button type="primary" @click="PutQueryConfig">确定</el-button>
      </span>
      </el-dialog>
  </div>
</template>

<script>
import { getMachineList, machineImport, queryConfig, heatbeat, machineRelogin, machinRemove, PutQueryConfig } from '@/api/index'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      selectData: {
        status: ''
      },
      page: 1,
      limit: 20,
      totalNum: 0,
      statusData: [{
        name: '在线',
        status: 1
      }, {
        name: '掉线',
        status: 2
      },
      {
        name: '封号',
        status: 3
      }],
      isImportShow: false,
      importBody: '',
      queryType: 1,
      isConfigShow: false,
      multipleSelection: [],
      lookNum: 1
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.selectData = {
        status: ''
      }
    },
    lookConfig() {
      this.isConfigShow=true
      this.lookNum = 1;
      this.queryType = 1;
      this.QueryConfirm(1)
    },
    typeChange(val) {
      // console.log(val)
      this.queryType = val;
      this.QueryConfirm(1)
    },
    fetchData() {
      // this.listLoading = true;
      let obj = {
        type: 1,
        page: this.page,
        limit: this.limit,
        }
      let params = Object.assign(obj, this.selectData)
        // console.log(params)
      getMachineList(params).then(response => {
        // console.log(response)
        this.list = response.items;
        this.totalNum = response.total;
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
          this.limit=val;
          this.fetchData();
    },
    handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.page=val;
        this.fetchData();
    },
    getQuery() {
      this.page = 1;
      this.fetchData()
    },
    importRobot() {
      this.isImportShow = true;
    },
    importConfirm() {
      if(this.importBody) {
        let params = {
          body: this.importBody,
          type: 1
        }
        machineImport(params).then(response => {
          // console.log(response)
          if(response.status) {
            this.$message({
              message: response.message,
              type: 'success'
            });
            this.fetchData();
          }else{
            this.$message(response.message);
          }
        })
      }else{
         this.$message('请写入字符串');
      }
    },
    QueryConfirm(type) {
      let params = params = {
          type: this.queryType
        }
      
        queryConfig(params).then(response => {
          // console.log(response)
          if(response.status) {
           
            this.queryType = response.data.type
            this.lookNum = response.data.limit
            this.isConfigShow = true;
          
          }else{
            this.$message(response.message);
          }
        })
    },
    PutQueryConfig() {
      let  params = {
        type: this.queryType,
        limit: this.lookNum
      }
      PutQueryConfig(params).then(response => {
        if(response.status) {
          this.$message({
            message: '今日微信搜索限制' + ':' + this.lookNum + '次',
            type: 'success'
          });
          this.isConfigShow = false;
          this.fetchData();
        }else{
          this.$message(response.message);
        }
      })
    },
    HeatbeatRelogin(type, id) {
      this.$confirm('确定要检测心跳重新登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then(() => {
          this.heatbeat(type, id);
          this.relogin(type, id);
      }).catch(() => {
        this.$message({
            type: 'info',
            message: '取消检测心跳重新登录'
        });          
      });
    
    },
    batchHeatbeat(type, id) {
      this.$confirm('确定要检测心跳吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then(() => {
         this.heatbeat(type, id);
      }).catch(() => {
        this.$message({
            type: 'info',
            message: '取消检测心跳'
        });          
      });
    },
    heatbeat(type, id) {
      
      let params = {}
        // console.log(type)
        if(type == 1) {
          params.ids = [id];
        }else{
          // console.log(this.multipleSelection.length)
          if(this.multipleSelection.length == 0) {
            this.$message('请选择需要检测心跳的机器人');
            return
          }
          params.ids = this.multipleSelection;
        }
        heatbeat(params).then(response => {
            // console.log(response)
          if(response.status) {
            this.$message({
              message: response.message,
              type: 'success'
            });
            this.fetchData();
          }else{
            this.$message(response.message);
          }
        })  
    },
    batchRelogin(type, id) {
       this.$confirm('确定要重新登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          this.relogin(type, id)
        }).catch(() => {
          this.$message({
              type: 'info',
              message: '已取消重新登录'
          });          
        });
    },
    relogin(type, id) {
      let params = {}
        // console.log(type)
        if(type == 1) {
          params.ids = [id];
        }else{
          // console.log(this.multipleSelection.length)
          if(this.multipleSelection.length == 0) {
            this.$message('请选择需要重登的机器人');
            return
          }
          params.ids = this.multipleSelection;
        }
        machineRelogin(params).then(response => {
            // console.log(response)
          if(response.status) {
            this.$message({
              message: response.message,
              type: 'success'
            });
            this.fetchData();
          }else{
            this.$message(response.message);
          }
        })   
    },
    batchRemove() {
      this.$confirm('确定要删除选择的机器人？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then(() => {
        if(this.multipleSelection.length == 0) {
          this.$message('请选择需要删除的机器人');
          return
        }
        let params = {
          ids: this.multipleSelection
        }
        machinRemove(params).then(response => {
            // console.log(response)
          if(response.status) {
            this.$message({
              message: response.message,
              type: 'success'
            });
             this.fetchData();
          }else{
            this.$message(response.message);
          }
        })   
      }).catch(() => {
        this.$message({
            type: 'info',
            message: '已取消删除'
        });          
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
      .then(_ => {
          done();
      })
      .catch(_ => {});
    },
    handleSelectionChange(val) {
      // console.log(val)
      this.multipleSelection = [];
      val.forEach(element => {
        this.multipleSelection.push(element.id)
      });
      
    }
  }
}
</script>

<style>
  .opera {
      padding-left:40px;
  }
  .page {
        padding-left: 50px;
        margin-top: 30px;
        position: relative;
        text-align: right;
    }
</style>


