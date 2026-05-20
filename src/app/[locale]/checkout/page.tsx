import { getCart } from "@/features/cart/actions";
import { CheckoutClient } from "./checkout-client";
import { getStoreSettings, COUNTRIES } from "@/lib/settings";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const cart = await getCart();
  const settings = await getStoreSettings();
  
  const supportedCountries = COUNTRIES.filter(c => 
    settings.supported_countries.includes(c.code)
  );

  return (
    <CheckoutClient 
      cart={cart} 
      locale={locale}
      settings={settings}
      countries={supportedCountries}
    />
  );
}