/**
 * Created by zhang.huawei.
 */

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).Format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).Format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */

export function Format(fmt, time) {
  time = new Date(time);
  var o = {
    'M+': time.getMonth() + 1, //月份
    'd+': time.getDate(), //日
    'h+': time.getHours() % 12 == 0 ? 12 : time.getHours() % 12, //小时
    'H+': time.getHours(), //小时
    'm+': time.getMinutes(), //分
    's+': time.getSeconds(), //秒
    'q+': Math.floor((time.getMonth() + 3) / 3), //季度
    S: time.getMilliseconds() //毫秒
  };
  var week = {
    '0': '/u65e5',
    '1': '/u4e00',
    '2': '/u4e8c',
    '3': '/u4e09',
    '4': '/u56db',
    '5': '/u4e94',
    '6': '/u516d'
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[time.getDay() + '']);
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

/**
 * 日期时间格式化字符串
 */
export function formatDateTime(time, fmt) {
  var obj = {   
      "M+" : time.getMonth()+1,                 //月份   
      "d+" : time.getDate(),                    //日   
      "H+" : time.getHours(),                   //小时   
      "m+" : time.getMinutes(),                 //分   
      "s+" : time.getSeconds(),                 //秒   
      "q+" : Math.floor((time.getMonth()+3)/3), //季度   
      "S"  : time.getMilliseconds()             //毫秒   
  }; 
  
  if(/(y+)/.test(fmt))   
      fmt=fmt.replace(RegExp.$1, (time.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in obj)   
      if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (obj[k]) : (("00"+ obj[k]).substr((""+ obj[k]).length)));   
  return fmt;
}

/**
 * 字符串转化为日期
 */

export function parseDateTime(strDateTime) {  
    //strDateTime为需要转换成日期格式的字符串  
    var date = eval('new Date(' + strDateTime.replace(/\d+(?=-[^-]+$)/,  function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');  
    return date;  
}

export function stringToDate(strDateTime){

    var tempStrs = strDateTime.split(" ");
    var dateStrs = tempStrs[0].split("-");

    var year = parseInt(dateStrs[0], 10);
    var month = parseInt(dateStrs[1], 10) - 1;
    var day = parseInt(dateStrs[2], 10);
    var timeStrs = tempStrs[1].split(":");
    var hour = parseInt(timeStrs [0], 10);
    var minute = parseInt(timeStrs[1], 10);
    var second = parseInt(timeStrs[2], 10);
	
    var date = new Date(year, month, day, hour, minute, second);

    return date;

}

/*********************************************************************************************************************/

function parse(val) {
  return typeof val == 'string' ? JSON.parse(val) : val;
}
function stringify(val) {
  return typeof val == 'string' ? JSON.stringify(val) : val;
}
//将度转换成为度分秒
export function formatDegree(value) {
  value = Math.abs(value);
  var v1 = Math.floor(value); //度
  var v2 = Math.floor((value - v1) * 60); //分
  var v3 = Math.round(((value - v1) * 3600) % 60); //秒
  return v1 + '°' + v2 + '′' + v3 + '″';
}
//度分秒转换成为度
export function DegreeConvertBack(value) {
  var du = value.split('°')[0];
  var fen = value.split('°')[1].split('′')[0];
  var miao = value
    .split('°')[1]
    .split('′')[1]
    .split('″')[0];
  var f = parseFloat(fen) + parseFloat(fen / 60);
  du = parseFloat(f / 60) + parseFloat(du);
  return du;
}
/*
 * 深度合并对象
 */
function deepAssign(FirstOBJ, SecondOBJ) {
  if (!typeof FirstOBJ == 'object' && typeof SecondOBJ == 'object') return;
  for (var key in SecondOBJ) {
    FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]' ? deepAssign(FirstOBJ[key], SecondOBJ[key]) : (FirstOBJ[key] = SecondOBJ[key]);
  }
  return FirstOBJ;
}
/*
 * @desc 切割数组,如果一个数组比较大,切割成几个小段进行操作
 * @param {Array} array 需要进行切割的数组
 * @param {Number} size 切割成多少段
 * @param {Number} time 每次切割间隔多久
 * @param {Function} callback 每次切割成功后的回调
 */
function chunk(array, size, time, callback) {
  //size ? size : size = Math.floor(array.length / 1000);
  let length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  let index = 0,
    resIndex = 0,
    result = Array(Math.ceil(length / size));
  while (index < length) {
    result[resIndex++] = array.slice(index, (index += size));
  }
  result.forEach(element => {
    element.forEach(ele => {
      setTimeout(() => {
        callback(ele);
      }, time);
    });
  });
}
//数组去重
function unique(arr) {
  arr = arr || [];
  var a = {};
  var len = arr.length;
  for (let i = 0; i < len; i++) {
    var v = arr[i];
    if (typeof a[v] == 'undefined') {
      a[v] = 1;
    }
  }
  arr.length = 0;
  for (var i in a) {
    arr[arr.length] = i;
  }
  return arr;
}
// 数组中所有元素的和
function arrSum(array) {
  var sum = array.reduce(function(prev, next, index, array) {
    return prev + next;
  });
  return sum;
}
// 去重2
const deduplication = arr => [...new Set(arr)];

// 保留非重复数据
const filterNonUnique = arr => arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i));
// 数组保留重复数据
const saveUnique = arr => arr.filter(i => arr.indexOf(i) !== arr.lastIndexOf(i));

