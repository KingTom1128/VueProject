function randomNeed (n) {
  // 随机产生点需求
  var ans = new Array(n);
  for (var i = 0; i < ans.length; ++i) {
    ans[i] = Math.floor(Math.random() * 51) / 10;
  }
  return ans;
}

function randomPerm (n) {
  // 产生一个数据范围在0~n-1的不重复序列
  var ans = new Array(n);
  for (var i = 0; i < n; ++i) {
    ans[i] = i;
  }
  ans.sort(function () {
    return (Math.random() - 0.5);
  })
  return ans;
}

function calPDis (ax, ay, bx, by) {
  // 计算两点之间的距离
  return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
}

function set2Array (n, m, val) {
  // 初始化一个n*m的数组，赋予初值val
  var ans = new Array(n);
  for (var i = 0; i < n; ++i) {
    ans[i] = new Array(m);
    for (var j = 0; j < m; ++j) {
      ans[i][j] = val;
    }
  }
  return ans;
}

function getSum (a) {
  // 计算数组a的和
  var sum = 0;
  for (var i = 0; i < a.length; ++i) {
    sum += a[i];
  }
  return sum;
}

function calAntColony (c, ncMax, m, alpha, beta, rho, q) {
  // 蚁群算法
  // c为坐标点数组
  // ncMax 迭代次数
  // m 蚂蚁个数
  // alpha 信息素重要程度
  // beta 启发式因子重要程度
  // rho 信息素蒸发系数
  // q 信息素增加强度系数
  // var C = new Array();
  // for(var i = 0; i < 40; ++i){
  //     C[i] = new Array(2);
  // }
  var i, j, k;
  var n = c.length;
  var d = set2Array(n, n, 0);
  for (i = 0; i < n; ++i) {
    for (j = i; j < n; ++j) {
      if (i != j) { //eslint-disable-line 
        d[i][j] = calPDis(c[i][0], c[i][1], c[j][0], c[j][1]);
      } else {
        d[i][j] = Math.pow(0.1, 1e9);
      }
      d[j][i] = d[i][j];
    }
  }
  var eta = set2Array(n, n, 0);
  for (i = 0; i < n; ++i) {
    for (j = 0; j < n; ++j) {
      eta[i][j] = 1 / d[i][j];
    }
  }
  var tau = set2Array(n, n, 1);
  var tabu = set2Array(m, n, 0);
  var nc = 0;
  var rBest = set2Array(ncMax, n, 0);
  var lBest = set2Array(ncMax, 1, Infinity);
  var lAve = set2Array(ncMax, 1, 0);

  while (nc < ncMax) {
    var randPos = new Array(0);
    for (i = 1; i <= Math.ceil(m / n); ++i) {
      randPos = randPos.concat(randomPerm(n));
    }
    // console.log(randPos);
    for (i = 0; i < m; ++i) {
      tabu[i][0] = randPos[i];
    }
    // console.log(tabu);
    // Tabu(:,1) = (Randpos(1,1:m))';
    for (j = 1; j < n; ++j) {
      for (i = 0; i < m; ++i) {
        var visited = new Array(j);
        // console.log(j);
        for (var tt = 0; tt < j; ++tt) {
          visited[tt] = tabu[i][tt];
        }
        // visited = Tabu(i, 1:(j-1));
        var tempJ = new Array(n - j);
        var tempP = new Array(n - j);
        for (k = 0; k < tempJ.length; ++k) {
          tempJ[k] = 0;
          tempP[k] = 0;
        }
        var tempJc = 0;
        for (k = 0; k < n; ++k) {
          if (visited.indexOf(k) == -1) { //eslint-disable-line 
            tempJ[tempJc] = k;
            tempJc++;
          }
        }
        // console.log(tempJ);
        // console.log(tau);
        // console.log(visited);
        // console.log(tabu[i]);
        for (k = 0; k < tempJ.length; ++k) {
          tempP[k] = Math.pow(tau[visited[visited.length - 1]][tempJ[k]], alpha) *
            Math.pow(eta[visited[visited.length - 1]][tempJ[k]], beta);
        }
        tt = getSum(tempP);
        for (k = 0; k < tempP.length; ++k) {
          tempP[k] /= tt;
        }
        var tempPP = new Array(n - j);
        tempPP[0] = tempP[0];
        for (k = 1; k < tempPP.length; ++k) {
          tempPP[k] = tempP[k] + tempPP[k - 1];
        }
        tt = Math.random();
        var toVisit;
        // console.log(tempJ);
        for (k = 0; k < tempPP.length; ++k) {
          if (tempPP[k] >= tt) {
            toVisit = tempJ[k];
            tabu[i][j] = toVisit;
            break;
          }
        }
        // console.log(toVisit);
      }
    }
    if (nc >= 1) {
      // console.log(rBest);
      for (i = 0; i < rBest[nc - 1].length; ++i) {
        tabu[0][i] = rBest[nc - 1][i];
      }
    }
    var l = new Array(m);
    for (i = 0; i < m; ++i) {
      l[i] = 0;
      var r = tabu[i];
      for (j = 0; j < n - 1; ++j) {
        l[i] += d[r[j]][r[j + 1]];
      }
      l[i] += d[r[0]][r[n - 1]];
    }
    var pos = 0;
    var ave = 0;
    for (i = 0; i < l.length; ++i) {
      if (l[i] < lBest[nc]) {
        lBest[nc] = l[i];
        pos = i;
      }
      ave += l[i];
    }
    rBest[nc] = tabu[pos];
    lAve[nc] = ave / l.length;
    nc = nc + 1;
    var deltaTau = set2Array(n, n, 0);
    for (i = 0; i < m; ++i) {
      for (j = 0; j < n - 1; ++j) {
        deltaTau[tabu[i][j]][tabu[i][j + 1]] += q / l[i];
      }
      deltaTau[tabu[i][n - 1]][tabu[i][0]] += q / l[i];
    }
    for (i = 0; i < tau.length; ++i) {
      for (j = 0; j < tau[i].length; ++j) {
        tau[i][j] = (1 - rho) * tau[i][j] + deltaTau[i][j];
      }
    }
    tabu = set2Array(m, n, 0);
  }
  var ansarr = new Array(3);
  // 答案数组
  ansarr[0] = 0;
  for (i = 0; i < lBest.length; ++i) {
    if (lBest[i] < lBest[ansarr[0]]) {
      ansarr[0] = i;
    }
  }
  // 下标0位置存放选择了迭代第几次的答案
  ansarr[1] = rBest[ansarr[0]];
  // 下表1位置为一个数组，为路线
  ansarr[2] = lBest[ansarr[0]];
  // 下表2位置为路线的最短距离
  return ansarr;
}

