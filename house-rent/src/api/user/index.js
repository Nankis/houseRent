// import axios from '@/axios';
// 登录
import axios from '@/config/axios';

// 账号登录
export const login = (data, call) => {
    return axios.post('/LoginRegistMgeSvr.assx/loginByUserNameOrTel', data).then(res => {
        if (res.data.Code === "200") {
            return { status: true, Data: res.data.Data, msg: '登录成功' }
        }
        return { status: false, msg: res.data.Msg }

    }).catch(err => {
        return { status: false, msg: '登录失败请稍后再试', errData: err }
    })
}

// 登录验证码
export const getCode = data => {
    return axios.post('/LoginRegistMgeSvr.assx/sendLoginCode', {...data, noLoading: true }).then(res => {
        if (res.data.Code == '200') {
            return { status: true, msg: res.data.Msg }
        }
        return { status: false, msg: '验证码获取失败请稍后再试' }
    }).catch(err => {
        return { status: false, msg: '验证码获取失败请稍后再试' }
    })
}

// 验证码登录
export const logByCode = data => {
    return axios.post('/LoginRegistMgeSvr.assx/loginByCode', data).then(res => {
        // console.log(res, '验证码登录');
        if (res.data.Code == '200') {
            return { status: true, msg: '登录成功', data: res.data.Data }
        }
        return { status: false, msg: '登录失败，验证码错误' }
    }).catch(err => {
        return { status: false, msg: '登录失败请稍后再试' }
    })
}

// 注册
export const registUser = data => {
    return axios.post('/LoginRegistMgeSvr.assx/registUser', data).then(res => {
        // console.log(res);
        if (res.data.Data.code == "200") {
            return { status: true, msg: '注册成功' }
        }
        return { status: false, msg: res.data.Data.Msg }
    }).catch(err => {
        return { status: false, msg: '注册失败，请稍后再试' }
    })
}

// 注册验证码
export const registUserCode = async(data) => {
    return await axios.post('/LoginRegistMgeSvr.assx/sendRegistCode', data).then(res => {
        if (res.data.Code == "200") {
            return { status: true, msg: '验证码获取成功' }
        }
        return { status: false, msg: '验证码获取失败' }

    }).catch(err => {
        return { status: false, msg: '验证码获取失败' }
    })
}


// 查询用户电话
export const queryTel = data => {
    return axios.post('/LoginRegistMgeSvr.assx/queryUserTel', data).then(res => {
        // console.log(res, '手机号');
        if (res.data.Code == "600") {
            return { status: true, msg: '此手机号账户已存在，请更换手机号' }
        }
        return { status: false, msg: '' }
    }).catch(err => {
        return { status: false, msg: '' }
    })
}


// 查询用户名称
export const queryUName = data => {
    return axios.post('/LoginRegistMgeSvr.assx/queryUserName', data).then(res => {
        // console.log(res, '账户名');
        if (res.data.Code == "700") {
            return { status: true, msg: '此账户名已存在，请更换账户名' }
        }
        return { status: false, msg: '' }
    }).catch(err => {
        return { status: false, msg: '' }
    })
}

// 动态验证码
export const editAuthCode = data => {
    return axios.post('/LoginRegistMgeSvr.assx/sendUpdateCode', data).then(res => {
        // console.log(res, '动态验证码');
        if (res.data.Code == "200") {
            return { status: true, data: res.data.Data, msg: '验证码发送成功' }
        }
        return { status: false, msg: '验证码获取失败，请稍后再试' }
    }).catch(err => {
        return { status: false, msg: '验证码获取失败，请稍后再试' }
    })
}


/**
 * 密码修改
 * 
 * @param {telephone: String， code: String， password: String} data 
 */
export const upPwdUser = data => {
    return axios.post('/LoginRegistMgeSvr.assx/updatePasswordCode', data).then(res => {
        // console.log(res, '密码修改');
        if (res.data.Code == "200") {
            return { status: true, data: res.data.Data, msg: '密码修改成功' }
        }
        return { status: false, msg: '密码修改失败，请稍后再试' }
    }).catch(() => {
        return { status: false, msg: '密码修改失败，请稍后再试' }
    })
}

// 更新信息
export const updateUserInfo = (data) => {
    return {
        status: true
    }
    // return axios.post('/UserMgeSvr.assx/updateUserInfo', qs.stringify(data)).then(res => {
    //     return res
    // }).catch(err => {
    //     return err
    // })
}

// 预约
export const addBespeak = (data, call) => {
    return axios.post('/UserMgeSvr.assx/addBespeak', data).then(res => {
        // console.log(res);
        if (res.data.Code === "200") {
            return { status: true, msg: '预约成功' }
        }
        return { status: false, msg: '预约失败请稍后再试' }
    }).catch(err => {
        return { status: false, msg: '预约失败请稍后再试' }
    })
}

