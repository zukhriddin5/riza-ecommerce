import { cn } from "@/lib/utils";
const ProductPrice = ({value, className}: {value:number, className?:string}) => {
    //ensure two desimal number
    const stringValue = value.toFixed(2);
    // get the int and float number => 59.99
    const [intValue, floatValue] =stringValue.split('.');

    return ( 
    //to make dynamic 
    <p className ={cn('text-2xl', className)} >
        <span className="text-xs align-super">$</span>
        {intValue}
        <span className="text-xs align-super">.{floatValue}</span>
    </p> );
}
 
export default ProductPrice;