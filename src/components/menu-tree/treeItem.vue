<template>
  <li :class="liClassVal">
    <a :class="aClassVal" @click="Func(model)" @contextmenu.prevent="cxtmenufunc(model)">
      <!--<span :class="spanClassVal" @click="open(model)"></span>-->
      <span :class="spanClass" @click="open(model)"></span>
      <span :class="{loadSyncNode:model.loadNode==1}" v-if="model.loadNode==1"></span>
      <!--<span :class="model.iconClass" v-show="model.iconClass" v-else></span>-->
      <span v-if="!model.isModify" class="node_name">{{model.name}}</span>
      <input v-if="model.isModify" type="text" :id="model.id" class="input-modify" :value="model.name"
             v-on:blur="handleUpdateName($event,model)">
      <span v-if="addButton" class="button add" @click.stop="handleCreateFunc(model)"></span>
      <span v-if="editButton" class="button edit" @click.stop="handleEditFunc(model)"></span>
      <span v-if="removeButton" class="button remove" @click.stop="handleClearFunc(model)"></span>
    </a>
    <ul :class="ulClassVal" v-show="model.isFolder">
      <tree-item
        v-for="(item,i) in model.childNodes"
        :key="i"
        :callback="callback"
        :handleCreateCallback="handleCreateCallback"
        :handleEditCallback="handleEditCallback"
        :handleClearCallback="handleClearCallback"
        :updateNameCallback="updateNameCallback"
        :expandfunc="expandfunc"
        :cxtmenufunc="cxtmenufunc"
        :model="item"
        :num="i"
        root="1"
        :nodes="model.childNodes.length"
        :trees="trees">
      </tree-item>
    </ul>
  </li>
</template>

<script>
  export default {
    name: "tree-item",
    props: {
      addButton: {
        type: Boolean,
        default: false
      },
      editButton: {
        type: Boolean,
        default: true
      },
      removeButton: {
        type: Boolean,
        default: true
      },
      model: {
        type: Object,
        twoWay: true
      },
      num: {
        type: Number,
        twoWay: true
      },
      nodes: {
        type: Number,
        twoWay: true,
        default: 0
      },
      trees: {
        type: Array,
        twoWay: true,
        default: []
      },
      root: {
        type: String,
        twoWay: true
      },
      callback: {
        type: Function
      },
      handleCreateCallback: {
        type: Function
      },
      handleEditCallback: {
        type: Function
      },
      handleClearCallback: {
        type: Function
      },
      updateNameCallback: {
        type: Function
      },
      expandfunc: {
        type: Function
      },
      cxtmenufunc: {
        type: Function
      }
    },
    computed: {
      // 给（根 和 子树）赋值不同的样式
      /*rootClass() {
        var strRootClass = '';

        // 根判断
        if (this.root == '0') {
          this.model.childNodes = this.model.childNodes || [];
          strRootClass = (this.num == 0 && this.model.childNodes.length == 0) ? "noline_" : (this.nodes == 1) || (this.num == 0 && this.nodes != this.num + 1) ?
            "noline_" : (this.nodes == this.num + 1) ? "bottom_" : "center_";

          // 子树判断
        } else if (this.root == '1') {
          this.model.childNodes = this.model.childNodes || [];
          strRootClass = this.nodes > 1 && this.model.childNodes.length > 0 && this.nodes != this.num + 1
            ? "center_" :
            (this.num == 0 && this.nodes > 1) || (this.nodes != this.num + 1) ? "center_docu" :
              this.nodes == 1 && this.num != 0 || (this.nodes == this.num + 1 && this.model.childNodes.length > 0) ? "bottom_" : "bottom_docu";
        }

        return strRootClass
      },*/
      // 是否有儿子节点
      isChildren() {
        return this.num + 1 != this.nodes;
      },
      // 展开/收起
      /*prefixClass() {
        var returnChar = "";
        if (this.rootClass.indexOf("docu") == -1) {
          if (this.model.isFolder) {
            returnChar = "open";
          } else {
            returnChar = 'close'
          }
        }

        if (this.model.childNodes.length == 0 && this.rootClass.indexOf("docu") == -1) {
          returnChar = 'close'
        }

        return returnChar;
      },*/
      liClassVal() {
        return "level" + this.num;
      },
      spanClass() {
        if (this.model.childNum > 0) {
          if (this.model.isFolder) {
            return "button level" + this.num + " switch noline_open";
          } else {
            return "button level" + this.num + " switch noline_close";
          }
        } else {
          return "button level" + this.num + " switch bottom_docu";
        }

      },
      /*spanClassVal() {
        return "button level" + this.num + " switch " + this.rootClass + this.prefixClass;
      },*/
      aClassVal() {
        return this.model.clickNode ? "level" + this.num + ' curSelectedNode' : "level" + this.num;
      },
      ulClassVal() {
        return this.isChildren && this.model.childNodes.length > 0 ? "level" + this.num + ' line' : "level" + this.num;
      }
    },
    methods: {
      Func(m) {
        // 查找点击的子节点
        var recurFunc = (data, list) => {
          data.forEach((i) => {
            if (i.id == m.id) {
              i.clickNode = true;

              if (typeof this.callback == "function") {
                this.callback.call(null, m, list, this.trees);
              }
            } else {
              i.clickNode = false;
            }

            if (i.childNodes) {
              recurFunc(i.childNodes, i);
            }
          })
        }

        recurFunc(this.trees, this.trees);
      },
      open(m) {
        //
        m.isExpand = !m.isExpand;

        if (typeof this.expandfunc == "function" && m.isExpand) {
          if (m.loadNode != 2) {
            //
            this.expandfunc.call(null, m);
          } else {
            m.isFolder = !m.isFolder;
          }
        } else {
          m.isFolder = !m.isFolder;
        }
      },
      handleCreateFunc(m) {
        // 查找点击的子节点
        var recurFunc = (data, list) => {
          data.forEach((i) => {
            if (i.id == m.id) {
              i.clickNode = true;

              if (typeof this.handleCreateCallback == "function") {
                this.handleCreateCallback.call(null, m, list, this.trees);
              }
            } else {
              i.clickNode = false;
            }

            if (i.childNodes) {
              recurFunc(i.childNodes, i);
            }
          })
        }

        recurFunc(this.trees, this.trees);
      },
      handleEditFunc(m) {
        // 查找点击的子节点
        var recurFunc = (data, list) => {
          data.forEach((i) => {
            if (i.id == m.id) {
              i.clickNode = true;

              if (typeof this.handleEditCallback == "function") {
                this.handleEditCallback.call(null, m, list, this.trees);
              }
            } else {
              i.clickNode = false;
            }

            if (i.childNodes) {
              recurFunc(i.childNodes, i);
            }
          })
        }

        recurFunc(this.trees, this.trees);
        m.isModify = true;
        setTimeout(() => {
          if (document.getElementById(`${m.id}`)) {
            document.getElementById(`${m.id}`).focus();
          }
        }, 50)
      },
      handleClearFunc(m) {
        // 查找点击的子节点
        var recurFunc = (data, list) => {
          data.forEach((i) => {
            if (i.id == m.id) {
              i.clickNode = true;

              if (typeof this.handleClearCallback == "function") {
                this.handleClearCallback.call(null, m, list, this.trees);
              }
            } else {
              i.clickNode = false;
            }

            if (i.childNodes) {
              recurFunc(i.childNodes, i);
            }
          })
        }

        recurFunc(this.trees, this.trees);
      },
      handleUpdateName(event, m) {
        this.updateNameCallback.call(null, event, m);
      }
    }
  }
</script>
