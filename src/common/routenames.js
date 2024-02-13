import CheckoutScreen from "../screens/Admin/CheckoutScreen";
import ChoosePlan from "../screens/Admin/ChoosePlan";
import ChooseRole from "../screens/ChooseRole";
import CreateUser from "../screens/Admin/CreateUser";
import DashboardAdmin from "../screens/Admin/DashboardAdmin";
// import Home from "../screens/Home";
import HomeUser from "../screens/Customer/HomeUser";
import Login from "../screens/Login";
import LoginAdmin from "../screens/Admin/LoginAdmin";
import MobileNumber from "../screens/Admin/MobileNumber";
import PlanDetails from "../screens/Admin/PlanDetails";
import RegisterAdmin from "../screens/Admin/RegisterAdmin";
import RegisterDetails from "../screens/RegisterDetails";
import UsersList from "../screens/Admin/UsersList";
import SuccessScreen from "../screens/Admin/SuccessScreen";
import UserProfile from "../screens/Admin/UserProfile";

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
    UserProfile:UserProfile
}
