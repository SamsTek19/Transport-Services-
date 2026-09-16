export const FARE_RULES = {
  minimumFare: 25,
  includedMiles: 4,
  mileageRate: 2.5,
  waitingBlockMinutes: 15,
  waitingBlockRate: 10,
} as const;

export interface FareInput {
  distanceMiles: number;
  waitingMinutes: number;
  roundTrip: boolean;
}

export interface FareBreakdown {
  mileageMiles: number;
  baseFare: number;
  mileageCharge: number;
  waitingCharge: number;
  total: number;
}

export function calculateFare({ distanceMiles, waitingMinutes, roundTrip }: FareInput): FareBreakdown {
  const oneWayMiles = Math.max(0, distanceMiles || 0);
  const mileageMiles = oneWayMiles * (roundTrip ? 2 : 1);
  const billableExtraMiles = Math.max(0, mileageMiles - FARE_RULES.includedMiles);
  const waitingBlocks = Math.ceil(Math.max(0, waitingMinutes || 0) / FARE_RULES.waitingBlockMinutes);
  const baseFare = FARE_RULES.minimumFare;
  const mileageCharge = billableExtraMiles * FARE_RULES.mileageRate;
  const waitingCharge = waitingBlocks * FARE_RULES.waitingBlockRate;
  const total = Math.round((baseFare + mileageCharge + waitingCharge) * 100) / 100;

  return { mileageMiles, baseFare, mileageCharge, waitingCharge, total };
}
