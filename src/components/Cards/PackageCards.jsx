import React from "react";
import PackageCard from "../Card/PackageCard";
import "./PackageCards.css";

function PackageCards({ packages, isAdmin, deletePackage, navigateToDetails }) {
  return (
    <div className="package-cards-container">
      {packages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          id={pkg.id}
          packageType={pkg.packageType}
          pets={pkg.specialPackagePets.map(spp => spp.pet)}
          price={pkg.price}
          isAdmin={isAdmin}
          deletePackage={deletePackage}
          navigateToDetails={navigateToDetails}
        />
      ))}
    </div>
  );
}

export default PackageCards;
