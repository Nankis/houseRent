<template>
	<section>
		<header class="header">
			<i class="el-icon-edit-outline"></i>
			<span>我的账单</span>
		</header>
		<div v-if="orderList.length != 0" class="house-info">
			<div class="house-info__l">
				<div class="house-info__cov">
					<img :src="House.House_coverPic" alt />
				</div>
				<ul class="house-detail">
					<li class="house-detail__t">
						<span>{{House.House_title}}</span>
						<span>·</span>
						<span>{{House.House_months | getChname}}</span>
					</li>
					<li class="house-price">
						<span class="house-price__sym">￥租金</span>
						<span class="house-price__rent">{{House.House_rent}}</span>
						<span class="house-price__pledge house-price__pledge--l">押金￥</span>
						<span class="house-price__pledge">{{House.House_pledge}}</span>
					</li>
				</ul>
			</div>
			<div class="admin">
				<div class="admin-avator">
					<img :src="Admin.Admin_avaterPath" alt />
				</div>
				<div class="admin-info">
					<p>{{Admin.Admin_realName}}</p>
					<p>{{Admin.Admin_tel}}</p>
				</div>
			</div>
		</div>
		<section ref="MyOrder" class="order-box">
			<div v-if="orderList.length === 0" class="order--no">
				<p class="order--no__title">您还没有账单，快去找房吧！～</p>
				<router-link class="order--no__next" to="/h">去找房</router-link>
			</div>
			<div v-else>
				<el-table
					:data="orderList"
					:border="true"
					ref="orderTable"
					height="400"
					@row-click="choiceCurrRow"
				>
					<el-table-column label="订单ID" width="100">
						<template slot-scope="scope">
							<el-badge
								:is-dot="payRemind.some(item=>item.Link_id == scope.row.Order_id)"
								class="besinfo"
							>{{scope.row.Order_id}}</el-badge>
						</template>
					</el-table-column>
					<el-table-column label="截止日期">
						<template slot-scope="scope">
							<span>{{scope.row.Order_time | getTime}}</span>
						</template>
					</el-table-column>
					<el-table-column label="应支付">
						<template slot-scope="scope">
							<span>{{scope.row.Order_shouldPay}}</span>
							<span v-if="scope.row.index">(含押金{{scope.row.House_pledge}})</span>
						</template>
					</el-table-column>
					<el-table-column prop="Order_alreadyPay" label="实支付"></el-table-column>
					<el-table-column label="支付状态" width="150px">
						<template slot-scope="scope">
							<div class="hint-status">
								<div v-if="scope.row.judgePay.status == 1">支付成功</div>
								<div v-else-if="scope.row.judgePay.status == 2">
									<el-tooltip effect="dark" content="如需线下请联系上方管理员" placement="top">
										<span class="topay" @click="toPayOrder(scope.row.Order_id,scope.row.judgePay.should)">线上支付</span>
									</el-tooltip>
								</div>
								<router-link v-else to="#">去补交</router-link>
								<div class="hint-status__icon" :style="hintStatusStlye(scope.row.judgePay.status)">
									<i class="el-icon-check"></i>
								</div>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</section>
	</section>
</template>

