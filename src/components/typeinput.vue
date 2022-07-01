<template>
  <div>
    <div style="height:70px;width:27%;float:left">
      请选择订单号
      <el-select v-loading = loading v-model="number" placeholder="请选择" @change="loading1=true,getlight(number),show=number" filterable>
              <el-option
              v-for="item in this.order"
              :key="item.id"
              :label="item.number"
              :value="item.id">
              </el-option>
      </el-select> 
    </div>
    <div style="height:50px;float:left;width:5%">
      <el-button type="primary" v-show='show' @click="dlg1 = true" icon="el-icon-edit" v-if="role == '管理员'">新增灯具</el-button>
    </div>
    <div>
    <el-table v-loading = loading1 :data="tableData"  border :height="tableheight" style="width: 100%; padding:0;">
        <el-table-column
        align='center'
        prop="ltype"
        label="型号"
        width="240">
        </el-table-column>
        <el-table-column
        align='center'
        prop="lsort"
        label="品名">
        </el-table-column>
        <el-table-column
        align='center'
        prop="lsize"
        label="尺寸">
        </el-table-column>
        <el-table-column
        align='center'
        prop="lcolor"
        label="颜色">
        </el-table-column>
        <el-table-column
        align='center'
        prop="lcount"
        label="数量">
        </el-table-column>
        <el-table-column 
        align='center'
        label="灯具图片"
        width="200px">
          <template slot-scope="scope">
            <el-image :src="imagefn(scope.row.image)"
            :preview-src-list="imagefn2(scope.row.image)"
             width="100%" height="100%">
             <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="center">  
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看材料信息" placement="top-start">
              <el-button @click="viewClick(scope.row);viewdlg= true"  size="small" icon="el-icon-search" type="primary" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看包装信息" placement="top-start">
              <el-button @click="viewbaozhuang(scope.row.id);viewbaozhuangdlg = true" size="small" icon="el-icon-s-cooperation" type="warning" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看灯具图片" placement="top-start">
              <el-button @click="viewpicture(scope.row.id);viewpicturedlg=true" size="small" icon="el-icon-picture" type="success" circle></el-button>
            </el-tooltip>
            <el-button @click="handleClick(scope.row);editdlg = true"  size="small" icon="el-icon-edit" v-if="role == '管理员'" type="info"  circle></el-button>
            <el-button @click="handleClick(scope.row);deldlg = true" size="small" type="danger" v-if="role == '管理员'" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
    </el-table>
    </div>
    <el-dialog :visible.sync='dlg1' title="新增灯具" width="30%">
      <el-form :model="form2"  status-icon  ref="form2" :rules="rules" class="demo-ruleForm" :inline='true'>
        <div style="margin:0 auto;width:300px">
          <el-form-item label="型号" prop="ltype">
            <el-input v-model="form2.ltype" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="品名" prop="lsort">
            <el-input v-model="form2.lsort" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="尺寸" prop="lsize">
            <el-input v-model="form2.lsize" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="颜色" prop="lcolor">
            <el-input v-model="form2.lcolor" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="lcount">
            <el-input v-model="form2.lcount" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="单价" prop="lprice">
            <el-input v-model="form2.lprice" autocomplete="true"></el-input>
          </el-form-item>
        </div>
          <div style='width:182px; margin:0 auto;'>     
            <el-button  type="primary" @click="submitForm('form2');">确 定</el-button>
            <el-button @click="resetForm('form2')">重 置</el-button>
          </div>   
        </el-form>
    </el-dialog>
    <el-dialog title="操作确认" :visible.sync='deldlg' width="30%" center="">
      <span style="fz">你确认要删除么？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deldlg = false;delfn(delid)">确 定</el-button>
        <el-button @click="deldlg = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改灯具" :visible.sync='editdlg' width="30%" center="">
        <el-form :model="form1"  status-icon  ref="form1" :rules="rules" class="demo-ruleForm" :inline='true'>
        <div style="margin:0 auto;width:300px">
          <el-form-item label="型号" prop="ltype">
            <el-input v-model="form1.ltype" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="品名" prop="lsort">
            <el-input v-model="form1.lsort" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="尺寸" prop="lsize">
            <el-input v-model="form1.lsize" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="颜色" prop="lcolor">
            <el-input v-model="form1.lcolor" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="lcount">
            <el-input v-model="form1.lcount" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="单价" prop="lprice">
            <el-input v-model="form1.lprice" autocomplete="true"></el-input>
          </el-form-item>
        </div>
          <div style='width:182px; margin:0 auto;'>     
            <el-button  type="primary" @click="eidform('form1');">确 定</el-button>
            <el-button @click="resetForm('form1')">重 置</el-button>
          </div>   
        </el-form>
    </el-dialog>
    <el-dialog title="新增包装" :visible.sync='newbaozhuangdlg' width="35%" center="" top="1%">
      <el-form :model="baozhuangform" status-icon  ref="baozhuangform" :rules="rules" class="demo-ruleForm" 
      style="width:60%;margin:0 auto;" label-width="70px">
          <el-form-item label="包装部件" prop="bujian">
            <el-select v-model="baozhuangform.bujian" placeholder="请选择" filterable>
              <el-option v-for="item in cusdata"
              :key="item.id"
              :label='item.bujian'
              :value="item.bujian">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="件/箱" prop="jianxiang">
            <el-input v-model="baozhuangform.jianxiang" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="总箱数" prop="totalnumber">
            <el-input v-model="baozhuangform.totalnumber" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="净重(KG)" prop="jweight">
            <el-input v-model="baozhuangform.jweight" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="毛重(KG)" prop="mweight">
            <el-input v-model="baozhuangform.mweight" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="长(cm)" prop="long">
            <el-input v-model="baozhuangform.long" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="宽(cm)" prop="width">
            <el-input v-model="baozhuangform.width" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="高(cm)" prop="height">
            <el-input v-model="baozhuangform.height" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="beizhu">
            <el-input v-model="baozhuangform.beizhu" autocomplete="true"></el-input>
          </el-form-item>
          <div style="margin-left:24%;width:80%">     
            <el-button  type="primary" @click="submitbaozhuangform('baozhuangform');">确 定</el-button>
          </div>   
        </el-form>
    </el-dialog>
    <el-dialog title="修改包装包装" :visible.sync='editbaozhuangdlg' width="30%" center="" top="1%">
      <el-form :model="baozhuangform" status-icon  ref="baozhuangform" :rules="rules" class="demo-ruleForm" 
      :inline='true' style="width:60%;margin:0 auto;" label-width="70px">
          <el-form-item label="包装部件" prop="bujian">
            <el-select v-model="baozhuangform.bujian" placeholder="请选择" filterable>
              <el-option v-for="item in cusdata"
              :key="item.id"
              :label='item.bujian'
              :value="item.bujian">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="件/箱" prop="jianxiang">
            <el-input v-model="baozhuangform.jianxiang" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="总箱数" prop="totalnumber">
            <el-input v-model="baozhuangform.totalnumber" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="净重(KG)" prop="jweight">
            <el-input v-model="baozhuangform.jweight" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="毛重(KG)" prop="mweight">
            <el-input v-model="baozhuangform.mweight" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="长(cm)" prop="long">
            <el-input v-model="baozhuangform.long" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="宽(cm)" prop="width">
            <el-input v-model="baozhuangform.width" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="高(cm)" prop="height">
            <el-input v-model="baozhuangform.height" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="beizhu">
            <el-input v-model="baozhuangform.beizhu" autocomplete="true"></el-input>
          </el-form-item>
          <div style="margin-left:24%;width:80%">     
            <el-button  type="primary" @click="eidtbaozhuangform('baozhuangform');">确 定</el-button>
          </div>   
        </el-form>
    </el-dialog>
    <el-dialog title="查看灯具包装" :visible.sync='viewbaozhuangdlg' width="95%" center="" top="1%">
      <el-button type="primary" icon="el-icon-edit" @click="newbaozhuangdlg=true;baozhuangform={beizhu:''}">新增包装信息</el-button> 
      <hr> 
      <el-table :data="baozhuangtable" v-loading='baozhuangloading' border :height="tableheight" style="width: 100%; padding:0;">
      <el-table-column
        align='center'
        prop="bujian"
        label="包装部件"
        width="100">
        </el-table-column>
        <el-table-column
        align='center'
        prop="jianxiang"
        label="件/箱">
        </el-table-column>
        <el-table-column
        align='center'
        prop="totalnumber"
        label="总箱数">
        </el-table-column>
        <el-table-column
        align='center'
        prop="jweight"
        label="净重(KG)">
        </el-table-column>
        <el-table-column
        align='center'
        prop="totaljweight"
        label="总净重(KG)">
        </el-table-column>
        <el-table-column
        align='center'
        prop="mweight"
        label="毛重(KG)">
        </el-table-column>
        <el-table-column
        align='center'
        prop="totalmweight"
        label="总毛重(KG)"
        width="200">
        </el-table-column>
        <el-table-column
        align='center'
        prop="long"
        label="长*宽*高(cm)">
        </el-table-column>
        <el-table-column
        align='center'
        prop="volume"
        label="体积(立方米)">
        </el-table-column>
        <el-table-column
        align='center'
        prop="totalvolume"
        label="总体积(立方米)">
        </el-table-column>
        <el-table-column
        align='center'
        prop="beizhu"
        label="备注">
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">  
          <template slot-scope="scope">
            <el-button  @click="eidbaozhuang(scope.row)" type="primary" size="small" icon="el-icon-edit" circle></el-button>
            <el-popconfirm title="确认删除么？" @confirm="deletebaozhuang(scope.row.id)">
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="small" circle></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      </el-dialog>
    <el-dialog title="查看详情" :visible.sync='viewdlg' width="95%" center="" top="1%">
       <div style="height:50px;width:10%;float:left;">
         <el-button type="primary" @click="dlg4 = true;newfn()" icon="el-icon-edit">新增</el-button>
       </div>
       <div style="height:50px;width:80%;float:left">
        <el-input  placeholder="搜索大类别名称" icon="search" v-model="schfilter"  @keyup.enter.native="searchfn()" class="search-input" size="small" style="width:200px" >
          </el-input>
         <el-input  placeholder="搜索小类别名称" icon="search" v-model="schfilter2"  @keyup.enter.native="searchfn()" class="search-input" size="small" style="width:200px;margin-left:10px" >
          </el-input>
          <el-button type="success" size="small" icon="el-icon-search" circle="" @click="searchfn()"></el-button>
          <el-button type="warning" size="small" icon="el-icon-refresh" circle="" @click="viewClick(view1);schfilter2='';schfilter='';"></el-button>
        </div>
      <el-table :data="tableData1" border :height="tableheight" style="width: 100%; padding:0;" v-loading = loading2>
        <el-table-column
        align='center'
        prop="cdate"
        label="日期"
        width="100">
        </el-table-column>
        <el-table-column
        align='center'
        prop="ctype"
        label="大类别">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cxtype"
        label="小类别">
        </el-table-column>
        <el-table-column
        align='center'
        prop="coder"
        label="送货单号">
        </el-table-column>
        <el-table-column
        align='center'
        prop="csupplier"
        label="供应商">
        </el-table-column>
        <el-table-column
        align='center'
        prop="csort"
        label="品名">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cguige"
        label="规格"
        width="200">
        </el-table-column>
        <el-table-column
        align='center'
        prop="ccolor"
        label="颜色">
        </el-table-column>
        <el-table-column
        align='center'
        prop="ccount"
        label="数量">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cdanwei"
        label="单位">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cprice"
        label="单价">
        </el-table-column>
        <el-table-column
        align='center'
        prop="ccost"
        label="金额">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cbeizhu"
        label="备注">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cshenhe"
        label="审核情况">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cjingshouren"
        label="经手人">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cshenheren"
        label="审核人">
        </el-table-column>
        <el-table-column
        align='center'
        prop="cshenhetime"
        label="审核时间">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">  
          <template slot-scope="scope">
            <el-button v-if="scope.row.cshenhe == '未审核'" @click="eidcailiao(scope.row);newfn()" type="primary" size="small" icon="el-icon-edit" circle></el-button>
            <el-button v-if="scope.row.cshenhe == '未审核'" @click="delcailiaoClick(scope.row)" type="danger" icon="el-icon-delete" size="small" circle></el-button>
          </template>
        </el-table-column>
    </el-table>
    </el-dialog>
    <el-dialog title="图片展示" :visible.sync='viewpicturedlg' width="60%" center="" >
      <el-upload
          v-loading='pictureloading'
          :action="action()"
          list-type="picture-card"
          accept="image/*"
          :auto-upload="true"
          :data = uploadform
          :file-list="fileList"
          :before-upload="beforeAvatarUpload"
          :on-remove="handleRemove"
          :on-change="handlechange"
          :on-preview="handlePictureCardPreview">
          <i class="el-icon-plus"></i>
        </el-upload>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>   
    <el-dialog title="操作确认" :visible.sync='delcailiaodlg' width="30%" center="">
      <span style="fz">你确认要删除么？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delcailiaofn(delcailiaoid)">确 定</el-button>
        <el-button @click="delcailiaodlg = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增灯具原材料" :visible.sync='dlg4' width="30%" center="" top="1%">
        <el-form :model="form4"  status-icon  ref="form4" :rules="rules" class="demo-ruleForm" :inline='true'>
        <div style="margin:0 auto;width:300px">
          <el-form-item label="大类型" prop="ctype">
            <el-select v-model="form4.ctype" placeholder="请选择" @change="select(form4.ctype);supplierfn()">
              <el-option 
              v-for="item in this.list1"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="(form4.ctype <= 6) || (form4.ctype > 8)" label="小类别" prop="cxtype">
            <el-select v-model="form4.cxtype" placeholder="请选择">
              <el-option
              v-for="item in this.list2"
              :key="item.id"
              :label="item.name"
              :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if=" (9 > form4.ctype) && (form4.ctype > 6)" label="小类别" prop="cxtype">
            <el-input v-model="form4.cxtype" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="送货单号" prop="coder">
            <el-input v-model="form4.coder" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="供应商" prop="csupplier">
            <el-select v-model="form4.csupplier" placeholder="请选择" filterable>
              <el-option
              v-for="item in this.list3"
              :key="item.id"
              :label="item.company"
              :value="item.company">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品名" prop="csort">
            <el-input v-model="form4.csort" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="规格" prop="cguige">
            <el-input v-model="form4.cguige" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="颜色" prop="ccolor">
            <el-input v-model="form4.ccolor" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="ccount">
            <el-input v-model="form4.ccount" autocomplete="true"></el-input>
          </el-form-item>
           <el-form-item label="单位" prop="cdanwei">
            <el-select v-model="form4.cdanwei" placeholder="请选择">
              <el-option
              v-for="item in this.list4"
              :key="item.id"
              :label="item.name"
              :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单价" prop="cprice">
            <el-input v-model="form4.cprice" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="cbeizhu">
            <el-input v-model="form4.cbeizhu" autocomplete="true"></el-input>
          </el-form-item>
        </div>
          <div style='width:182px; margin:0 auto;'>     
            <el-button  type="primary" @click="submitForm4('form4');">确 定</el-button>
            <el-button @click="resetForm('form4')">重 置</el-button>
          </div>   
        </el-form>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync='eidcailiaodlg'>
        <el-form :model="form4"  status-icon  ref="form4" :rules="rules" class="demo-ruleForm" :inline='true'>
        <div style="margin:0 auto;width:300px">
          <el-form-item label="大类型" prop="ctype">
            <el-select v-model="form4.ctype" placeholder="请选择" @change="select(form4.ctype);supplierfn()">
              <el-option 
              v-for="item in this.list1"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <div v-if="form4.ctype >0 ">
         <el-form-item v-if="(form4.ctype <= 6) || (form4.ctype > 8)" label="小类别" prop="cxtype">
            <el-select v-model="form4.cxtype" placeholder="请选择">
              <el-option
              v-for="item in this.list2"
              :key="item.id"
              :label="item.name"
              :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if=" (9 > form4.ctype) && (form4.ctype > 6)" label="小类别" prop="cxtype">
            <el-input v-model="form4.cxtype" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="送货单号" prop="coder">
            <el-input v-model="form4.coder" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="供应商" prop="csupplier">
            <el-select v-model="form4.csupplier" placeholder="请选择" filterable>
              <el-option
              v-for="item in this.list3"
              :key="item.id"
              :label="item.company"
              :value="item.company">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品名" prop="csort">
            <el-input v-model="form4.csort" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="规格" prop="cguige">
            <el-input v-model="form4.cguige" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="颜色" prop="ccolor">
            <el-input v-model="form4.ccolor" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="ccount">
            <el-input v-model="form4.ccount" autocomplete="true"></el-input>
          </el-form-item>
           <el-form-item label="单位" prop="cdanwei">
            <el-select v-model="form4.cdanwei" placeholder="请选择">
              <el-option
              v-for="item in this.list4"
              :key="item.id"
              :label="item.name"
              :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单价" prop="cprice">
            <el-input v-model="form4.cprice" autocomplete="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="cbeizhu">
            <el-input v-model="form4.cbeizhu" autocomplete="true"></el-input>
          </el-form-item>
          </div>
        </div>
          <div style='width:182px; margin:0 auto;'>     
            <el-button  type="primary" @click="eidForm4('form4');">确 定</el-button>
            <el-button @click="eidcailiaodlg = false;">取 消</el-button>
          </div>   
        </el-form>
    </el-dialog>
  </div>
