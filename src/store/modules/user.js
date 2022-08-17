//引入登录，登出，获取用户信息接口
import { login, logout, getInfo } from '@/api/user';
//获取token，设置token，删除token接口
import { getToken, setToken, removeToken } from '@/utils/auth';
//路由模块当中重置路由的方法
import { resetRouter, anyRoutes, asyncRoutes, constantRoutes } from '@/router';
import router from '@/router';
import cloneDeep from 'lodash/cloneDeep';


const getDefaultState = () => {
  return {
    //获取token
    token: getToken(),
    //存储用户名
    name: '',
    //存储用户头像
    avatar: '',
    //【routes、roles、buttons】服务器返回的系列标记信息，数据类型都是数组套字符串
    //菜单标记
    routes: [],
    //角色
    roles: [],
    //按钮标记
    buttons: [],
    //对比项目中已有的异步路由，与服务器返回的路由标记，筛选最终要展示的路由
    resultAsyncRoutes: [],
    //当前用户最终需要展示的全部路由
    resultAllRoutes: [],
  }
}

const state = getDefaultState()

const mutations = {
  //重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  //存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户信息
  SET_USERINFO: (state, userInfo) => {
    //用户名
    state.name = userInfo.name;
    //用户头像
    state.avatar = userInfo.avatar;
    //角色
    state.roles = userInfo.roles;
    //菜单权限标记[]
    state.routes = userInfo.routes;
    //按钮权限标记[]
    state.buttons = userInfo.buttons;
  },
  //最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    //用户完整的路由包括常量路由、异步路由、任意路由
    //vuex保存当前用户需要的异步路由
    state.resultAsyncRoutes = asyncRoutes;
    //计算出当前用户需要展示所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes);
    //给路由器添加新的路由

    router.addRoutes(state.resultAllRoutes)
  }
}

//定义函数
const computedAsyncRoutes = (asyncRoutes, routes) => {
  //过滤出当前用户需要展示的异步路由
  return asyncRoutes.filter(item => {
    // console.log(routes.indexOf(item.name));
    //当数组中有这个元素返回索引值-1，
    if (routes.indexOf(item.name) != -1) {
      //递归，还有2、3、4、5、。。。级路由
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  })
}

//actions
const actions = {
  // user login 处理登录业务
  async login({ commit }, userInfo) {
    //解构出用户名与密码
    const { username, password } = userInfo;

    let result = await login({ username: username.trim(), password: password });
    // console.log(result);
    //注意：当前登录请求使用mock数据，mock数据code是20000 
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token);
      setToken(result.data.token);
      return 'ok';
    } else {
      return Promise.reject(new Error('faile'));
    }
  },

  // get user info
  //大佬写模板的时候还没有async,await所以用的是Promise 
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        //获取用户信息：返回数据包含：用户名name、用户头像avatar、菜单权限routes[返回的标志：不同的用户应该展示那些菜单的标记]、角色信息roles、按钮权限信息buttons
        const { data } = response;
        // console.log(data);
        //vuex存储用户全部的信息
        commit('SET_USERINFO', data);
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(cloneDeep(asyncRoutes), data.routes));
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