// 查找数组中相等的项
function findEqual(arr, key, val) {
  for (var i = 0; i < arr.length; i++) {
    let ele = arr[i];
    if (ele[key] === val) {
      return ele;
    }
  }
  return null;
}
// 根据val查找数组对象中相同val的项,返回Object,根据id查找tree数据中相等数据label
function findKeyValue(arr, val) {
  let obj;
  function test(arr) {
    arr.forEach(ele => (ele.id === val ? (obj = ele) : ele.children ? test(ele.children) : ''));
  }
  test(arr);
  return obj;
}
//数组去重并合并
function arrEqualConcat(a, b) {
  for (var i = 0; i < b.length; i++) {
    for (var j = 0; j < a.length; j++) {
      if (a[j].id == b[i].id) {
        a.splice(j, 1);
        j = j - 1;
      }
    }
  }
  return a;
}
// 函数节流
/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
function throttle(func, wait, type) {
  if (type === 1) {
    var previous = 0;
  } else if (type === 2) {
    var timeout;
  }
  return function() {
    let context = this;
    let args = arguments;
    if (type === 1) {
      let now = Date.now();

      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    }
  };
}
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    }
  };
}
// 添加操作
function addHandle(methods, context) {
  let _this = context;
  return new Promise(function(resove, reject) {
    return methods.then(res => {
      resove(res);
      if (res.Code === 'success' && res.Result) {
        _this.$message.success('添加成功');
      } else {
        _this.$message.error('添加失败');
      }
    });
  });
}
// 删除操作
function delHandle(methods, context) {
  let _this = context;
  return new Promise(function(resove, reject) {
    _this
      .$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        return methods.then(res => {
          resove(res);
          if (res.Code === 'success' && res.Result) {
            _this.$message.success('删除成功');
          } else {
            _this.$message.error('删除失败');
          }
        });
      });
  });
}

// 编辑操作
function editHandle(methods, context) {
  let _this = context;
  return new Promise(function(resove, reject) {
    return methods.then(res => {
      resove(res);
      if (res.Code === 'success' && res.Result) {
        _this.$message.success('修改成功');
      } else {
        _this.$message.error('修改失败');
      }
    });
  });
}


/**
 *  @description: 对象转 url
 *  @param {Object} obj 对象形式
 *  @return {String} 字符串 类似 news_id=144&scorce=seo
 *  @author: wangchaoxu
 *  @remark 有bug,参数有时间的话,会被格式化
 *
 */
