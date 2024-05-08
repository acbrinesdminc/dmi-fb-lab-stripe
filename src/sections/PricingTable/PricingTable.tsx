// If using TypeScript, add the following snippet to your file as well.
import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

const PricingTable = () => {
  return (
    <stripe-pricing-table
      pricing-table-id="prctbl_1P3fhGP35R8ThoH8gzf7pXtK"
      publishable-key="pk_test_51P16UDP35R8ThoH8qwUEEOQb295YzQLfc55irxMBqFD1cdr1qwOzJYTATNED9G4inM1qUs2ZGItUjsvNbausRxts00h9NxkDef"
    ></stripe-pricing-table>
  );
};

export default PricingTable;
