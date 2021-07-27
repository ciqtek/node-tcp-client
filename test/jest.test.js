/*
 * @Author: your name
 * @Date: 2021-07-26 09:40:28
 * @LastEditTime: 2021-07-27 19:51:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \qmc-libs\test\jest.test.js
 */
import TCPClient from "../dist/node-tcp-client.ejs"

if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: function () { } })
}
describe('WorkerEcharts', () => {
  test('TCPClient', () => {
    console.log(new TCPClient())
  })
})