
# node-tcp-client


## 🚄 使用教程

### 安装

```bash
  npm i install node-tcp-client --save-dev or yarn add node-tcp-client --save-dev
```

### 使用

```js
import TCPClient from "node-tcp-client"

let tcpClient = new TCPClient({ip,port})

```

### 📖 文档

<a name="TCPClient"></a>

## TCPClient
**Kind**: global class  

- [node-tcp-client](#node-tcp-client)
  - [🚄 使用教程](#-使用教程)
    - [安装](#安装)
    - [使用](#使用)
    - [📖 文档](#-文档)
  - [TCPClient](#tcpclient)
    - [new TCPClient(options)](#new-tcpclientoptions)
    - [tcpClient.setCallback(handle)](#tcpclientsetcallbackhandle)
    - [tcpClient.send(data)](#tcpclientsenddata)
    - [tcpClient.open(options)](#tcpclientopenoptions)

<a name="new_TCPClient_new"></a>

### new TCPClient(options)
TCP客户端


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | ip - 服务器ip port -服务器端口 |

<a name="TCPClient+setCallback"></a>

### tcpClient.setCallback(handle)
设置回调函数


| Param | Type | Description |
| --- | --- | --- |
| handle | <code>function</code> | 设置回调函数 |

<a name="TCPClient+send"></a>


### tcpClient.send(data)
发送通信命令


| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | 消息 |

<a name="TCPClient+open"></a>


### tcpClient.open(options)
开启client


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | ip - 服务器ip port -服务器端口 |