function sortPByDisB2S (a, b) {
  var aa = calPDis(0, 0, a[0], a[1]);
  var bb = calPDis(0, 0, b[0], b[1]);
  return bb - aa;
}

function sortPByDisS2B (a, b) {
  var aa = calPDis(0, 0, a[0], a[1]);
  var bb = calPDis(0, 0, b[0], b[1]);
  return aa - bb;
}

function calRoute (p, Clim, Tlim, Coil, Car1, Car2, Vcar, Sman, Tun, stPos) {
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

  var i, j, k;
  var ansRoute = [];
  var pos = set2Array(p.length, 3, 0);
  var time5, time2;

  for (i = 0; i < p.length; ++i) {
    pos[i][0] = p[i][0] - stPos[0];
    pos[i][1] = p[i][1] - stPos[1];
    pos[i][2] = p[i][2];
  }

  while (pos.length > 0) {
    pos.sort(sortPByDisB2S);
    var npos = set2Array(pos.length - 1, 3, 0);
    var n5ch = [];
    for (i = 0; i < npos.length; ++i) {
      npos[i][0] = pos[i + 1][0] - pos[0][0];
      npos[i][1] = pos[i + 1][1] - pos[0][1];
      npos[i][2] = pos[i + 1][2];
    }
    // 位移 使得一号点在原点
    npos.sort(sortPByDisS2B);
    // 距离一号点 小到大排序
    for (i = 0; i < npos.length; ++i) {
      npos[i][0] += pos[0][0];
      npos[i][1] += pos[0][1];
    }
    // 位移 使得坐标归位
    var n5Carry = Car1[0] - pos[0][2];
    for (i = 0; i < npos.length; ++i) {
      if (n5Carry - npos[i][2] >= 0) {
        n5Carry -= npos[i][2];
        n5ch.push(i);
      }
    }
    // 根据需求 备选点
    var ant5Pos = set2Array(n5ch.length + 2, 2, 0);
    ant5Pos[0] = [0, 0];
    ant5Pos[1][0] = pos[0][0];
    ant5Pos[1][1] = pos[0][1];
    for (i = 2; i < ant5Pos.length; ++i) {
      ant5Pos[i][0] = npos[n5ch[i - 2]][0];
      ant5Pos[i][1] = npos[n5ch[i - 2]][1];
    }
    // 建立蚁群算法所需坐标点
    var ans5 = calAntColony(ant5Pos, 2000, 30, 0.9, 0.9, 0.1, 0.1);
    time5 = ans5[2] * 60 / Vcar + ant5Pos.length * Tun;
    while ((ans5[2] > Clim || time5 > Tlim * 60) && n5ch.length > 0) {
      ant5Pos.pop();
      n5Carry += npos[n5ch.pop()][2];
      ans5 = calAntColony(ant5Pos, 2000, 30, 0.9, 0.9, 0.1, 0.1);
      time5 = ans5[2] * 60 / Vcar + ant5Pos.length * Tun;
    }
    // 去点直到满足条件
    // console.log(ans5);
    // console.log(n5ch);
    var Val5 = (Car1[1] + Coil * ant5Pos.length + (ans5[2] / Vcar + ant5Pos.length / 12) * Sman) / (Car1[0] - n5Carry);
    // 计算成本
    // console.log(npos);

    if (pos[0][2] <= Car2[0] && Car2[0] != Car1[0]) { //eslint-disable-line 
      // 2t车跑点(另一种车)
      var n2ch = [];
      var n2Carry = Car2[0] - pos[0][2];
      for (i = 0; i < npos.length; ++i) {
        if (n2Carry - npos[i][2] >= 0) {
          n2Carry -= npos[i][2];
          n2ch.push(i);
        }
      }
      var ant2Pos = set2Array(n2ch.length + 2, 2, 0);
      ant2Pos[0] = [0, 0];
      ant2Pos[1][0] = pos[0][0];
      ant2Pos[1][1] = pos[0][1];
      for (i = 2; i < ant2Pos.length; ++i) {
        ant2Pos[i][0] = npos[n2ch[i - 2]][0];
        ant2Pos[i][1] = npos[n2ch[i - 2]][1];
      }
      var ans2 = calAntColony(ant2Pos, 2000, 30, 0.9, 0.9, 0.1, 0.1);
      time2 = ans2[2] * 60 / Vcar + ant2Pos.length * Tun;
      while ((ans2[2] > Clim || time2 > Tlim * 60) && n2ch.length > 0) {
        ant2Pos.pop();
        n2Carry += npos[n2ch.pop()][2];
        ans2 = calAntColony(ant2Pos, 2000, 30, 0.9, 0.9, 0.1, 0.1);
        time2 = ans2[2] * 60 / Vcar + ant2Pos.length * Tun;
      }
      var Val2 = (Car2[1] + Coil * ant2Pos.length + (ans2[2] / Vcar + ant2Pos.length / 12) * Sman) / (Car2[0] - n2Carry);

      if (Val2 > Val5) {
        // 2t车跑更优秀
        ansRoute.push(new Array(ans2[1].length));
        // 添加答案路线数组
        j = ansRoute.length;
        for (i = 0; i < ans2[1].length; ++i) {
          ansRoute[j - 1][i] = [];
          if (ans2[1][i] == 1) { //eslint-disable-line 
            ansRoute[j - 1][i][0] = pos[0][0];
            ansRoute[j - 1][i][1] = pos[0][1];
          } else if (ans2[1][i] != 0) { //eslint-disable-line 
            k = n2ch[ans2[1][i] - 2];
            ansRoute[j - 1][i][0] = npos[k][0];
            ansRoute[j - 1][i][1] = npos[k][1];
          }
          ansRoute[j - 1][i][0] += Number(stPos[0]);
          ansRoute[j - 1][i][1] += Number(stPos[1]);
          // 原点位移回基地
        }
        ansRoute[j - 1].unshift(time2 / 60);
        ansRoute[j - 1].unshift(Car2[0]);
        pos = [];
        j = 0;
        for (i = 0; i < npos.length; ++i) {
          if (j < n2ch.length) {
            if (i < n2ch[j]) {
              pos.push([npos[i][0], npos[i][1], npos[i][2]]);
            } else if (i == n2ch[j]) { //eslint-disable-line 
              j++;
            }
          } else {
            pos.push([npos[i][0], npos[i][1], npos[i][2]]);
          }
        }
        // console.log(ans2);
        // console.log(pos);
        continue;
      }
    }

    ansRoute.push(new Array(ans5[1].length));
    j = ansRoute.length;
    for (i = 0; i < ans5[1].length; ++i) {
      ansRoute[j - 1][i] = [];
      if (ans5[1][i] == 1) { //eslint-disable-line 
        ansRoute[j - 1][i][0] = pos[0][0];
        ansRoute[j - 1][i][1] = pos[0][1];
      } else if (ans5[1][i] != 0) { //eslint-disable-line 
        k = n5ch[ans5[1][i] - 2];
        ansRoute[j - 1][i][0] = npos[k][0];
        ansRoute[j - 1][i][1] = npos[k][1];
      }
      ansRoute[j - 1][i][0] += stPos[0];
      ansRoute[j - 1][i][1] += stPos[1];
      // 原点位移回基地
    }
    ansRoute[j - 1].unshift(time5 / 60);
    ansRoute[j - 1].unshift(Car1[0]);
    pos = [];
    j = 0;
    for (i = 0; i < npos.length; ++i) {
      if (j < n5ch.length) {
        if (i < n5ch[j]) {
          pos.push([npos[i][0], npos[i][1], npos[i][2]]);
        } else if (i == n5ch[j]) { //eslint-disable-line 
          j++;
        }
      } else {
        pos.push([npos[i][0], npos[i][1], npos[i][2]]);
      }
    }
    // console.log(ans5);
    // console.log(pos);
  }

  return ansRoute;
}
export {
  randomNeed,
  randomPerm,
  calPDis,
  set2Array,
  getSum,
  calAntColony,
  sortPByDisB2S,
  sortPByDisS2B,
  calRoute
}

