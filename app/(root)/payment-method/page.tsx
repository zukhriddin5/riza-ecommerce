import { Metadata } from "next";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PaymentMethodForm from "./payment-method-form";
import CheckOutSteps from "@/components/shared/checkout-steps";

export const metadata:Metadata={
    title:"Select Payment Method",
};
const PaymentMethodPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) redirect('sign-in');

    const user = await getUserById(userId);


    return ( 
    <div>
        <CheckOutSteps current={2}/>
        <PaymentMethodForm  preferedPaymentMethod ={user.paymentMethod}/>
    </div>

   );

}
 
export default PaymentMethodPage;