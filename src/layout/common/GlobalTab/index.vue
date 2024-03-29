<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useElementBounding } from '@vueuse/core';
import { useTabStore, useThemeStore } from '@/store';
import { useDeviceInfo } from '@/composables';
import { TabDetail, ReloadButton } from './components';

const route = useRoute();
const theme = useThemeStore();
const tab = useTabStore();
const bsWrapper = ref<HTMLElement>();
// 获取设备信息
const deviceInfo = useDeviceInfo();

const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsWrapper);

const bsScroll = ref<Expose.BetterScroll>();

const canClick = Boolean(deviceInfo.device.type);

function handleScroll(clientX: number) {
  const currentX = clientX - bsWrapperLeft.value;
  const deltaX = currentX - bsWrapperWidth.value / 2;
  if (bsScroll.value) {
    const { maxScrollX, x: leftX } = bsScroll.value.instance;
    const rightX = maxScrollX - leftX;
    const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX);
    bsScroll.value?.instance.scrollBy(update, 0, 300);
  }
}

function init() {
  tab.iniTabStore(route);
}

watch(
  () => route.fullPath,
  () => {
    tab.addTab(route);
    tab.setActiveTab(route.fullPath);
  }
);

// 初始化
init();
</script>
<template>
  <dark-mode-container class="global-tab flex-y-center w-full pl-16px" :style="{ height: theme.tab.height + 'px' }">
    <div ref="bsWrapper" class="flex-1-hidden h-full">
      <better-scroll ref="bsScroll" :options="{ scrollX: true, scrollY: false, click: canClick }">
        <tab-detail @scroll="handleScroll" />
      </better-scroll>
    </div>
    <reload-button />
  </dark-mode-container>
</template>
<style lang="scss" scoped>
.global-tab {
  box-shadow: 0 1px 2px rgb(0 21 41 /8%);
}
</style>
