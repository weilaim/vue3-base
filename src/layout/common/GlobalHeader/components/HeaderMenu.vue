<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { MenuOption } from 'naive-ui';
import { useRouteStore, useThemeStore } from '@/store';
import { useRouterPush } from '@/composables';

const { routerPush } = useRouterPush();
const route = useRoute();
const routeStore = useRouteStore();
const menus = computed(() => routeStore.menus as GlobalMenuOption[]);
const activeKey = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string);
const theme = useThemeStore();

function handleUpdateMenu(_key: string, item: MenuOption) {
  const menuItem = item as GlobalMenuOption;
  routerPush(menuItem.routePath);
}
</script>
<template>
  <div class="flex-1-hidden h-full px-10px">
    <n-scrollbar :x-scrollable="true" class="flex-1-hidden h-full" content-class="h-full">
      <div class="flex-y-center h-full" :style="{ justifyContent: theme.menu.horizontalPosition }">
        <n-menu
          :value="activeKey"
          mode="horizontal"
          :options="menus"
          :inverted="theme.header.inverted"
          @update:value="handleUpdateMenu"
        />
      </div>
    </n-scrollbar>
  </div>
</template>
<style scoped>
:deep(.n-menu-item-content-header) {
  overflow: inherit !important;
}
</style>
