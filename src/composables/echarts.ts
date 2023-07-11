import type { ComputedRef, Ref } from 'vue';
import * as echarts from 'echarts/core';
import {
  DatasetComponent,
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
  TitleComponent,
  type DatasetComponentOption,
  type GridComponentOption,
  type LegendComponentOption,
  type TitleComponentOption,
  type ToolboxComponentOption,
  type TooltipComponentOption,
  LegendComponent
} from 'echarts/components';
import {
  BarChart,
  LineChart,
  type BarSeriesOption,
  type GaugeSeriesOption,
  type LineSeriesOption,
  type PictorialBarSeriesOption,
  type PieSeriesOption,
  type RadarSeriesOption,
  type ScatterSeriesOption,
  PieChart,
  ScatterChart,
  PictorialBarChart,
  RadarChart,
  GaugeChart
} from 'echarts/charts';
// import { installLabelLayout, installUniversalTransition } from 'echarts/types/dist/shared';
import { CanvasRenderer } from 'echarts/renderers';
import { useElementSize } from '@vueuse/core';
import { useThemeStore } from '@/store';
export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | PictorialBarSeriesOption
  | RadarSeriesOption
  | GaugeSeriesOption
  | TitleComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | ToolboxComponentOption
  | DatasetComponentOption
>;

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  PictorialBarChart,
  RadarChart,
  GaugeChart,
  // installLabelLayout,
  // installUniversalTransition,
  CanvasRenderer
]);

/**
 * Echarts hooks 函数
 * @param options -图表配置
 * @param renderFun - 图表渲染函数(例如：图表监听函数)
 * @description 按需引入图表组件，没注册的组件需要要先引入
 */
export function useEcharts(
  options: Ref<ECOption> | ComputedRef<ECOption>,
  renderFun?: (chartInstance: echarts.ECharts) => void
) {
  const theme = useThemeStore();
  const domRef = ref<HTMLElement>();
  const initialSize = { width: 0, height: 0 };
  const { width, height } = useElementSize(domRef, initialSize);
  let chart: echarts.ECharts | null = null;

  function canRender() {
    return initialSize.width > 0 && initialSize.height > 0;
  }

  function isRendered() {
    return Boolean(domRef.value && chart);
  }

  function update(updateOptions: ECOption) {
    if (isRendered()) {
      chart!.setOption({ ...updateOptions, backgroundColor: 'transparent' });
    }
  }

  async function render() {
    if (domRef.value) {
      const chartTheme = theme.darkMode ? 'dark' : 'light';
      await nextTick();
      chart = echarts.init(domRef.value, chartTheme);
      if (renderFun) {
        renderFun(chart);
      }
      update(options.value);
    }
  }

  function resize() {
    chart?.resize();
  }

  function destroy() {
    chart?.dispose();
  }

  function updateTheme() {
    destroy();
    render();
  }

  const stopSizeWatch = watch([width, height], ([newWidth, newHeight]) => {
    initialSize.width = newWidth;
    initialSize.height = newHeight;
    if (newWidth === 0 && newHeight === 0) {
      // 节点被删除 将chart置为空
      chart = null;
    }

    if (canRender()) {
      if (!isRendered()) {
        render();
      } else {
        resize();
      }
    }
  });

  const stopOptionWatch = watch(options, newValue => {
    update(newValue);
  });

  const stopDarkModeWatch = watch(
    () => theme.darkMode,
    () => {
      updateTheme();
    }
  );

  onUnmounted(() => {
    destroy();
    stopSizeWatch();
    stopOptionWatch();
    stopDarkModeWatch();
  });

  return {
    domRef
  };
}