function jsonToUrl(obj) {
  obj = JSON.stringify(obj);
  return obj
    .replace(/:/g, '=')
    .replace(/"/g, '')
    .replace(/,/g, '&')
    .match(/\{([^)]*)\}/)[1];
}

/**
 * 去除对象中所有符合条件的对象
 * @param {Object} obj 来源对象
 * @param {Function} fn 函数验证每个字段
 */
function compactObj(obj, fn) {
  for (var i in obj) {
    if (typeof obj[i] === 'object') {
      compactObj(obj[i], fn);
    }
    if (fn(obj[i])) {
      delete obj[i];
    }
  }
}
// 删除空对象 删除'', null, undefined
function isEmpty(foo) {
  if (typeof foo === 'object') {
    for (var i in foo) {
      return false;
    }
    return true;
  } else {
    return foo === '' || foo === null || foo === undefined;
  }
}
// 获取tree数据中所有为真的数据
function treeDataFilter(data) {
  return data.map(item => {
    compactObj(item, isEmpty);
    return item;
  });
}
/*
    数组对象求和
*/
function obj_sum(arr, ...param) {
  var temp = {};
  arr.forEach(function(item, index) {
    for (var k in item) {
      if (param.indexOf(k) >= 0) {
        if (typeof item[k] == 'string') {
          item[k] = item[k] * 1;
        }
        if (temp[k]) {
          temp[k] += item[k];
        } else {
          temp[k] = item[k];
        }
      }
    }
  });
  return temp;
}


/******************************************************************/

//生成从minNum到maxNum的随机数, [n,m]
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      //return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
      return Math.floor(Math.random() * ( maxNum - minNum + 1 ) + minNum);
      break;
    default:
      return 0;
      break;
  }
}

// 测试数据: 2020/10/15 16:51:24 JulianDate {dayNumber: 2459137, secondsOfDay: 75098.578}

// Date(yyyy/MM/dd) -> Julian day
function dateToJulianNumber(d) {
    // convert a Gregorian Date to a Julian number. 
    //    S.Boisseau / BubblingApp.com / 2014
    var x = Math.floor((14 - d.getMonth())/12);
    var y = d.getFullYear() + 4800 - x;
    var z = d.getMonth() - 3 + 12 * x;

    var n = d.getDate() + Math.floor(((153 * z) + 2)/5) + (365 * y) + Math.floor(y/4) + Math.floor(y/400) - Math.floor(y/100) - 32045;

    return n;
}

// Julian day -> Date(Y, M, D)
function julianIntToDate(n) {
    // convert a Julian number to a Gregorian Date.
    //    S.Boisseau / BubblingApp.com / 2014
    var a = n + 32044;
    var b = Math.floor(((4*a) + 3)/146097);
    var c = a - Math.floor((146097*b)/4);
    var d = Math.floor(((4*c) + 3)/1461);
    var e = c - Math.floor((1461 * d)/4);
    var f = Math.floor(((5*e) + 2)/153);

    var D = e + 1 - Math.floor(((153*f) + 2)/5);
    var M = f + 3 - 12 - Math.round(f/10);
    var Y = (100*b) + d - 4800 + Math.floor(f/10);

    return new Date(Y,M,D);
}

// Date对象深拷贝
function dateDeepClone(date) {
	return new Date(date.valueOf());
}


export {
  parse,
  stringify,
  deepAssign,
  chunk,
  unique,
  findEqual,
  findKeyValue,
  addHandle,
  delHandle,
  editHandle,
  arrEqualConcat,
  saveUnique,
  arrSum,
  jsonToUrl,
  treeDataFilter,
  obj_sum,
  throttle,
  debounce,
  randomNum,
  dateToJulianNumber,
  julianIntToDate,
  dateDeepClone
};