// var pos = new Array(
//   [91.2000, 94.3000],
//   [83.4000, 90.4000],
//   [76.7000, 88.8000],
//   [57.8000, 91.4000],
//   [75.6000, 91.4000],
//   [57.8000, 88.0000],
//   [51.1000, 88.9000],
//   [30.0000, 90.6000],
//   [30.0000, 99.4000],
//   [42.2000, 78.1000],
//   [58.9000, 92.7000],
//   [62.3000, 93.2000],
//   [50.0000, 78.9000],
//   [44.5000, 86.7000],
//   [55.6000, 71.2000],
//   [52.3000, 67.3000],
//   [72.3000, 64.7000],
//   [82.3000, 66.0000],
//   [85.6000, 71.2000],
//   [82.3000, 67.3000],
//   [85.6000, 58.2000],
//   [85.6000, 60.8000],
//   [83.4000, 59.5000],
//   [50.0000, 71.7000],
//   [52.3000, 78.4000],
//   [44.5000, 75.8000],
//   [66.0000, 93.6000],
//   [62.2000, 82.9000],
//   [78.9000, 93.2000],
//   [67.8000, 116.5000],
//   [52.2000, 120.4000],
//   [55.6000, 80.2000],
//   [91.2000, 124.3000],
//   [53.3000, 65.9000],
//   [110.0000, 55.0000]);

