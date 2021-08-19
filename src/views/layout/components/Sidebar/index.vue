<template>
  <scroll-bar>
    <el-menu mode="vertical" :unique-opened="false" :collapse-transition="false" :default-openeds='["Task"]' :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="addRouters"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar',
      'addRouters'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
