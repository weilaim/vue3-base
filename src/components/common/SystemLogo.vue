<script setup lang="ts">
defineOptions({ name: 'SystemLogo' });
interface Props {
  /** logo是否填充 */
  fill?: boolean;
}
withDefaults(defineProps<Props>(), {
  fill: false
});
</script>
<template>
  <icon-local-logo-fill v-if="fill" />
  <icon-local-logo v-else />
</template>
<style lang="scss" scoped></style>