</template>

<script>

import {ViewcailiaoAPI,ViewxiaoleixingAPI,ViewnewAPI,DeletecailiaoAPI,GetlightAPI,AddlightAPI,GetdingdanAPI,
GetcailiaoAPI,DellightAPI,AddcailiaoAPI,EditcailiaoAPI,EditlightAPI,Newbaozhuang,Getbaozhuang,Deletebaozhuang,Editbaozhuang,
GetpictureAPI,DelpictureAPI} from '../until/api'
import {baseURL,url} from '../until/upload'



export default {
  data () {
    var lock = (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入内容'))
          }else {
            callback()
          }
        };
    return {
      pictureloading:false,
      picturefile:'',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      newbaozhuangdlg:false,
      tableheight:window.innerHeight-180,
      loading:false,
      loading1:false,
      loading2:false,
      eidcailiaodlg:false,
      csupplier:'',
      show:false,
      show2:false,
      editdlg:false,
      viewdlg:false,
      supplier1:'',
      dlg4:false,
      list1:{
        id:'',
        name:''
      },
      list2:{
        id:'',
        name:''
      },
      list3:{
        id:'',
        company:''
      },
      list4:[
        {
          id:1,
          name:'个'
      },
        {
          id:2,
          name:'块'
      },
        {
          id:3,
          name:'件'
      },
        {
          id:4,
          name:'套'
      },
        {
          id:5,
          name:'条'
      },
        {
          id:6,
          name:'米'
      },
        {
          id:7,
          name:'对'
      },
        {
          id:8,
          name:'KG'
      },
        {
          id:9,
          name:'张'
      },
      ],
      order1:{
        id:'',
        company:''
      },
      rules:{
        ltype:[
          {validator:lock, trigger: 'blur'}
        ],
        lsort:[
          {validator:lock, trigger: 'blur'}
        ],
        lsize:[
          {validator:lock, trigger: 'blur'}
        ],
        lcolor:[
          {validator:lock, trigger: 'blur'}
        ],
        lcount:[
          {validator:lock, trigger: 'blur'}
        ],
        lcost:[
          {validator:lock, trigger: 'blur'}
        ],
        lprice:[
          {validator:lock, trigger: 'blur'}
        ],
        csort:[
          {validator:lock, trigger: 'blur'}
        ],
        cprice:[
          {validator:lock, trigger: 'blur'}
        ],
        ccount:[
          {validator:lock, trigger: 'blur'}
        ],
        csupplier:[
          {validator:lock, trigger: 'blur'}
        ],
        ccost:[
          {validator:lock, trigger: 'blur'}
        ],
        long:[
          {validator:lock, trigger: 'blur'}
        ],
        width:[
          {validator:lock, trigger: 'blur'}
        ],
        height:[
          {validator:lock, trigger: 'blur'}
        ],
        jianxiang:[
          {validator:lock, trigger: 'blur'}
        ],
        totalnumber:[
          {validator:lock, trigger: 'blur'}
        ],
        jweight:[
          {validator:lock, trigger: 'blur'}
        ],
        mweight:[
          {validator:lock, trigger: 'blur'}
        ],
      },
      cusdata:[{id:1,bujian:'灯罩'},{id:2,bujian:'灯体'},
      {id:3,bujian:'玻璃'},{id:4,bujian:'吸顶盘'},{id:5,bujian:'其他'},],
      delid:-1,
      schfilter:'',
      schfilter2:'',
      form2:{
        ltype:'',
        lsort:'',
        lsize:'',
        lcolor:'',
        lcount:'',
        lcost:'',
        lprice:'',
      },
      form4:{
        cbeizhu:''
      },
      form1:{
        id:'',
        ltype:'',
        lsort:'',
        lsize:'',
        lcolor:'',
        lcount:'',
        lcost:'',
        lprice:'',
      },
      dlg1:false,
      deldlg:false,
      order:{
        },
      lightnumber:'',
      number:'',
      tableData:[],
      tableData1:[],
      delcailiaodlg:false,
      delcailiaoid:'',
      view1:'',
      role:'',
      viewbaozhuangdlg:false,
      baozhuangtable:[],
      baozhuangloading:false,
      baozhuangform:{},
      editbaozhuangdlg:false,
      viewpicturedlg:false,
      uploadform:{id:-1,name:-1,token:JSON.parse(sessionStorage.token)},
      fileList:[],
    }
  },
  created(){
    this.getdata()
    this.getrole()
  },

  methods:{
    imagefn(baseurl){
      if(baseurl){
        return url+baseurl[0]
      }else{
        return 'false'
      }
    },
    imagefn2(baseurllist){
      if(baseurllist){
        var list = new Array(baseurllist.length)
      for(var i=0;i<baseurllist.length;i++){
        list.push(url+baseurllist[i])
      }
      return list
      }else{
        return ['false']
      }
    },
    action(){
      return baseURL
    },
    beforeAvatarUpload(file){
      var index = file.name.lastIndexOf(".")
      var ext = file.name.substr(index+1)
      if((ext == 'jpg'||'jpeg'||'png'||'tif'||'bmp')&&((file.size/1048576)<2)){
        this.$notify({
          title:'正在上传',
          type:'success'
        })
        return true
      }else if((file.size/1048576) > 2){
        this.$notify({
          title:'文件过大',
          type:'warning'
        })
      }else{
        this.$notify({
          title:'图片类型不正确',
          type:'warning'
        })
        return false
      }
    },
    handleRemove(file) {
        DelpictureAPI({id:this.lightnumber,name:file.name}).then(res =>{if(res.data['code']==200){
          this.viewpicture(this.lightnumber);this.open2()
        }})
      },
    handlechange(file, fileList){
        setTimeout(() => {this.viewpicture(this.lightnumber)
          
        }, 500);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    viewpicture(id){
      this.pictureloading = true
      this.uploadform.id = id
      this.uploadform.name = new Date().getTime();
      this.lightnumber = id
      GetpictureAPI({'id':id,'preview':1,'url':url}).then(res=>{
        this.fileList = res.data;this.pictureloading=false})
    },
    viewbaozhuang(id){
      this.baozhuangloading = true
      this.lightnumber = id
      Getbaozhuang(id).then(res =>{this.baozhuangtable = res.data;this.baozhuangloading=false})
    },
    getrole(){
      this.role = JSON.parse(sessionStorage.getItem('user'))['0'].role
      },
    eidcailiao(data){
      this.eidcailiaodlg=true,
      this.form4=data
    },
    supplierfn(){
      ViewcailiaoAPI().then(res =>{this.list3 = res.data})
    },
    select(id){
      ViewxiaoleixingAPI(id).then(res =>{this.list2 = res.data})
    },
    newfn(){
      ViewnewAPI().then(res => {this.list1 = res.data})
    },
    delcailiaoClick(id){
      this.delcailiaodlg = true
      this.delcailiaoid = id.id
    },
    delcailiaofn(id){
      DeletecailiaoAPI(id).then(res =>{this.viewClick(this.view1)}).then(res =>{this.open2();this.delcailiaodlg = false}).catch(err =>{
        this.$notify({
          title:'未成功删除，参数错误',
          type:'warning'
        })
      })
    },
    deletebaozhuang(id){
      Deletebaozhuang(id).then(res =>{this.viewbaozhuang(this.lightnumber);this.open2()})
    },
    eidtbaozhuangform(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editbaozhuangfn(this.baozhuangform.id)
          } else {
            return false;
          }
        });
    },
    editbaozhuangfn(id){
      Editbaozhuang(id,this.baozhuangform).then(res =>{this.viewbaozhuang(this.lightnumber);this.editbaozhuangdlg=false;this.open3()})
    },
    eidbaozhuang(data){
      this.baozhuangform = data
      this.baozhuangform.long = ''
      this.baozhuangform.width = ''
      this.baozhuangform.height = ''
      this.editbaozhuangdlg = true
    },
    viewClick(data){
      this.loading2 = true
      this.lightnumber = data.id
      this.view1 = data
      var id = data.id
      GetcailiaoAPI(id).then(res =>{ this.tableData1 = res.data;this.loading2 = false})
    },
    delfn(id){
      DellightAPI(id).then(setTimeout( res =>{this.getlight(this.number)})).then(res =>{this.open2()}).catch(err =>{this.open4})
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.sub()
            this.$refs[formName].resetFields()
            this.getlight(this.number)
          } else {
            return false;
          }
        });
      },
    submitbaozhuangform(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.baozhuangsub(this.lightnumber)
          } else {
            return false;
          }
        });
      },
    baozhuangsub(id){
      this.newbaozhuangdlg = false
      Newbaozhuang(id,this.baozhuangform).then(res =>{this.viewbaozhuang(this.lightnumber);this.open1()})
    },
    submitForm4(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sub4()
        } else {
          return false;
        }
      });
    },
    sub4(){
      AddcailiaoAPI({
          cdate:new Date().getTime(),
          ctype:this.form4.ctype,
          cxtype:this.form4.cxtype,
          coder:this.form4.coder,
          csupplier:this.form4.csupplier,
          csort:this.form4.csort,
          cguige:this.form4.cguige,
          ccolor:this.form4.ccolor,
          ccount:this.form4.ccount,
          cdanwei:this.form4.cdanwei,
          cprice:this.form4.cprice,
          cbeizhu:this.form4.cbeizhu,
          light_id:this.lightnumber,
          rudanname:JSON.parse(sessionStorage.getItem('user'))[0].name	
      }).then((res =>{this.viewClick(this.view1)})).then(res =>{this.open1();this.dlg4=false}).catch(err =>{
        this.$message({
          message:'参数错误',
          type:'warning'
        })
      })
    },
    eidForm4(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.eidform4fn(this.form4.id)
          this.eidcailiaodlg = false
        } else {
          return false;
        }
      });
    },
    eidform4fn(id){
      EditcailiaoAPI(id,this.form4).then((res =>{this.viewClick(this.view1)})).then(res =>{this.open3()}).catch(err =>{this.open4()})
    },
    open2() {
        this.$notify({
          title: '删除成功',
          type: 'warning'
        });
      },
    open4() {
        this.$notify({
          title: '参数出错',
          type: 'warning'
        });
      },
      open1() {
        this.$notify({
          title: '新增成功',
          type: 'success'
        });
      },
      open3() {
        this.$notify({
          title: '修改成功',
          type: 'success'
        });
      },
    eidform(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.eid(this.form1.id)
          this.editdlg=false
          this.$refs[formName].resetFields()
        } else {
          return false;
        }
      });
    },
    searchfn(){
      this.tableData1 = this.tableData1.filter( item => (~item.ctype.indexOf(this.schfilter)));
      this.tableData1 = this.tableData1.filter( item => (~item.cxtype.indexOf(this.schfilter2)));
    },
      eid(id){
        EditlightAPI(id,this.form1).then(res =>{this.getlight(this.number)}).then(res =>{this.open3()}).catch(err =>{
        this.$message({
          message:'参数错误',
          type:'warning'
        })
      })
      },
    getlight(id){
      this.loading1=true
      this.show2 = false
      GetlightAPI(id).then(res =>{this.tableData = res.data;this.loading1=false})
    },
    sub(){
      AddlightAPI({
        oder_id:this.number,
        ltype:this.form2.ltype,
        lsort:this.form2.lsort,
        lsize:this.form2.lsize,
        lcolor:this.form2.lcolor,
        lcount:this.form2.lcount,
        lcost:0,
        lprice:this.form2.lprice,
      }).then(res => {this.getlight(this.number)}).then(res =>{this.open1();this.dlg1 = false}).catch(err =>{
        this.$notify({
          title:'参数错误',
          type:'warning'
        })
      })
    }, 
    getdata(){
      this.loading = true
     GetdingdanAPI().then(res => {this.order = res.data;this.loading = false})
    },
    handleClick(id){
        this.delid = id.id
        this.form1 = id
      },
    resetForm(formName) {
        this.$refs[formName].resetFields();
      }, 
  },
}
</script>
<style scoped>
 .fz{  
   margin: 0 auto; 
   width: 500px;
 }
</style>

