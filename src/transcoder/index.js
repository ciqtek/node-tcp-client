
/**
 * @description 二进制编解码器
 *
 * @class Transcoder
 */
class Transcoder {
  constructor () {
    this.packageHeaderLen = 10 // 包头长度
    this.serialNumber = 0xfafafafa // 包头标识 0xfafafafa为普通指令、0xafafafaf为二进制绘图数据
    this.packageSerialNumberLen = 6 // 包序列号所占用的字节 其中前2个字节为功能码 后2个字节为数据长度
    this.funcNumLen = 2 // 功能码长度 0x0001（设备列表）0x0002（普通指令）0x0003（解调数据）0x0004(示波auto）0x0005（示波normal）0x0006（示波signal）0x0007（示波历史数据）
    this.bodyLen = 4 // 数据包长度
  }

  /**
   * 编码
   * @param { Object } data Buffer 对象数据
   * @param { Int } serialNumber 包头标识 0xfafafafa
   */
  encode (data, serialNumber) {
    const body = Buffer.from(data)
    const header = Buffer.alloc(this.packageHeaderLen)
    header.writeUInt32LE(serialNumber || this.serialNumber)
    header.writeUInt16LE(0x0022, 4) // 跳过包头标识的前4位
    header.writeUInt32LE(body.length, 6) // 跳过包头标识的前4位和功能码2位
    return Buffer.concat([header, body])
  }

  /**
   * 解码
   * @param { Object } buffer
   */
  decode (buffer) {
    const header = buffer.slice(0, this.packageHeaderLen) // 获取包头
    const body = buffer.slice(this.packageHeaderLen) // 获取包尾部
    return {
      serialNumber: header.readInt32LE(),
      funcCode: header.readUInt16LE(this.packageHeaderLen - this.packageSerialNumberLen), // 跳过包头标识
      bodyLength: header.readUInt32LE(this.packageHeaderLen - this.bodyLen), // 跳过包头标识和功能码的长度读取包头最后两字节
      body: body
    }
  }

  /**
   * 获取包长度两种情况：
   * 1. 如果当前 buffer 去包头（包头为10个字节）后长度 小于 包头中包信息长度（包头中后2个字节），肯定不是一个完整的数据包，因此直接返回 0 不做处理（可能数据还未接收完等等）
   * 2. 包头前4个字节为包头信息标识fafafafa
   * 2. 否则返回这个完整的数据包的有效长度和无效位数
   * @param {Buffer} buffer
   */
  getPackageLength (buffer) {
    let invalidByte = 0 // 无效位数
    if (buffer.length >= 10) { // 如果数据长度小于包头长度则直接返回false
      let findHead = true
      while (findHead) {
        if (invalidByte <= buffer.length - 4) {
          if (buffer.readUInt32LE(invalidByte) === 0xfafafafa) { // 读取包头标识
            findHead = false
          } else {
            invalidByte++
          }
        } else {
          invalidByte = buffer.length
          findHead = false
        }
      }
      const validBuffer = buffer.slice(invalidByte) // 有效数据buffer
      if (validBuffer.length < 10) {
        return {
          bufferLength: 0,
          invalidByte
        }
      }
      const headBodyLength = validBuffer.readUInt32LE(6) // 跳过包头前6个字节读取包数据长度
      const bodyLength = validBuffer.slice(10, headBodyLength + 10).length // 去包头后buffer实际长度
      if (buffer.readUInt32LE() === 0xfafafafa && bodyLength === headBodyLength) {
        return {
          bufferLength: validBuffer.length,
          invalidByte
        }
      } else {
        return {
          bufferLength: 0,
          invalidByte
        }
      }
    } else {
      return {
        bufferLength: 0,
        invalidByte
      }
    }
  }
}

export default Transcoder