// /*
// var pos = new Array(
//     [100, 200],
//     [200, 300],
//     [300, 100],
//     [400, 400]
// )
// */
// // 预设pos 即坐标数组。
// // var ans = calAntColony(pos, 2000, 30, 0.9, 0.9, 0.1, 0.1);
// // 相关数据在ans里，ans的解释见蚁群算法函数最末
// // console.log(ans);
// var needP = randomNeed(35);
// // needP 每个点的需求数组 这里随机产生
// // var needP = new Array(4, 1, 1, 1, 1);
// var stPos = new Array(0, 0);
// // stPos 基点 这里默认(0,0)
// var i, j;
// for (i = 0; i < pos.length; ++i) {
//   pos[i].push(needP[i]);
// }
// // 将需求数组并入pos数组
// pos.sort(sortPByDisB2S);
// console.log(pos);
// // pos 按距离 大到小排序
// var ans = calRoute(pos, 5000, 7.5, 5, [5, 5], [2, 2], 45, 1, 5, stPos);
// // 分配路线
// // 点矩阵 距离限制km 时间限制h 油费元/km 第一种车信息 第二种车信息 车速km/h 人工费元/h 卸货时间分钟
// // 注意第一种车载货量应大于第二种车
// console.log(ans);
// // ans数组，每行一个数组，数组第一个元素代表车是5t/2t，第二元素是车辆所花时间，后面的元素代表一辆车的路线
// var maxTime = 0;
// // maxTime记录耗时最长时间
// for (i = 0; i < ans.length; ++i) {
//   maxTime = Math.max(maxTime, ans[i][1]);
// }
// console.log(maxTime);
// // 将路线上的点位移回到原始数据
// // var ss = 0;
// // for (i = 0; i < ans.length; ++i){
// //     ss += ans[i].length;
// // }
// // console.log(ss-ans.length*3);
// // 验证是否走完所有点
