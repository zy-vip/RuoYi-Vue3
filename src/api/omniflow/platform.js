import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/ruoyi"

/**
 * 查询外卖平台配置列表
 * @param {Object} query - 查询参数（分页、条件等）
 * @returns {Promise} API响应
 */
export function listPlatform(query) {
  return request({
    url: '/omniflow/platform/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询外卖平台配置详细
 * @param {string|number} platformId - 平台ID
 * @returns {Promise} API响应
 */
export function getPlatform(platformId) {
  return request({
    url: `/omniflow/platform/${parseStrEmpty(platformId)}`,
    method: 'get'
  })
}

/**
 * 新增外卖平台配置
 * @param {Object} data - 平台配置数据
 * @returns {Promise} API响应
 */
export function addPlatform(data) {
  return request({
    url: '/omniflow/platform',
    method: 'post',
    data: data
  })
}

/**
 * 修改外卖平台配置
 * @param {Object} data - 平台配置数据
 * @returns {Promise} API响应
 */
export function updatePlatform(data) {
  return request({
    url: '/omniflow/platform',
    method: 'put',
    data: data
  })
}

/**
 * 删除外卖平台配置
 * @param {string|number|Array} platformId - 平台ID或ID数组
 * @returns {Promise} API响应
 */
export function delPlatform(platformId) {
  return request({
    url: `/omniflow/platform/${platformId}`,
    method: 'delete'
  })
}

/**
 * 导出外卖平台配置
 * @param {Object} query - 查询参数
 * @returns {Promise} API响应
 */
export function exportPlatform(query) {
  return request({
    url: '/omniflow/platform/export',
    method: 'post',
    params: query
  })
}
