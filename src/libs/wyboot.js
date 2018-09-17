import md5 from './md5/md5.js'

export default {
  isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  },
  isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
  },
  isString(o) {
    return Object.prototype.toString.call(o) === '[object String]';
  },
  isBlank(varValue) {
    if (varValue !== null && varValue !== undefined && varValue !== '' && varValue !== 'null') {
      return false;
    }
    return true;
  },
  setBlank(value = '') {
    return value;
  },
  isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    for (let key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
  },
  fore7(arr, func) {
    for (let i = 0, len = arr.length; i < len; i++) {
      let ret = func.call(this, arr[i], i);//回调
      if (typeof ret !== "undefined" && (ret == null || !ret)) break;
    }
  },
  isUrl(urlString) {
    if (urlString !== "") {
      let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      return reg.test(urlString)
    }
  },
  isNull(obj) {
    return obj === null || typeof(obj) === 'undefined'
  },
  setValue(value) {
    return value;
  },
  timeout(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms, 'done');
    });
  },
  isPhoneAvailable(value) {
    let reg = /^(\+?0?86\-?)?1[3456789]\d{9}$/;
    return reg.test(value)
  },
  bool2Int(flag) {
    return flag ? 1 : 0;
  },
  int2Bool(number) {
    return number !== 0;
  },
  queryUrl(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) return decodeURI(r[2]);
    return null;
  },
  getsec(str) {
    let str1 = str.substring(1, str.length) * 1;
    let str2 = str.substring(0, 1);
    if (str2 == "s") {
      return str1 * 1000;
    } else if (str2 == "h") {
      return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
      return str1 * 24 * 60 * 60 * 1000;
    }
  },
  // Set the cookie
  setCookie(name, value, time, path = '/', domain = '.qimiaowa.cn') {
    let strsec = this.getsec(time);
    let exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=" + path + ";domain=" + domain;
  },
  // Read cookies
  getCookie(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
  },
  // Remove cookies
  delCookie() {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = this.getCookie(name);
    if (cval !== null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  },
  isPc() {
    /**
     * To determine whether it is pc || mobile
     * @param flag true则pc，false则mobile
     */
    let userAgentInfo = navigator.userAgent;
    let Agents = ["Android", "iPhone", "webOS", "BlackBerry",
      "SymbianOS", "Windows Phone",
      "iPad", "iPod"];
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  },
  reqAnimationFrame(count, cb, loop = false) {
    let vendors = ['ms', 'moz', 'webkit', 'o'];
    let requestId, cancalRequestId;
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      requestId = window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      cancalRequestId = window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    const step = () => {
      if (loop) {
        requestAnimationFrame(step)
      } else {
        progress += 1;
        if (progress < count) requestAnimationFrame(step);
      }
      cb();
    }

    if (requestAnimationFrame) {
      progress = 0;
      requestAnimationFrame(step);
    }
  },
  destroyIframe(iframe) {
    /**
     * Destroy iframe, free memory.
     * @param iframe Need to destroy the iframe object
     */
    let el = document.getElementById(iframe);
    if (el) {
      try {
        el.src = 'about:blank';
        el.contentWindow.document.write('');
        el.contentWindow.document.clear();
      } catch (e) {
      }
      el.parentNode.removeChild(el);
    }
  },
  trim(str, type = 'Trim') {
    switch (type) {
      case 'Trim':
        return str.replace(/(^\s*)|(\s*$)/g, "");
        break;
      case 'LTrim':
        return str.replace(/(^\s*)/g, "");
        break;
      case 'RTrim':
        return str.replace(/(\s*$)/g, "");
    }
  },
  serializeForm(formId) {
    const evt = {
      /**
       * Gets all the <input> objects in the specified form
       * @param formId
       * @returns {Array}
       */
      getElements(formId) {
        let form = document.getElementById(formId),
          tagElements = form.getElementsByTagName('input'),
          elements = new Array(null);
        if (elements.length > 0) elements = [];
        for (let j = 0, len = tagElements.length; j < len; j++) {
          elements.push(tagElements[j]);
        }
        return elements;
      },
      /**
       * Gets the array of [name, value] in a single input
       * @param element
       * @returns {[*,*]}
       */
      inputSelector(element) {
        if (element.checked) return [element.name, element.value];
      },
      /**
       * Get all element tags
       * @param element
       * @returns {*}
       */
      input(element) {
        switch (element.type.toLowerCase()) {
          case 'submit':
          case 'hidden':
          case 'password':
          case 'text':
            return [element.name, element.value];
          case 'checkbox':
          case 'radio':
            return this.inputSelector(element);
        }
        return false;
      },
      /**
       * Combination element content
       * @param element
       * @returns {*}
       */
      serializeElement(element) {
        return this.input(element);
      }
    }

    // Call method
    let elements = evt.getElements(formId),
      queryComponents = new Object(null);

    for (let i = 0, len = elements.length; i < len; i++) {
      let queryComponent = evt.serializeElement(elements[i]);
      if (queryComponent) queryComponents[queryComponent[0]] = this.trim(queryComponent[1]);
    }

    return queryComponents;
  },
  JMessage: {
    initJIM() {
      window.JIM = new JMessage({debug: false});
      JIM.onDisconnect(() => console.log("【disconnect】")); // Abnormal disconnection monitoring
    },
    startJMessage(options) {
      let username, password, type, callback;
      username = typeof(options.username) !== 'undefined' ? options.username : '';
      password = typeof(options.password) !== 'undefined' ? options.password : '';
      type = typeof(options.type) !== 'undefined' ? options.type : 'online';
      callback = typeof(options.callback) !== 'undefined' ? options.callback : null;
      let appkey = process.env.api.node_env === 'prod' ? "6b6b5d1ec04daf37c2f2dd20" : "d8d6b08170bd9351a618f6f7",
        random_str = "022cd9fd995849b58b3ef0e943421ed9",
        secret = process.env.api.node_env === 'prod' ? "8492311fd4c08cf0cdeebdfe" : "0785a98d6310939f9efd2257",
        timestamp = new Date().getTime(),
        signature = md5.hex_md5(`appkey=${appkey}&timestamp=${timestamp}&random_str=${random_str}&key=${secret}`),
        _this = this;

      if (typeof JIM !== 'undefined') {
        JIM.init({
          "appkey": appkey,
          "random_str": random_str,
          "signature": signature,
          "timestamp": timestamp,
          "flag": 1
        }).onSuccess((data) => {
          console.log('init success');
          _this.registerJIM(username, password, type, (flag) => {
            if (flag) {
              _this.loginJIM(username, password, type, (data) => {
                return callback(data);
              })
            }
          });
        }).onFail((data) => {
          return callback(data);
        });
      } else {
        throw new Error('PLEASE INIT JIM')
      }
    },
    registerJIM(username, password, type, callback) {
      if (typeof JIM !== 'undefined') {
        JIM.register({
          'username': username,
          'password': password
        }).onSuccess((data) => {
          console.log('register_success')
          return callback(true);
        }).onFail((data) => {
          console.log('register_success')
          return callback(true);
        });
      } else {
        throw new Error('PLEASE INIT JIM')
      }
    },
    loginJIM(username, password, type, callback) {
      JIM.login({
        // 'username': 'liufeng',
        // 'password': '123456'
        'username': username,
        'password': password
      }).onSuccess(function (data) {

        switch (type) {
          case 'online':
            console.log('login_success')
            JIM.onMsgReceive(function (data) {
              return callback(data);
            });
            break;
          case 'offline':
            console.log('login_success1')
            JIM.onSyncConversation(function (data) {
              return callback(data);
            });
        }

      }).onFail(function (data) {
        return callback(data)
      }).onTimeout(function (data) {
        return callback(data)
      });
    },
  }
};



