import './header.css';
import tem from './header.ejs';
const Header =function(){
    return {
        name:'header',
        tpl:tem
    }
}
console.log("header",tem)
export default Header;
