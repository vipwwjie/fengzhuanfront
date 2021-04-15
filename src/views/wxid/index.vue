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
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                  <el-input style="width: 180px" placeholder="手机号" v-model="selectData.telephone" clearable></el-input>
              </el-form-item>
              <el-form-item>
                  <el-input style="width: 180px" placeholder="wxid" v-model="selectData.wxid" clearable></el-input>
              </el-form-item>
              <el-form-item>
                  <el-input style="width: 180px" placeholder="微信号" v-model="selectData.username" clearable></el-input>
              </el-form-item>
              <el-form-item>
                  <el-select  v-model="selectData.status" style="width: 180px" placeholder="状态"  clearable>
                      <el-option
                      v-for="item in statusData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                     >
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
      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{ scope.row.telephone }}
        </template>
      </el-table-column>
      <el-table-column label="wxid" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wxid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="微信昵称" width="110" align="center">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.status">{{ scope.row.status }}</el-tag> -->
          {{scope.row.nickname}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="性别"  >
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 1">男</span>
          <span v-if="scope.row.sex == 2">女</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="状态"  >
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">未开始</span>
          <span v-if="scope.row.status == 1">已发送</span>
          <span v-if="scope.row.status == 2">成功</span>
          <span v-if="scope.row.status == 3">失败</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间"  >
        <template slot-scope="scope">
          <span>{{ formFormat(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="更新时间"  >
        <template slot-scope="scope"> 
          <span>{{ formFormat(scope.row.updated_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="查询机器人号"  >
        <template slot-scope="scope">
          <span>{{ scope.row.created_by }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="created_at" label="商户"  >
        <template slot-scope="scope">
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
  </div>
</template>

<script>
import { getWxResultList } from '@/api/index'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'primary',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      page: 1,
      limit: 20,
      totalNum: 0,
      selectData: {
        status: null
      },
      statusData: [{
        name: '未开始',
        id: 0
      }, {
        name: '已发送',
        id: 1
      },
      {
        name: '成功',
        id: 2
      },
      {
        name: '失败',
        id: 3
      }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.selectData = {
        status: null
      }
    },
    fetchData() {
      this.listLoading = true
      let obj = {
        type: 1,
        page: this.page,
        limit: this.limit,
        }
      let params = Object.assign(obj, this.selectData);
      if(params.created_at) {
        params.created_at = this.selectData.created_at/1000
      }
      getWxResultList(params).then(response => {
        if(response.items) {
          this.list = response.items
          this.totalNum = response.total;
          this.listLoading = false
        }else{
           if(response.status) {
              this.list = response.items
              this.totalNum = response.total;
              this.listLoading = false
            }else{
              this.$message(response.message);
            }
        }
       
       
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
      this.fetchData(1)
    },
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