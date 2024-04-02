import CheckoutScreen from "../screens/Admin/checkout/CheckoutScreen";
import ChoosePlan from "../screens/Admin/plan/ChoosePlan";
import CreateUser from "../screens/Admin/userCreate/CreateUser";
import DashboardAdmin from "../screens/Admin/dashboard/DashboardAdmin";
import LoginAdmin from "../screens/Admin/login/LoginAdmin";
import MobileNumber from "../screens/Admin/mobile/MobileNumber";
import PlanDetails from "../screens/Admin/detailsPlan/PlanDetails";
import UsersList from "../screens/Admin/listUser/UsersList";
import SuccessScreen from "../screens/Admin/success/SuccessScreen";
import UserProfile from "../screens/Admin/profile/UserProfile";
import IdScreen from "../screens/Customer/getStarted/IdScreen";
import CurrentPlan from "../screens/Admin/currentPlanDetail/CurrentPlan";
import AdminProfile from "../screens/Admin/adminProfile/AdminProfile";
import Settings from "../screens/Admin/settings/Settings";
import ChangePassword from "../screens/Admin/changePassword/ChangePassword";

export const routeNames = {
    MobileVerification: MobileNumber,
    Plan: ChoosePlan,
    UserList:UsersList,
    LoginAdmin:LoginAdmin,
    Checkout:CheckoutScreen,
    PlanDetails:PlanDetails,
    DashboardAdmin:DashboardAdmin,
    CreateUser:CreateUser,
    SuccessScreen:SuccessScreen,
    UserProfile:UserProfile,
    IdScreen:IdScreen ,
    CurrentPlan: CurrentPlan,
    AdminProfile:AdminProfile,
    Settings:Settings,
    ChangePassword:ChangePassword,
}
