
import Transcoder from './transcoder'
const net = require('net')


/**
 * @description TCP客户端
 * @param  {Object} options - ip - 服务器ip port -服务器端口
 * 
 */
class TCPClient {

  constructor ({ ip, port } = {}) {
    if (!port || !ip) {
      throw new Error(`open must have ip and port`)
    }
    this.client = null // TCPsocket实例
    this.isConnected = false // 连接状态
    this.isClose = false // 是否关闭App
    this.busHandle = null // 总线的处理函数
    this.transcoder = new Transcoder()
    this.overageBuffer = '' // Buffer 缓冲区
    this.open({ ip, port })
  }
  /**
   * @description 设置回调函数
   * @param {function} handle 设置回调函数
   */
  setCallback (handle) {
    this.busHandle = handle
  }
  /**
   * 发送通信命令
   * @param {Object} data 消息
   */
  send (data) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data)
    }
    if (this.client) this.client.write(this.transcoder.encode(data))
  }

  /**
   * 开启client
   * @param  {Object} options - ip - 服务器ip port -服务器端口
   * 
   */
  open ({ ip, port }) {
    this.isClose = false
    if (this.client) return false
    const client = this.client = new net.Socket()

    client.connect(port, ip, e => {
      console.log('connect to ' + IP)
      // 更新websocket连接状态
      this.isConnected = true
      if (this.busHandle) this.busHandle('connect', e)
    })
    client.on('data', buffer => {
      // console.log('serverDataLength',buffer.length);
      // console.log('缓冲区剩余长度:', this.overageBuffer.length)
      if (this.overageBuffer) {
        this.overageBuffer = Buffer.concat([this.overageBuffer, buffer])
      } else {
        this.overageBuffer = buffer
      }
      // 处理本次从socket缓冲区读取数据包含多个包头.toString()
      let packageLength = this.transcoder.getPackageLength(this.overageBuffer)
      while (packageLength.bufferLength) {
        this.overageBuffer = this.overageBuffer.slice(packageLength.invalidByte) // 有效数据buffer
        const skipWidth = 10 // 包头长度
        const skip = 6 // 读取包长度时需要跳过的字节数 包序列号(4字节)、功能符号（2字节）
        const bodyLength = this.overageBuffer.readUInt32LE(skip) // 跳过标识位 读取包头中包长度信息 包头信息为包序列号(4字节)、功能符号（2字节）和包长度(2字节)
        const packager = this.overageBuffer.slice(skipWidth, bodyLength + skipWidth) // 从缓冲区截取包头信息所给长度的buffer
        if (bodyLength === packager.length) {
          const packagerWithHead = this.overageBuffer.slice(0, bodyLength + skipWidth) // 从缓冲区取出整包数据buffer
          this.overageBuffer = this.overageBuffer.slice(bodyLength + skipWidth) // 删除已经取出的数据包，这里采用的方法是把缓冲区（buffer）已取出的包给截取掉
          const result = this.transcoder.decode(packagerWithHead) // 解码
          if (this.busHandle) this.busHandle('message', result) // 交给渲染进程分发处理
        }
        packageLength = this.transcoder.getPackageLength(this.overageBuffer)
      }
    })
    client.on('close', error => {
      // console.log('close', error)
      if (this.busHandle) this.busHandle('close', error)
      this.isConnected = false
      this.client = null
      this.open()
    })
    client.on('error', error => {
      // console.log('error', error)
      if (this.busHandle) this.busHandle('error', error)
    })
  }
}

export default TCPClient
