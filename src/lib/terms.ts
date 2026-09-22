import { supabase } from './supabase';

export const DEFAULT_TERMS = `Welcome to Angels of Hope Transportation LLC. By requesting, booking, or using our transportation services, you acknowledge that you have read, understood, and agreed to the following Terms & Conditions.

1. Transportation Services
Angels of Hope Transportation LLC provides passenger transportation services over irregular routes and on an irregular schedule.

Our service area includes points within the following Virginia cities and counties: Alexandria, Fairfax, Falls Church, Manassas, and Manassas Park; Arlington, Fairfax, Fauquier, Loudoun, Prince William, and Stafford.

Our transportation services are limited to vehicles with a seating capacity of no more than 15 passengers, including the driver.

2. Rates and Charges
Unless otherwise stated or required for Medicaid transportation, the applicable charges are: Minimum Charge $25.00, covering up to and including the first 4 miles; Mileage $2.50 per mile; Waiting Time $10.00 per quarter hour, or fraction thereof, when waiting time is requested or directed by the passenger.

3. Booking and Trip Information
Passengers are responsible for providing accurate information when making a reservation, including pickup location, destination, date and requested time, number of passengers, and other required information.

4. Waiting Time and Stops
Passengers may be charged for waiting time when the vehicle is required to wait at the passenger's direction.

5. Passenger Responsibilities
Passengers are expected to treat the driver and other passengers with respect, follow safety instructions, remain seated while the vehicle is moving, and avoid damaging the vehicle.

6. Cleaning Charge
If a passenger soils the vehicle to an extent that makes it unpresentable or unsuitable for further use, a $100 cleaning charge may be assessed.

7. Damage to Vehicle
If a passenger causes damage to the vehicle or its equipment, the responsible passenger may be charged for reasonable repair costs.

8. Safety
Passenger and driver safety are a priority. The driver may refuse or discontinue transportation when necessary to address an immediate safety concern.

9. Medicaid Transportation
When transportation is provided to a Medicaid recipient, the applicable Medicaid requirements and reimbursable rates in effect at the time of service will apply.

10. Changes to Transportation Services
Transportation schedules and trip details may change based on operational needs. Passengers should contact us as soon as possible if they need to make changes.

11. Agreement to These Terms
By booking or using transportation services provided by Angels of Hope Transportation LLC, the passenger or authorized representative acknowledges that they have had an opportunity to review these Terms & Conditions and agrees to comply with the applicable terms.`;

export interface SiteTerms {
  content: string;
  updated_at?: string;
}

export async function fetchSiteTerms(): Promise<SiteTerms> {
  const { data, error } = await supabase.from('site_terms').select('content, updated_at').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data ?? { content: DEFAULT_TERMS };
}

export async function updateSiteTerms(content: string) {
  const { data, error } = await supabase
    .from('site_terms')
    .upsert(
      { id: 1, content, updated_at: new Date().toISOString(), updated_by: (await supabase.auth.getUser()).data.user?.id },
      { onConflict: 'id' }
    )
    .select('content, updated_at')
    .single();
  if (error) throw error;
  return data as SiteTerms;
}