<script>
	import { mapGetters } from "vuex";
	import * as userApi from "@/api/user";
	import { houseDetail } from "@/api/house";
	import { PAY_ZHIFUBAO } from "@/api/type";
	import { mapState, mapActions } from "vuex";
	export default {
		props: { con_id: null, house_id: null },
		data() {
			return {
				orderList: [],
				HousePicture: null,
				House: {},
				Admin: {}
				// checkOrderIndex: [],  // 选中的行
			};
		},
		computed: {
			...mapGetters(["userId"]),
			...mapState({
				payRemind: state => state.user.payRemind
			})
		},
		methods: {
			...mapActions(["delRemind"]),
			// 查询订单
			getMyOrder() {
				this.$myLoadding.open(this.$refs.MyOrder);
				userApi
					.queryOrder({
						user_id: this.userId,
						con_id: this.con_id,
						noLoading: true
					})
					.then(res => {
						if (res.data) {
							this.orderList = res.data;
							this.orderList.sort((a, b) => {
								let res =
									new Date(a.Order_time) - new Date(b.Order_time);
								return res;
							});
							this.orderList.forEach(item => {
								item.judgePay = this.judegPayStatus(
									item.Order_shouldPay,
									item.Order_alreadyPay
								);
							});
							this.orderList[0].index = true;
						}
						this.$myLoadding.hide();
					});
			},
			// 判断支付状态
			judegPayStatus(should, realy) {
				console.log(should, realy, "=============================");
				switch (true) {
					case should === realy || should < realy:
						return {
							status: 1
						};
					case realy == 0:
						return {
							status: 2,
							should: should
						};
					case should > realy:
						return {
							status: 3,
							should: parseFloat(should) - parseFloat(realy)
						};
				}
			},
			// 获取房子信息
			getHouseInfo() {
				houseDetail(
					{
						house_id: this.house_id
					},
					res => {
						if (res.status) {
							this.HousePicture = res.Data.HousePicture;
							this.House = res.Data.House;
							this.Admin = res.Data.Admin || {};
						}
					}
				);
			},
			// 状态样式
			hintStatusStlye(value) {
				switch (true) {
					case value == 1:
						return {
							"background-color": "rgb(103, 194, 58)"
						};
					case value == 2:
						return {};
					case value == 3:
						return {
							"background-color": "rgb(245, 108, 108)"
						};
				}
			},
			// 去支付
			toPayOrder(order_id, payAmount) {
				let arrOldOrder = this.orderList.slice(
					0,
					this.orderList.findIndex(item => item.Order_id == order_id)
				);
				if (arrOldOrder.every(item => item.Order_isPaid == "Y")) {
					this.$myLoadding.open(this.$refs.MyOrder, "等待支付中");
					userApi
						.payOrder({
							out_trade_no: order_id,
							total_amount: payAmount
						})
						.then(res => {
							console.log(res, "=======================");
						});
					window.open(
						`${PAY_ZHIFUBAO}?out_trade_no=${order_id}&total_amount=${payAmount}`,
						"_self"
					);
				} else {
					this.$notify.error({
						message: "请先完成往期账单",
						duration: 1000,
						showClose: false,
						title: "账单支付"
					});
				}
			},
			// rowClick(row) {
			// 	this.$refs.orderTable.toggleRowSelection(row);
			// }
			// 选取当前行消息
			choiceCurrRow(row) {
				this.delLookMsg(row);
			},
			// 删除消息
			delLookMsg(row) {
				for (let i = 0; i < this.payRemind.length; i++) {
					if (this.payRemind[i].Link_id == row.Order_id) {
						this.delRemind({
							mge_id: this.payRemind[i].Mge_id,
							type: "pay"
						});
						break;
					}
				}
			}
		},
		mounted() {
			this.getMyOrder();
			this.getHouseInfo();
		},
		filters: {
			getTime(value) {
				let date = new Date(value);
				let mouth = `${date.getMonth() + 1}`.padStart("2", "0");
				let day = `${date.getDate()}`.padStart("2", "0");
				return `${date.getFullYear()}.${mouth}.${day}`;
			},
			getChname(value) {
				switch (true) {
					case value == "1":
						return "押一付一";
					case value == "2":
						return "押一付二";
					case value == "3":
						return "押一付三";
					default:
						return "";
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
$hoverColor: #00bfc8;
$fontLightColor: #3dbcc6;
$bacHoerClr: #3dbcc6;
$NoHover: #999999;
.header {
	padding-bottom: 3rem;
	font-size: 1.8rem;
	line-height: 2.1rem;
	border-bottom: 1px solid #f1f1f1;
	color: #333;
	span {
		margin-left: 15px;
	}
}

.house-info {
	margin-left: 10px;
	height: 130px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	&__cov {
		width: 150px;
		height: 90px;
		img {
			width: 100%;
			height: 100%;
		}
	}
	&__l {
		display: flex;
	}
}
.house-detail {
	margin-left: 16px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	&__t {
		font-size: 22px;
		font-weight: bold;
		cursor: pointer;
		transition: color 0.3;
		&:hover {
			color: rgb(61, 188, 198);
		}
	}
}
.house-price {
	font-size: 20px;
	&__pledge {
		font-size: 16px;
		color: rgb(102, 102, 102);
		&--l {
			margin-left: 10px;
		}
	}
}
.order-box {
	position: relative;
}
.order {
	&--have {
		border-bottom: 1px solid #f1f1f1;
	}
	&--no {
		height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
}
.order--no {
	&__title {
		font-size: 16px;
		color: #999;
	}
	&__next {
		display: block;
		background-color: #fff;
		min-width: 180px;
		width: auto;
		height: 50px;
		font-size: 1.8rem;
		line-height: 4.6rem;
		text-align: center;
		border: 2px solid #3dbcc6;
		border-radius: 33px;
		box-sizing: border-box;
		color: $hoverColor;
		padding: 0 30px;
		transition: all 0.2s;
		margin-top: 2rem;
		&:hover {
			background-color: $bacHoerClr;
			color: #fff;
		}
	}
}

.admin {
	display: flex;
	margin-left: 10px;
	&-info {
		padding: 12px 12px 0;
		p:first-of-type {
			font-size: 18px;
			color: #000;
		}
		p:last-of-type {
			margin-top: 4px;
			font-size: 15px;
			color: #9f9f9f;
		}
	}
	&-avator {
		width: 60px;
		height: 60px;
		img {
			border-radius: 50%;
			overflow: hidden;
			height: 100%;
			width: 100%;
		}
	}
	&-see {
		margin-bottom: 20px;
	}
}
.hint-status {
	display: flex;
	align-items: center;
	&__icon {
		height: 20px;
		line-height: 20px;
		width: 34px;
		text-align: center;
		border-radius: 2em;
		font-size: 16px;
		color: #fff;
		margin-left: 10px;
		i {
			font-weight: bolder;
		}
		background-color: rgba(0, 0, 0, 0.2);
		&--succuss {
			background-color: rgb(103, 194, 58);
		}
	}
}
.table-order {
	border: 1px solid #f1f1f1;
	padding: 10px;
}
.topay {
	color: #3dbcc6;
	cursor: pointer;
}
.many-item {
}
::v-deep .el-table--border::after,
.el-table--group::after,
.el-table::before {
	z-index: 0;
}
.besinfo {
	margin: 5px;
}
</style>