<script setup lang="ts">
import { isInTraditionColors } from '@/settings';
import { useThemeStore } from '@/store';
import { useBoolean } from '@/hooks';
import { ColorCheckbox, ColorModal } from './components';
defineOptions({ name: 'ThemeColorSelect' });

const { bool: visible, setTrue: openModal, setFalse: closeModal } = useBoolean();

const theme = useThemeStore();
const isInOther = computed(() => isInTraditionColors(theme.themeColor));
const otherColorBtnType = computed(() => (isInOther.value ? 'primary' : 'default'));
</script>
<template>
  <n-divider title-placement="center">系统主题</n-divider>
  <n-grid :cols="8" :x-gap="8" :y-gap="12">
    <n-grid-item v-for="color in theme.themeColorList" :key="color" class="flex-x-center">
      <color-checkbox :color="color" :checked="color === theme.themeColor" @click="theme.setThemeColor(color)" />
    </n-grid-item>
  </n-grid>
  <n-space :vertical="true" class="pt-12px">
    <n-color-picker :value="theme.themeColor" :show-alpha="false" @update-value="theme.setThemeColor"></n-color-picker>
    <n-button :block="true" :type="otherColorBtnType" @click="openModal">更多颜色</n-button>
  </n-space>
  <color-modal :visible="visible" @close="closeModal" />
</template>
<style lang="scss" scoped></style>
