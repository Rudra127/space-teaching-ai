import React, { useEffect, useState } from 'react';
import { BorderBeam } from './border-beam';
import { Meteors } from './meteors';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
const PricingCard = ({ plan, features, price, buttonText }) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_TEST_KEY);
  const router = useRouter();
  const searchParams = useSearchParams();
  let success = searchParams.get('success');
  let error = searchParams.get('error');
  const [errorState, setErrorState] = useState(error == 'true' ? true : false);
  const [successState, setSuccessState] = useState(success == 'true' ? true : false);

  const CreateCheckoutSession = async (id) => {
    const stripe = await stripePromise;

    try {
      const session = await axios.post(
        `/payment/create-checkout-session/price_1Pz19wSCN5U3Z9OGj90KeI3Y`,
      );
      console.log(session.data.id);

      if (session.status === 200) {
        localStorage.setItem('sessionId', session.data.id);

        const { error } = await stripe.redirectToCheckout({
          sessionId: session.data.id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <>
      
      <div className="relative flex  mt-5  w-full flex-col   justify-center overflow-hidden  rounded-lg z-10 h-[100%]">
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between h-[100%] ">
          <div>
            <h2 className="text-4xl  font-bold inconsolata  ">{plan}</h2>
            <p className="mb-6 inconsolata">Features of Free Plan</p>
            <ul className="mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center mb-2">
                  <svg
                    className="w-6 h-6 text-[#006ED0] mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-2xl font-bold mb-6 text-[#006ED0]">{price}</p>

            <button
              onClick={() => CreateCheckoutSession(plan.id)}
              className="w-full py-2 bg-[#006ED0] hover:bg-[#13DEB9] text-white font-semibold rounded-lg transition-colors duration-300"
            >
              {buttonText}
            </button>
          </div>
          {/* <BorderBeam size={200} duration={10} delay={7} /> */}
          {/* <Meteors number={20} /> */}
        </div>
      </div>
    </>
  );
};

export default PricingCard;
