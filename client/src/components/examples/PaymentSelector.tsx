import PaymentSelector from '../PaymentSelector';

export default function PaymentSelectorExample() {
  return (
    <div className="max-w-3xl mx-auto">
      <PaymentSelector 
        depositAmount={500} 
        breedType="Goldendoodle"
        onPaymentSelect={(method) => console.log('Selected payment method:', method)}
      />
    </div>
  );
}
