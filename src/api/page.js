import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function getMachineList(params) {
  return request({
    url: '/machine/basic-info',
    method: 'POST',
    data: params,
  })
}

export function getWxResultList(params) {
  return request({
    url: '/machine/wx/query-result',
    method: 'POST',
    data: params,
  })
}

export function getChatroomResultList(params) {
  return request({
    url: '/machine/chatroom/query-result',
    method: 'POST',
    data: params,
  })
}

export function getChatroomDetailList(params) {
  return request({
    url: '/machine/chatroom/detail',
    method: 'POST',
    data: params,
  })
}

export function machineImport(params) {
  return request({
    url: '/machine/import',
    method: 'POST',
    data: params,
  })
}

export function queryConfig(params) {
  return request({
    url: '/machine/query/config',
    method: 'get',
    params
  })
}

export function heatbeat(params) {
  return request({
    url: '/machine/heartbeat',
    method: 'POST',
    data: params,
  })
}

export function machineRelogin(params) {
  return request({
    url: '/machine/relogin',
    method: 'POST',
    data: params,
  })
}

export function  machinRemove(params) {
  return request({
    url: '/machine/remove',
    method: 'POST',
    data: params,
  })
}

export function PutQueryConfig(params) {
  return request({
    url: '/machine/query/config',
    method: 'PUT',
    params
  })
}

