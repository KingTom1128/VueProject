<template>
  <el-container>
    <el-main id="main">
      <div class="container">
        <div class="tab">
          <div class="search">
            <img class="search-icon" height="45px" width="45px" src="./assets/SVG/search.svg" />
            <div @click="action()" class="create">生成路线</div>
          </div>
          <el-button-group style="z-index:100">
            <el-button @click="addPoint()">添加配送点</el-button>
            <el-button @click="deletePointF()">删除配送点</el-button>
            <el-button @click="updatePoint()">修改信息</el-button>
          </el-button-group>
        </div>
        <div class="draw">
          <canvas height="100%" width="100%" id="canvas" ref="canvas"></canvas>
          <div class="setting">
            <div class="setting-top">
              <div class="item">
                <img class="icon" src="./assets/SVG/mine.svg" />
                <div class="text">我的</div>
              </div>
              <div class="item">
                <img class="icon" src="./assets/SVG/road.svg" />
                <div class="text">路况</div>
              </div>
              <div class="item">
                <img class="icon" src="./assets/SVG/mark.svg" />
                <div class="text">标记</div>
              </div>
              <div class="item">
                <img class="icon" src="./assets/SVG/full.svg" />
                <div class="text">全屏</div>
              </div>
            </div>
            <div class="setting-bottom">
              <img class="compass" src="./assets/SVG/compass.svg" />
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <el-footer class="footer">
      <el-dialog title="新建配送点" :visible.sync="newPointInfo">
        <el-form ref="newPoint" :model="newPoint" label-width="140px">
          <el-form-item label="x:">
            <el-input type="number" v-model="newPoint.xValue"></el-input>
          </el-form-item>
          <el-form-item label="y:">
            <el-input type="number" v-model="newPoint.yValue"></el-input>
          </el-form-item>
          <el-form-item label="need:">
            <el-input type="number" v-model="newPoint.need"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="formItemButton"
              type="primary"
              @click="confirmFormPoint('newPoint')"
            >确认</el-button>
            <el-button class="formItemButton" @click="resetFormPoint('newPoint')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="删除配送点" :visible.sync="deletePointInfo">
        <el-form ref="deletePoint" :model="deletePoint" label-width="140px">
          <el-form-item label="x:">
            <el-input type="number" v-model="deletePoint.xValue"></el-input>
          </el-form-item>
          <el-form-item label="y:">
            <el-input type="number" v-model="deletePoint.yValue"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="formItemButton"
              type="primary"
              @click="confirmDeleteFormPoint('deletePoint')"
            >确认</el-button>
            <el-button class="formItemButton" @click="resetFormPoint('deletePoint')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="修改信息" :visible.sync="UpdatePointInfo">
        <el-form ref="pointData" :model="pointData" label-width="140px">
          <el-form-item label="初始点x">
            <el-input type="number" v-model="chushidian.xValue"></el-input>
          </el-form-item>
          <el-form-item label="初始点y">
            <el-input type="number" v-model="chushidian.yValue"></el-input>
          </el-form-item>
          <el-form-item label="车距离限制">
            <el-input type="number" v-model="pointData.chejuli"></el-input>
          </el-form-item>
          <el-form-item label="工人工作时间">
            <el-input type="number" v-model="pointData.gongzuoshijian"></el-input>
          </el-form-item>
          <el-form-item label="油费">
            <el-input type="number" v-model="pointData.youfei"></el-input>
          </el-form-item>
          <el-form-item label="5t车花费">
            <el-input type="number" v-model="pointData.che5huafei"></el-input>
          </el-form-item>
          <el-form-item label="5t车承载量">
            <el-input type="number" v-model="pointData.che5chengzailiang"></el-input>
          </el-form-item>
          <el-form-item label="2t车花费">
            <el-input type="number" v-model="pointData.che2huafei"></el-input>
          </el-form-item>
          <el-form-item label="2t车承载量">
            <el-input type="number" v-model="pointData.che2chengzailiang"></el-input>
          </el-form-item>
          <el-form-item label="车速">
            <el-input type="number" v-model="pointData.chesu"></el-input>
          </el-form-item>
          <el-form-item label="人工费">
            <el-input type="number" v-model="pointData.rengongfei"></el-input>
          </el-form-item>
          <el-form-item label="卸货时间">
            <el-input type="number" v-model="pointData.xiehuoshijian"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="formItemButton" type="primary" @click="confirmForm('pointData')">确认</el-button>
            <el-button class="formItemButton" @click="resetForm('pointData')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'app'
};
</script>

