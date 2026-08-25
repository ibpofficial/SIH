export interface GlossaryItem {
  id: string;
  term: string;
  abbreviation?: string;
  shortDefinition: string;
  fullExplanation: string;
  category: 'SHIPPING' | 'PORT' | 'FINANCE' | 'ML_ANALYTICS';
}

export const glossaryData: GlossaryItem[] = [
  {
    id: 'draft',
    term: 'Vessel Draft / Port Max Draft',
    abbreviation: 'Draft',
    shortDefinition: 'The vertical distance between the waterline and the bottom of the vessel hull.',
    fullExplanation: 'Max draft determines the minimum water depth required for a ship to berth safely. If a vessel draft exceeds a port max draft constraint (e.g. Kolkata/Haldia 7.8m), the vessel cannot enter that port without risking grounding.',
    category: 'PORT'
  },
  {
    id: 'loa',
    term: 'Length Overall',
    abbreviation: 'LOA',
    shortDefinition: 'The maximum total length of a ship measured from bow to stern.',
    fullExplanation: 'Port quays and berths have maximum length constraints. Vessels longer than a berth LOA limit cannot physically dock.',
    category: 'SHIPPING'
  },
  {
    id: 'mae',
    term: 'Mean Absolute Error',
    abbreviation: 'MAE',
    shortDefinition: 'A statistical measure showing how far machine learning predictions missed actual freight rates on average.',
    fullExplanation: 'Lower MAE indicates higher forecast accuracy. For example, an MAE of $1.45/MT means forecasted freight rates deviate by only $1.45 on average from actual market rates.',
    category: 'ML_ANALYTICS'
  },
  {
    id: 'mape',
    term: 'Mean Absolute Percentage Error',
    abbreviation: 'MAPE',
    shortDefinition: 'The average forecast error expressed as a percentage of actual values.',
    fullExplanation: 'A MAPE under 10% indicates excellent predictive model performance for time-series rate forecasting.',
    category: 'ML_ANALYTICS'
  },
  {
    id: 'laycan',
    term: 'Laycan Window',
    abbreviation: 'Laycan',
    shortDefinition: 'The agreed period of dates during which a vessel must arrive at the loading port to commence loading.',
    fullExplanation: 'If a ship arrives before the laycan window, it must wait; if it arrives after, the charterer has the right to cancel the contract.',
    category: 'SHIPPING'
  },
  {
    id: 'ballast',
    term: 'Ballast Repositioning',
    abbreviation: 'Ballast',
    shortDefinition: 'Sailing an empty vessel (with water ballast) from a discharge port to a new loading region.',
    fullExplanation: 'Repositioning empty ships incurs fuel costs but allows shipowners to position vessels in high-demand trading routes for maximum charter earnings.',
    category: 'SHIPPING'
  },
  {
    id: 'coa',
    term: 'Contract of Affreightment',
    abbreviation: 'COA Contract',
    shortDefinition: 'A long-term multi-voyage contract where a shipowner agrees to transport a specified volume of cargo over multiple trips at fixed rates.',
    fullExplanation: 'COA multi-voyage contracts provide price protection against spot market rate inflation, reducing freight volatility exposure.',
    category: 'FINANCE'
  },
  {
    id: 'spot',
    term: 'Spot Charter',
    abbreviation: 'Spot',
    shortDefinition: 'Hiring a vessel for a single immediate voyage at current spot market freight rates.',
    fullExplanation: 'Spot charters offer flexibility but expose procurement teams to sudden rate spikes during market tightness.',
    category: 'FINANCE'
  },
  {
    id: 'demurrage',
    term: 'Demurrage Penalty',
    abbreviation: 'Demurrage',
    shortDefinition: 'A financial penalty paid by the charterer for vessel delays beyond agreed loading/discharging time in port.',
    fullExplanation: 'Port berth congestion and slow discharge equipment increase turnaround days, triggering expensive demurrage charges.',
    category: 'FINANCE'
  },
  {
    id: 'turnaround',
    term: 'Port Turnaround Days',
    abbreviation: 'Turnaround',
    shortDefinition: 'Total days required for a vessel to berth, discharge cargo, and clear port anchorage.',
    fullExplanation: 'Calculated as total cargo quantity divided by daily port handling throughput plus berth queuing time.',
    category: 'PORT'
  },
  {
    id: 'bdi',
    term: 'Baltic Dry Index',
    abbreviation: 'BDI',
    shortDefinition: 'The global benchmark index measuring the price of moving major raw bulk commodities by sea.',
    fullExplanation: 'Tracks Capesize, Panamax, and Supramax charter rates worldwide and serves as an early indicator of global economic activity.',
    category: 'ML_ANALYTICS'
  }
];

export const getGlossaryTerm = (idOrTerm: string): GlossaryItem | undefined => {
  const query = idOrTerm.toLowerCase();
  return glossaryData.find(
    (g) => g.id.toLowerCase() === query || g.abbreviation?.toLowerCase() === query || g.term.toLowerCase() === query
  );
};
