import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SubmarineContext} from "../lib/contexts.js";
import { Subscriptions } from "./subscriptions/subscriptions.jsx";
import { PaymentMethods } from "./paymentMethods/paymentMethods.jsx";

const App = () => {
  const submarineContext = useContext(SubmarineContext);
  const { api } = submarineContext.submarine;
  const [selectedTab, setSelectedTab] = useState('subscriptions');

  // load subscriptions for the customer
  const {
    isLoading: isLoadingSubscriptions,
    error: subscriptionsError,
    data: subscriptions
  } = loadSubscriptions(api);

  // load payment methods for the customer
  const {
    isLoading: isLoadingPaymentMethods,
    error: paymentMethodsError,
    data: paymentMethods
  } = loadPaymentMethods(api);

  return (
    <main>
      <Navigation
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <hr />
      <Content
        selectedTab={selectedTab}
        isLoadingSubscriptions={isLoadingSubscriptions}
        isLoadingPaymentMethods={isLoadingPaymentMethods}
        subscriptionsError={subscriptionsError}
        paymentMethodsError={paymentMethodsError}
        subscriptions={subscriptions}
        paymentMethods={paymentMethods}
      />
    </main>
  );
};

function Navigation({ selectedTab, setSelectedTab }) {
  const tabs = {
    subscriptions: 'Subscriptions',
    paymentMethods: 'Payment methods'
  };

  return (
    <nav>
      {Object.keys(tabs).map(tab => {
        if(tab === selectedTab) {
          return <span key={tab}>{tabs[tab]}</span>
        } else {
          return <a key={tab} href="#" onClick={() => setSelectedTab(tab)}>{tabs[tab]}</a>;
        }
      })}
    </nav>
  );
}

function Content({ selectedTab, isLoadingSubscriptions, isLoadingPaymentMethods, subscriptionsError, paymentMethodsError, subscriptions, paymentMethods }) {
  if(isLoadingSubscriptions || isLoadingPaymentMethods) {
    return (
      <section>
        Loading...
      </section>
    );
  }

  if(subscriptionsError || paymentMethodsError) {
    return (
      <section>
        Sorry, an error occurred loading your portal.
      </section>
    )
  }

  switch(selectedTab) {
    case 'subscriptions':
      return (
        <Subscriptions
          subscriptions={subscriptions}
        />
      );
    case 'paymentMethods':
      return (
        <PaymentMethods
          paymentMethods={paymentMethods}
        />
      );
    default:
      return null;
  }
}

function loadSubscriptions(api) {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => {
      return new Promise((resolve, reject) => {
        api.getSubscriptions((subscriptions, errors) => {
          if(errors) {
            reject(errors);
          } else {
            resolve(subscriptions);
          }
        });
      });
    }
  });
}

function loadPaymentMethods(api) {
  return useQuery({
    queryKey: ['paymentMethods'],
    queryFn: () => {
      return new Promise((resolve, reject) => {
        api.getPaymentMethods((paymentMethods, errors) => {
          if(errors) {
            reject(errors);
          } else {
            resolve(paymentMethods);
          }
        });
      });
    }
  });
}

export default App;