// 查看预约消息
export const queryBespeak = data => {
    return axios.post('/UserMgeSvr.assx/queryOwnBespeak', data).then(res => {
        // console.log(res, '查看预约消息');
        if (res.data.Code == '200') {
            return { status: true, data: res.data.Data.bespeakList._Items }
        }
        return { status: false, data: [] }
    }).catch(() => {
        return { status: false, data: [] }
    })
}

// 删除预约消息
export const delBespeak = data => {
    return axios.post('/UserMgeSvr.assx/deleteBespeak', data).then(res => {
        if (res.data.Code == '200') {
            return { status: true }
        }
        return { status: false, msg: `${data.bs_id}预约消息移除失败，请稍后再试` }
    }).catch(() => {
        return { status: false, msg: `${data.bs_id}预约消息移除失败，请稍后再试` }
    })
}

// 修改预约消息
export const updateBespeak = data => {
    return axios.post('/UserMgeSvr.assx/updateBespeakTime', data).then(res => {
        if (res.data.Code == '200') {
            return { status: true, msg: res.data.Msg }
        }
        return { staus: false, msg: '编辑预约信息失败,请稍后再试' }
    }).catch(() => {
        return { staus: false, msg: '编辑预约信息失败,请稍后再试' }
    })
}

// 添加收藏
export const addOwnCollect = (data, call) => {
    return axios.post('/UserMgeSvr.assx/addOwnCollect', data).then(res => {
        // console.log(res, '添加收藏');
        if (res.data.Code == "200") {
            return { status: true, msg: '收藏成功' }
        }
        return { status: false, msg: '收藏失败，请稍后再试' }
    }).catch(err => {
        return { status: false, msg: '收藏失败，请稍后再试' }
    })
}

// 删除收藏
// {
//     house_idStr: '1,2,3',
//     user_id: '2'
// }
export const deleteOwnCollectBatch = (data, call) => {
    return axios.post('/UserMgeSvr.assx/deleteOwnCollectBatch', data).then(res => {
        // console.log(res, '删除收藏');
        if (res.data.Code == "200") {
            return { status: true, msg: '移除收藏成功' }
        }
        return { status: false, msg: '移除收藏失败' }
    }).catch(() => {
        return { status: false, msg: '移除收藏失败' }
    })
}



// 查看用户收藏
// {
//     user_id: '2'
// }
export const queryOwnCollect = async(data) => {
    return await axios.post('/UserMgeSvr.assx/queryOwnCollect', data).then(res => {
        // console.log('查询收藏', res);
        if (res.data.Code == 200) {
            return { status: true, data: res.data.Data._Items }
        }
        return { status: false, data: [] }
    }).catch(err => {
        return { status: false, data: [] }
    })
}

// 查看合同
export const queryCtractIn = async(data) => {
    return await axios.post('/UserMgeSvr.assx/queryContractInfoOfUser', data).then(res => {
        // console.log('查看合同', res);
        if (res.data.Code == 200) {
            return { status: true, data: res.data.Data._Items }
        }
        return { status: false, data: [] }
    }).catch(err => {
        return { status: false, data: [] }
    })
}

// 查看订单
export const queryOrder = data => {
    return axios.post('/UserMgeSvr.assx/queryOrderInfoOfUser', data).then(res => {
        if (res.data.Code == "200") {
            return { status: true, data: res.data.Data._Items }
        }
        return { status: false, data: [] }
    }).catch(err => {
        return { status: false, data: [] }
    })
}

// 上传头像
export const uploadAvator = data => {
    return axios.post('/upImage/addUserAvater', data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }).then(res => {
        // console.log(res);
        if (res.data.code == "200") {
            return { status: true, msg: '头像修改成功', url: res.data.data[0].user_avaterPath }
        }
        return { status: false, msg: '头像上传失败，请稍后再试' }
    }).catch(err => {
        return { status: false, msg: '头像上传失败，请稍后再试' }
    })
}

// 支付订单
export const payOrder = data => {
    return axios.post('/payController/pay', data).then(res => {
        // console.log(res);
        if (res.status == 200) {
            return { status: true, data: res.data }
        }
        return { status: false, data: '请检查订单信息，或选择订单' }
    }).catch(err => {
        return { status: false, msg: '请稍后再试' }
    })
}


// 支付记录
export const orderTradeInfo = data => {
    return axios.post('/UserMgeSvr.assx/queryOrderTradeInfoOfUser', data).then(res => {
        // console.log(res, '交易记录');
        if (res.status == 200) {
            return { status: true, data: res.data, _Items: res.data.Data._Items }
        }
        return { status: false, data: null }
    }).catch(err => {
        return { status: false, data: null }
    })
}

