import CheckoutScreen from "../screens/Admin/checkout/CheckoutScreen";
import ChoosePlan from "../screens/Admin/plan/ChoosePlan";
import ChooseRole from "../screens/ChooseRole";
import CreateUser from "../screens/Admin/userCreate/CreateUser";
import DashboardAdmin from "../screens/Admin/dashboard/DashboardAdmin";
// import Home from "../screens/Home";
import HomeUser from "../screens/Customer/HomeUser";
import Login from "../screens/Login";
import LoginAdmin from "../screens/Admin/login/LoginAdmin";
import MobileNumber from "../screens/Admin/mobile/MobileNumber";
import PlanDetails from "../screens/Admin/detailsPlan/PlanDetails";
import RegisterAdmin from "../screens/RegisterAdmin";
import RegisterDetails from "../screens/RegisterDetails";
import UsersList from "../screens/Admin/listUser/UsersList";
import SuccessScreen from "../screens/Admin/success/SuccessScreen";
import UserProfile from "../screens/Admin/profile/UserProfile";
import ContactUs from "../screens/Admin/contact/ContactUs";
import IdScreen from "../screens/Customer/getStarted/IdScreen";

export const routeNames = {
    MobileVerification: MobileNumber,
    RegisterDetails: RegisterDetails,
    LoginScreen: Login,
    Plan: ChoosePlan,
    HomeScreen: HomeUser,
    Role:ChooseRole,
    UserList:UsersList,
    HomeUser:HomeUser,
    LoginAdmin:LoginAdmin,
    RegisterAdmin:RegisterAdmin,
    Checkout:CheckoutScreen,
    PlanDetails:PlanDetails,
    DashboardAdmin:DashboardAdmin,
    CreateUser:CreateUser,
    SuccessScreen:SuccessScreen,
    UserProfile:UserProfile,
    ContactUs:ContactUs,
    IdScreen:IdScreen 
}
