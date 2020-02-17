"use strict";
const format = require('pg-format');

module.exports = (pool) => {
	return {
		getPointsForMerchantByRewardId: (_puid, reward_id) => {
			let queryString = format("select points_balance.points, \
				rewards.points as reward_points, merchants.name as merchant_name, \
				rewards.name as reward_name from points_balance \
				join merchants on merchants.id = points_balance.merchant_id \
				join rewards on points_balance.merchant_id = rewards.merchant_id  \
				where points_balance.user_id = %L and rewards.id = %L", _puid, reward_id)
			return pool.query(queryString).catch((err) => { throw boom.internal(`${err.message}`)} );
		},

		getPointsForMerchantByMerchantId: (_puid, merchant_id) => {
			let queryString = format("select points_balance.points, merchants.name as merchant_name from points_balance join merchants on merchants.id = points_balance.merchant_id where points_balance.user_id = %L and points_balance.merchant_id = %L", _puid, merchant_id)
			return pool.query(queryString).catch((err) => { throw boom.internal(`${err.message}`)} );
		},

	};
}
