import React from 'react';
import './PetCardPackage.css';  
import { SizeEnum } from '../../enums/enums';
import Button from '../Button/Button';

function PetCardPackage({pet, onAdd, onRemove, isSelected}) {

const size = SizeEnum[pet.size] || 'Unknown';

return (
    <div className="pet-card-package">
        <div className="pet-image-container-package">
            <img 
                src={pet.imageUrl}
                alt={pet.name} 
                className="pet-image-package"
            />
        </div>
        <h2 className="pet-name-package"><strong>{pet.name}</strong></h2>
        <div className="pet-info-package">
            <p className="pet-age-package">Age: {pet.age === 1 ? "1 month" : `${pet.age} months`}</p>
            <p className="pet-size-package">Size: {size}</p>
            <p className="pet-price-package">Price: ${pet.price}</p>
            {isSelected ? (
                <Button
                    className="remove-btn-package" 
                    text="Remove"
                    onClick={() => onRemove(pet)}
                />
            ) : (
                <Button
                    className="add-btn-package" 
                    text="Add"
                    onClick={() => onAdd(pet)}
                />
            )}
        </div>
    </div>
);
}

export default PetCardPackage;