<style>
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
}
canvas {
  background-color: #f5f5f5;
}
.el-footer {
  background-color: #f5f5f5;
  height: 30px;
  justify-content: center;
}
.el-button-group {
  flex-direction: column;
  margin-left: auto;
  margin-right: 150px;
}
.el-button {
  align-self: center;
  margin-left: 30px;
  width: 110px;
  height: 50px;
}
.el-main {
  background-color: #f5f5f5;
  text-align: center;
  height: 100%;
  flex-direction: column;
}
.el-container {
  flex-direction: column;
  height: 100%;
}
.footer {
  display: flex;
}
.formItemButton {
  display: flex;
  margin-left: 100px;
  height: 40px;
  align-self: center;
}
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.tab {
  display: flex;
}
.search {
  width: 450px;
  height: 50px;
  display: flex;
  border-radius: 30px;
  background: #eeeeee;
}
.search-icon {
  margin: auto auto auto 10px;
}
.create {
  border-radius: 30px;
  width: 100px;
  height: 50px;
  line-height: 50px;
  color: #ffffff;
  background: #036eb8;
  margin-left: auto;
  cursor: pointer;
}
.draw {
  height: fit-content;
  width: 100%;
  display: flex;
}
.setting {
  width: 60px;
  height: fit-content;
  margin-left: auto;
  margin-right: 50px;
}
.setting-top {
  background: #ffffff;
  height: fit-content;
}
.item {
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
}
.icon {
  height: 30px;
  width: 30px;
}
.setting-bottom {
  margin-top: 150px;
}
.compass {
  height: 150px;
  width: 150px;
  z-index: 100;
  margin-left: -45px;
}
</style>
<script>
import { calRoute } from "./components/antColony.js";
let Point = [];
let Result = [];
let Temp = [];
let st = [];
// let pos = [
//   [91.2000, 94.3000, 1],
//   [83.4000, 90.4000, 1],
//   [76.7000, 88.8000, 1],
//   [57.8000, 91.4000, 1],
//   [75.6000, 91.4000, 1],
//   [57.8000, 88.0000, 1],
//   [51.1000, 88.9000, 1],
//   [30.0000, 90.6000, 1],
//   [30.0000, 99.4000, 1],
//   [42.2000, 78.1000, 1],
//   [58.9000, 92.7000, 1],
//   [62.3000, 93.2000, 1],
//   [50.0000, 78.9000, 1],
//   [44.5000, 86.7000, 1],
//   [55.6000, 71.2000, 1],
//   [52.3000, 67.3000, 1],
//   [72.3000, 64.7000, 1],
//   [82.3000, 66.0000, 1],
//   [85.6000, 71.2000, 1],
//   [82.3000, 67.3000, 1],
//   [85.6000, 58.2000, 1],
//   [85.6000, 60.8000, 1],
//   [83.4000, 59.5000, 1],
//   [50.0000, 71.7000, 1],
//   [52.3000, 78.4000, 1],
//   [44.5000, 75.8000, 1],
//   [66.0000, 93.6000, 1],
//   [62.2000, 82.9000, 1],
//   [78.9000, 93.2000, 1],
//   [67.8000, 116.5000, 1],
//   [52.2000, 120.4000, 1],
//   [55.6000, 80.2000, 1],
//   [91.2000, 124.3000, 1],
//   [53.3000, 65.9000, 1],
//   [110.0000, 55.0000, 1]
// ];
let canvas;
let ctx;
export default {
  mounted() {
    this.initCanvas();
    window.onresize = () => {
      this.initCanvas();
    };
  },
  data() {
    return {
      chushidian:{
        xValue:"",
        yValue:""
      },
      pointData: {
        chejuli:"",
        gongzuoshijian:"",
        youfei:"",
        che5huafei:"",
        che5chengzailiang:"",
        che2huafei:"",
        che2chengzailiang:"",
        chesu:"",
        rengongfei:"",
        xiehuoshijian:""
      },
      UpdatePointInfo: false,
      newPointInfo: false,
      deletePointInfo: false,
      newPoint: {
        xValue: "",
        yValue: "",
        need: ""
      },
      deletePoint: {
        xValue: "",
        yValue: "",
      }
    };
  },
  methods: {
    initCanvas() {
      // p 配送点矩阵 第一列横坐标 第二列纵坐标 第三列需求货物量
      // Clim 车距离限制
      // Tlim 工人工作时间限制
      // Coil 油费
      // Car1 第一种车 第一个元素承载量 第二元素车的花费
      // Car2 第二种车 第一个元素承载量 第二元素车的花费
      // Var 车速
      // Sman 人工费
      // Tun 每个点的卸货时间
      // stPos 基地坐标
      console.log("初始化canvas");
      canvas = document.getElementById("canvas");
      ctx = canvas.getContext("2d");
      canvas.width = 1350;
      canvas.height = 600;
    },
    action(){
      this.initCanvas();
      Result.splice(0, Result.length);
      Temp.splice(0, Temp.length);
      st.splice(0, st.length);
      st.push(Number(this.chushidian.xValue), Number(this.chushidian.yValue));
      console.log(st);
      console.log(this.pointData);
      this.drawPoint(st[0], st[1], "#000000");
      for(var i = 0; i < Point.length; i++) {
        this.drawPoint(Point[i][0], Point[i][1], "#FF0000");
      }
      Temp = calRoute(
        Point,
        Number(this.pointData.chejuli),
        Number(this.pointData.gongzuoshijian),
        Number(this.pointData.youfei),
        [Number(this.pointData.che5chengzailiang), Number(this.pointData.che5huafei)],
        [Number(this.pointData.che2chengzailiang), Number(this.pointData.che2huafei)],
        Number(this.pointData.chesu),
        Number(this.pointData.rengongfei),
        Number(this.pointData.xiehuoshijian),
        st
      );
      //Temp = calRoute(pos, 5000, 8, 5, [5, 5], [2, 2], 45, 1, 5, st);
      console.log(Temp);
      for (var i = 0; i < Temp.length; i++) {
        for (var j = 2; j < Temp[i].length; j++) {
          if(Number.isNaN(Temp[i][j][0]) && Number.isNaN(Temp[i][j][1])) {
            Result.push([st[0], st[1]]);
          } else {
            Result.push(Temp[i][j]);
          }
        }
        Result.push([]);
      }
      console.log(Result);
      // for (var i = 0; i < Point.length; i++) {
      //   this.drwaLine(Point[i][0], Point[i][1], Result[i][0], Result[i][1]);
      // }
      var c = 0;
      for (var i = 0; i < Result.length - 1; i++) {
        if(Result[i + 1].length != 0) {
          c += 1;
          this.drwaLine(Result[i][0], Result[i][1], Result[i + 1][0], Result[i + 1][1]);
        }
      }
    },
    drawPoint(x, y, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(
        x,
        y,
        5,
        0,
        Math.PI * 2,
        true
      );
      ctx.closePath();
      ctx.fill();
    },
    drwaLine(x1, y1, x2, y2) {
      ctx.strokeStyle = "rgb(255, 0, 0)";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },
    confirmForm(formName) {
      console.log("submit!");
      console.log(formName);
      this.UpdatePointInfo = false;
    },
    resetForm(formName) {
      console.log("reset!");
      this.pointData.chejuli = "";
      this.pointData.gongzuoshijian = "";
      this.pointData.youfei = "";
      this.pointData.che5huafei = "";
      this.pointData.che2huafei = "";
      this.pointData.chesu = "";
      this.pointData.rengongfei = "";
    },
    confirmFormPoint(formName) {
      console.log("submit!");
      Point.push([
        Number(this.newPoint.xValue),
        Number(this.newPoint.yValue),
        Number(this.newPoint.need)
      ]);
      ctx.fillStyle = "#FF0000";
      ctx.beginPath();
      ctx.arc(
        this.newPoint.xValue,
        this.newPoint.yValue,
        5,
        0,
        Math.PI * 2,
        true
      );
      ctx.closePath();
      ctx.fill();
      this.newPointInfo = false;
      this.newPoint.xValue = "";
      this.newPoint.yValue = "";
      this.newPoint.need = "";
      console.log(Point);
    },
    confirmDeleteFormPoint(formName) {
      console.log(this.deletePoint.xValue);
      console.log(this.deletePoint.yValue);
      for(var i = 0; i < Point.length; i++) {
        if(Point[i][0] == this.deletePoint.xValue && Point[i][1] == this.deletePoint.yValue) {
            Point.splice(i, 1);
            ctx.fillStyle = "#f5f5f5";
            ctx.beginPath();
            ctx.arc(
                this.deletePoint.xValue,
                this.deletePoint.yValue,
                6,
                0,
                Math.PI * 2,
                true
            );
            ctx.closePath();
            ctx.fill();
            break;
        }
      }
      this.deletePointInfo = false;
      this.deletePoint.xValue = "";
      this.deletePoint.yValue = "";
    },
    resetFormPoint(formName) {
      console.log("reset!");
      this.newPoint.xValue = "";
      this.newPoint.yValue = "";
    },
    deletePointF() {
      this.deletePointInfo = true;
    },
    addPoint() {
      this.newPointInfo = true;
    },
    updatePoint() {
      this.UpdatePointInfo = true;
    }
  }
};
</script>
