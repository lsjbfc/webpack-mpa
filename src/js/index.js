import com from './com.js'
import "../css/index.css";
import Header from '../template/header/header.js'


const  App = function () {
    const dom = document.getElementById('header');
    let header = new Header();
    dom.innerHTML = header.tpl({ //此时lay.tpl是一个函数，函数执行并传参
        name: 'jeson',
        arr: ['张三', '李四', '王五', '赵六']
    });
}
// console.log("jquery",jquery)
new App();

console.log("xxx",com.HTTP_URL)

