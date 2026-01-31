import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi"

/**
 * 查询商家列表
 * @param {Object} query - 查询参数（分页、条件等）
 * @returns {Promise} API响应
 */
export function listMerchant(query) {
  return request({
    url: '/omniflow/merchant/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询商家详细
 * @param {string|number} merchantId - 商家ID
 * @returns {Promise} API响应
 */
export function getMerchant(merchantId) {
  return request({
    url: `/omniflow/merchant/${parseStrEmpty(merchantId)}`,
    method: 'get'
  })
}

/**
 * 新增商家
 * @param {Object} data - 商家数据
 * @returns {Promise} API响应
 */
export function addMerchant(data) {
  return request({
    url: '/omniflow/merchant',
    method: 'post',
    data: data
  })
}

/**
 * 修改商家
 * @param {Object} data - 商家数据
 * @returns {Promise} API响应
 */
export function updateMerchant(data) {
  return request({
    url: '/omniflow/merchant',
    method: 'put',
    data: data
  })
}

/**
 * 删除商家
 * @param {string|number|Array} merchantId - 商家ID或ID数组
 * @returns {Promise} API响应
 */
export function delMerchant(merchantId) {
  return request({
    url: `/omniflow/merchant/${merchantId}`,
    method: 'delete'
  })
}

/**
 * 导出商家
 * @param {Object} query - 查询参数
 * @returns {Promise} API响应
 */
export function exportMerchant(query) {
  return request({
    url: '/omniflow/merchant/export',
    method: 'post',
    params: query
  })
}
