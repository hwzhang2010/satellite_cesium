///引入mock模块
import Mock from 'mockjs'

// Mock.Random 是一个工具类，用于生成各种随机数据
const Random = Mock.Random 

const getMockData = {
    getData (options) {
        return {
            "code": 0,
            "data": {
                "username": "Tom",
                "password": "1234"
            },
            "message": "success"
        }
    }
}
const postMockData = {
  
    sumbitConfig () {
        return {
            "code": 0,
            "data": null,
            "message": "error"
        }
    }
}

Mock.mock('/api/user', 'get', getMockData.getData)

Mock.mock('/api/msg', 'post', postMockData.sumbitConfig)