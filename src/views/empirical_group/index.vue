<template>
  <div class="app-container">
     <div class="opera">
      <div class="opera-look">
          <el-form :inline="true" label-position="right">
              <el-form-item>
                 <el-date-picker
                  v-model="selectData.created_at"
                  type="date"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="timestamp"
                  placeholder="选择创建日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                  <el-input placeholder="群ID" v-model="selectData.chatroom_id" clearable></el-input>
              </el-form-item>
              <el-form-item>
                  <el-select v-model="selectData.status" placeholder="状态" clearable>
                      <el-option
                      v-for="item in statusData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                <el-button  type="primary" icon="el-icon-search" @click="getQuery" class="bgc-btm">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button  type="primary"   @click="reset" class="bgc-btm">重置</el-button>
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
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="群ID">
        <template slot-scope="scope">
          {{ scope.row.chatroom_id }}
        </template>
      </el-table-column>
      <el-table-column label="群名称"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.chatroom_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="状态"  >
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">未开始</span>
          <span v-if="scope.row.status == 1">已进群</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间"  >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ formFormat(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="进群时间"  >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ formFormat(scope.row.enter_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="验群机器人号"  >
        <template slot-scope="scope">
          <span>{{ scope.row.created_by }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作"  >
        <template slot-scope="scope">
          <span @click="lookDetail(scope.row.id)" style="color: rgb(64, 158, 255);cursor: pointer">查看详情</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="created_at" label="商户"  >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column> -->
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

     <el-dialog
        title="群成员详情"
        :visible.sync="isShow"
        width="1285px"
        :before-close="handleClose">
        <div class="create-content">
             <el-table
                border
                ref="multipleTable"
                :data="detailTable"
                tooltip-effect="dark"
                style="width: 100%">
                 <el-table-column label="ID">
                    <template slot-scope="scope">
                      {{ scope.row.id }}
                    </template>
                  </el-table-column>
                  <el-table-column label="手机号"  align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.telephone }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="wxid"  align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.wxid }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="微信号"  align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.username }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="微信昵称"  align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.nickname }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center"   label="性别"  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.sex == 1">男</span>
                      <span v-if="scope.row.status == 2">女</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center"  label="状态"  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.status == 0">不在群</span>
                      <span v-if="scope.row.status == 1">在群</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="created_at" label="查询时间"  >
                    <template slot-scope="scope">
                      <i class="el-icon-time" />
                      <span>{{ formFormat(scope.row.created_at) }}</span>
                    </template>
                  </el-table-column>
            </el-table>
             <div class="page">
                <el-pagination
                @size-change="detailSizeChange"
                @current-change="detailCurrentChange"
                :current-page="detailData.page"
                :page-sizes="[6,10,20,30]"
                :page-size="detailData.limit"
                layout="total,  prev, pager, next, sizes"
                :total="detailTotal">
                </el-pagination>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isShow=false">关闭</el-button>
        </span>
        </el-dialog>
  </div>
</template>

<script>
import { getChatroomResultList, getChatroomDetailList } from '@/api/index'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      selectData: {},
      page: 1,
      limit: 20,
      totalNum: 0,
      detailTotal: 0,
      statusData: [{
        name: '未开始',
        id: 0
      }, {
        name: '已进群',
        id: 1
      }
      ],
      detailData:{
        page:1,limit:20,id:''
      },
      isShow: false,
      detailTable: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.selectData = {
       
      }
    },
    fetchData() {
      this.listLoading = true
      let obj = {
        type: 1,
        page: this.page,
        limit: this.limit,
        }
      let params = Object.assign(obj, this.selectData)
      if(params.created_at) {
        params.created_at = this.selectData.created_at/1000
      }
      getChatroomResultList(params).then(response => {
        this.list = response.items
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
    handleClose(done) {
        this.$confirm('确认关闭？')
        .then(_ => {
            done();
        })
        .catch(_ => {});
    },
    detailSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.detailData.limit=val;
        this.getDetailList();
    },
    getDetailList() {
       this.listLoading = true
         
        getChatroomDetailList(this.detailData).then(response => {
          this.detailTable = response.items
          this.detailTotal = response.total;
          this.listLoading = false;
          this.isShow = true;
        })
    },
    detailCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.detailData.page=val;
        this.getDetailList();
    },
    lookDetail(id) {
      this.detailData.id = id;
      this.getDetailList();
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
