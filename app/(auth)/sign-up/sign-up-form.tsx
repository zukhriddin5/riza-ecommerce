'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react"; //hook
import { useFormStatus } from "react-dom"; //hook
import { signUpUser } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

const SignUpForm = () => {
    const [data, action] = useActionState(signUpUser,{
        success:false,
        message:''
    })

    const searchParams=useSearchParams();
    const callbackUrl =searchParams.get('callbackUrl') || '/';

    const SignUpButton=()=>{
        const {pending} =useFormStatus();

        return (
            <Button disabled={pending} className='w-full' variant='default'>
                {pending ? 'Submiting ..' : 'Sign up'}
            </Button>
        )
    }
    return ( <form action={action}>
        <input type="hidden" name='callbackUrl' value={callbackUrl}/>
        <div className='space-y-6'>
            <div>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' name='name' type='text' autoComplete="name" defaultValue={signUpDefaultValues.name}/>
            </div>
             <div>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' name='email' type='email' autoComplete="email" defaultValue={signUpDefaultValues.email}/>
            </div>
            <div></div>
                <Label htmlFor='password'>Password</Label>
                <Input id='password' name='password'type='password' autoComplete="password" defaultValue={signUpDefaultValues.password}/>
            <div>
                <Label htmlFor='confirmPassword'> Confirm Password</Label>
                <Input id='confirmPassword' name='confirmPassword'type='password' autoComplete="confirmPassword" defaultValue={signUpDefaultValues.confirmPassword}/>
            </div>
            <div>
            <SignUpButton />
                {data && !data.success && (
                    <div className='text-center text-destructive'>{data.message}</div>
                )}
            </div>
            <div className='text-sm text-center text-muted-foreground'>
                Already have an account ? {``}
                <Link href='/sign-in' target='_self' className='link underline text-black'>
                Sign In
                </Link>
            </div>

        </div>
    </form>);
}
 
export default SignUpForm;