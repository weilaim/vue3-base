<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { MenuOption } from 'naive-ui';
import { useAppStore, useThemeStore } from '@/store';
import { useAppInfo, useRouterPush } from '@/composables';
import { getActiveKeyPathsOfMenus } from '@/utils';

const app = useAppStore();
const theme = useThemeStore();
const AppInfo = useAppInfo();
const route = useRoute();
interface Props {
  /** 菜单抽屉可见性 */
  visible: boolean;
  menus: GlobalMenuOption[];
}
const { routerPush } = useRouterPush();
const props = defineProps<Props>();
const showDrawer = computed(() => (props.visible && props.menus.length) || app.mixSiderFixed);

const activeKey = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string);
const expandedKeys = ref<string[]>([]);

function handleUpdateMenu(_key: string, item: MenuOption) {
  const menuItem = item as GlobalMenuOption;
  routerPush(menuItem.routePath);
}

function handleUpdateExpandedKeys(keys: string[]) {
  expandedKeys.value = keys;
}

watch(
  () => route.name,
  () => {
    expandedKeys.value = getActiveKeyPathsOfMenus(activeKey.value, props.menus);
  },
  { immediate: true }
);
</script>
<template>
  <div
    class="relative h-full transition-width duration-300 ease-in-out"
    :style="{ width: app.mixSiderFixed ? theme.sider.mixChildMenuWidth + 'px' : '0px' }"
  >
    <dark-mode-container
      class="drawer-shadow absolute-lt flex-col-stretch h-full nowrap-hidden"
      :style="{ width: showDrawer ? theme.sider.mixChildMenuWidth + 'px' : '0px' }"
    >
      <header class="header-height flex-y-center justify-between" :style="{ height: theme.header.height + 'px' }">
        <h2 class="text-primary pl-8px text-16px font-bold">{{ AppInfo.title }}</h2>
        <div class="px-8px text-16px text-gray-600 cursor-pointer" @click="app.toggleMixSiderFixed">
          <icon-mdi-pin-off v-if="app.mixSiderFixed" />
          <icon-mdi-pin v-else />
        </div>
      </header>
      <n-scrollbar class="flex-1-hidden">
        <n-menu
          class="side-menu"
          :value="activeKey"
          :options="menus"
          :expanded-keys="expandedKeys"
          :indent="18"
          @update:value="handleUpdateMenu"
          @update:expanded-keys="handleUpdateExpandedKeys"
        />
      </n-scrollbar>
    </dark-mode-container>
  </div>
</template>
<style lang="scss">
.side-menu:not(.n-menu--collapsed) {
  .n-menu-item-content {
    &::before {
      left: 5px;
      right: 5px;
    }
    &.n-menu-item-content--selected,
    &:hover {
      &::before {
        border-left: 4px solid var(--primary-color);
      }
    }
  }
}
</style>
