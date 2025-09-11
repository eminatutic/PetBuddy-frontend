import React from 'react';
import PetCardPackage from '../Card/PetCardPackage';
import "./PetCardsPackage.css"; 

function PetCardsPackage({pets, selectedPets, onAdd, onRemove}) {
    return (
        <div className="pet-cards-package">
            {pets.map((pet) => (
                <PetCardPackage
                    key={pet.id}
                    pet={pet}
                    onAdd={onAdd}
                    onRemove={onRemove}
                    isSelected={selectedPets.some(selectedPet => selectedPet.id === pet.id)}
                />
            ))}
        </div>
    );
}

export default PetCardsPackage;
