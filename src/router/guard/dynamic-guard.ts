import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useRouteStore } from '@/store';
import { getToken } from '@/utils';
import { routeName } from '..';

export async function createDynamicGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const route = useRouteStore();
  const isLogin = Boolean(getToken());

  // 判断是否初始化了权限路由
  if (!route.isInitAuthRoute) {
    /**
     *  没有初始化权限路由
     *  未登录的情况下直接回到登录页面，登录成功后再加载权限路由
     */
    if (!isLogin) {
      const toName = to.name as AuthRoute.RouteKey;
      // 判断是否是有效的固定路由
      if (route.isValidConstantRoute(toName) && !to.meta.requiresAuth) {
        next();
      } else {
        // 如果不是的话就跳转到登录页面
        const redirect = to.fullPath;
        next({ name: routeName('login'), query: { redirect } });
      }
    }

    await route.initAuthRoute();

    if (to.name === routeName('not-found-page')) {
      // 动态路由没有加载导致被not-found-page路由捕获，等待权限路由加载好了，回到之前的路由
      // 若路由是从跟路由重定向过来的，重新回到跟路由
      const ROOT_ROUTE_NAME: AuthRoute.RouteKey = 'root';
      const path = to.redirectedFrom?.name === ROOT_ROUTE_NAME ? '/' : to.fullPath;
      next({ path, replace: true, query: to.query, hash: to.hash });
      return false;
    }
  }
  console.log('权限路由已经加载，仍然未找到，重定向到not-found */');

  console.log('to home', to.name);

  /** 权限路由已经加载，仍然未找到，重定向到not-found */
  if (to.name === routeName('not-found-page') && to.name === routeName('login')) {
    console.log('to home', to.name);

    next({ name: routeName('not-found'), replace: true });
    return false;
  }

  return true;
}