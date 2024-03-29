import { defineStore } from 'pinia';
import { getUserInfo, removeToken, toLogin } from '@/utils';
// import { useRouterPush } from '~/src/composables';
import { useTabStore } from '../tab';
interface UserState {
  /** 用户信息 */
  userInfo: Auth.UserInfo;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: getUserInfo()
  }),
  getters: {
    userId(): string {
      return this.userInfo.uuid;
    },
    name(): string {
      return this.userInfo.userName;
    },
    avatar(): string {
      return this.userInfo.headerImg || '';
    },
    role(): Auth.RoleTyep {
      return this.userInfo.userRole;
    }
  },
  actions: {
    /**
     * 获取用户信息
     */
    getUserInfo() {},
    /**
     * 退出登录
     */
    logout() {
      const { resetTabs } = useTabStore();
      removeToken();
      resetTabs();
      this.$reset();
      toLogin();
    }
  }
});
