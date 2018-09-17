<style lang="scss">
  @import './menu-tree.scss';
</style>
<template>
  <div class="mtree_content_wrap" v-if="treeDataSource.length>0">
    <ul class="mtree-panel">
      <tree-item v-for="(m,i) in treeDataSource"
                 :key="i"
                 :model="m"
                 :num="i"
                 root="0"
                 :nodes="treeDataSource.length"
                 :callback="func"
                 :handleCreateCallback="handleCreateFunc"
                 :handleEditCallback="handleEditFunc"
                 :handleClearCallback="handleClearFunc"
                 :updateNameCallback="updateNameFunc"
                 :expandfunc="expand"
                 :cxtmenufunc="contextmenu"
                 :trees="treeDataSource">
      </tree-item>
    </ul>
  </div>
</template>

<script>
  import treeItem from './treeItem.vue';

  export default {
    name: "menu-tree",
    components: {
      treeItem
    },
    data() {
      return {
        treeDataSource: []
      }
    },
    props: {
      // 树数据
      list: {
        type: Array,
        twoWay: true
      },
      // 点击节点回调
      func: {
        type: Function,
        default: null
      },
      handleCreateFunc: {
        type: Function,
        default: null
      },
      handleEditFunc: {
        type: Function,
        default: null
      },
      handleClearFunc: {
        type: Function,
        default: null
      },
      updateNameFunc: {
        type: Function,
        default: null
      },
      // 点击展开回调
      expand: {
        type: Function,
        default: null
      },
      // 右击事件
      contextmenu: {
        type: Function,
        default: function () {
          console.log("defalt click contextmenu");
        }
      },
      // 是否展开
      isOpen: {
        type: Boolean,
        twoWay: true,
        default: false
      }
    },
    watch: {
      'list': {
        handler: function () {
          this.initTreeData();
        },
        deep: true
      }
    },
    methods: {
      initTreeData() {
        var tempList = JSON.parse(JSON.stringify(this.list));

        // 递归操作，增加删除一些属性。比如: 展开/收起
        var recurrenceFunc = (data) => {
          data.forEach((m) => {
            if (!m.hasOwnProperty("clickNode")) {
              m.clickNode = m.hasOwnProperty("clickNode") ? m.clickNode : false;
            }

            m.childNodes = m.childNodes || [];
            m.isModify = false;

            if (!m.hasOwnProperty("isFolder")) {
              m.isFolder = m.hasOwnProperty("open") ? m.open : this.isOpen;
            }

            if (!m.hasOwnProperty("isExpand")) {
              m.isExpand = m.hasOwnProperty("open") ? m.open : this.isOpen;
            }

            m.loadNode = 0;

            recurrenceFunc(m.childNodes);


          })
        };

        recurrenceFunc(tempList);

        this.treeDataSource = tempList;
      }
    },
    update() {
      this.initTreeData();
    },
    mounted() {
      this.$nextTick(() => {
        this.initTreeData();
      })
    }
  }
</script>