/**
 * 支付结果
 * order_id 订单ID
 */
export const checkOrderIsPaid = data => {
    return axios.post('/UserMgeSvr.assx/checkOrderIsPaid', {...data, noLoading: true }).then(res => {
        // console.log(res, '交易记录');
        if (res.status == 200) {
            return { status: true, data: res.data, _Items: res.data.Data._Items }
        }
        return { status: false, data: null }
    }).catch(() => {
        return { status: false, data: null }
    })
}

/**
 * 查看合同详情
 * 
 * con_id
 */
export const queryContractInfoById = data => {
    return axios.post('UserMgeSvr.assx/queryContractInfoById', data).then(res => {
        // console.log(res, '合同详情');
        if (res.status == 200) {
            return { status: true, data: res.data }
        }
        return { status: false, data: null }
    }).catch(() => {
        return { status: false, data: null }
    })
}

/**
 * 查看未处理消息
 * 
 */

export const findMsg = data => {
    // console.log('调用次数');
    return axios.post('/socket/findMge', data).then(res => {
        // console.log(res);
    }).catch(err => {
        // console.log(err);
    })
}

/**
 * 删除消息
 */

export const delMsg = data => {
    return axios.post('/socket/deleteSysMessage', {...data, noLoading: true }).then(res => {
        console.log(res, '删除啊啊啊啊');
        if (res.data.code == '200') {
            return true
        }
        return false
    }).catch(() => false)
}

/**
 * 查询管理员
 */
export const queryAdmin = adminName => {
    return axios.post('/TopAdminMgeSvr.assx/queryAdmin', {
        sizeNum: '',
        skipNum: '',
        searchName: adminName,
        noLoading: true
    }).then(res => {
        return { admin: res.data.Data._Items[0] }
    }).catch(() => {
        return { admin: {} }
    })
}

/**
 * 判断退租续租
 */
export const queryRentStu = data => {
    return axios.post('/AdminMgeSvr.assx/checkExitOrContinueBespeakIsExisted', {
        ...data,
        noLoading: true
    }).then(res => {
        if (res.data.Code == '200') {
            let { exitHouseBespeakIsExisted: retreatStu, continueHouseBespeakIsExisted: reletStu } = res.data.Data;
            return { retreatStu, reletStu, done: retreatStu || reletStu }
        }
        return {
            retreatStu: true, // 退租
            reletStu: true, // 续租
            done: true,
        }
    }).catch(() => {
        return {
            retreatStu: true,
            reletStu: true,
            done: true
        }
    })
}


/**
 * 判断用户是否已经预约
 * String bs_type, int user_id, int house_id
 */
export const quLookHDesStu = data => {
    return axios.post('/UserMgeSvr.assx/checkBespeakIsExisted', {
        ...data,
        noLoading: true
    }).then(res => {
        console.log(res, '判断用户是否已经预约');
        if (res.data.Code == '200') {
            return { status: res.data.Data.BespeakExisted, msg: '您已预约，可前往个人中心心查看' }
        }
        return { status: false }
    }).catch(() => {
        return { status: true, msg: '服务器错误请稍后再试' }
    })
}

// CancelOrRejectBespeak int bs_id, int sig
export const cancelBes = data => {
    return axios.post('/AdminMgeSvr.assx/CancelOrRejectBespeak', data).then(res => {
        if (res.data.Code == '200') {
            return { status: true, msg: '操作成功' }
        }
        return { status: false, msg: '操作失败' }
    }).catch(err => {
        return { status: false, msg: '操作失败' }
    })
}

/**
 * 根据订单id查询合同id
 * {order_id: int}
 */
export const getConIdByOrder = data => {
    return axios.post('/UserMgeSvr.assx/queryContractInfoByOrderId', {...data, noLoading: true }).then(res => {
        if (res.data.Code == '200') {
            return res.data.Data
        }
        return null
    }).catch(() => null)
}

/**
 * 查询管理员信息
 * admin_name
 */
export const queryMyAdmin = data => {
    return axios.post('/TopAdminMgeSvr.assx/queryAdminByAdminName', {...data, noLoading: true }).then(res => {
        if (res.data.Code == '200') {
            return { status: true, admin: res.data.Data }
        }
        return { status: false, admin: {} }
    }).catch(err => {
        return { status: false, admin: {} }
    })
}

/**
 * 租金查询
 * con_id
 * dayTime
 */
export const getRefund = data => {
    return axios.post('/UserMgeSvr.assx/getRefund', {...data, noLoading: true }).then(res => {
        if (res.data.Code == '200') {
            return { status: true, data: res.data.Data }
        }
        return { status: false }
    }).catch(() => {
        return { status: false }
    })
}