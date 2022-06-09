import Vue from 'vue'
import { Button,
    Form,
    FormItem,
    Input,
    Message,
    Dialog,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Pagination,
    MessageBox,
    Switch
} from "element-ui";
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Switch)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
export default{
    install(Vue){
        // 定义全局过滤器
        Vue.filter('过滤器名称',function(value){

        })

        // 定义全局指令
        Vue.directive('fbind', function (el, binding) {

        });

        // 定义混入
        Vue.mixin();

        // 给Vue原型上添加一个方法
        Vue.prototype.hello = ()=>{
            alert("hello");
        }
    }
}
