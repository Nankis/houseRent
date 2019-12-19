import Router from '@/router';
import store from '@/store'

Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.userId) {
            next()
        } else {
            next({
                path: '/user/login',
                query: to.fullPath
            })
        }
    } else {
        next()
    }
})