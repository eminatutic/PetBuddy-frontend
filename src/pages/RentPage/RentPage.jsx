import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from "../../axios/axiosInstance";
import './RentPage.css';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PaymentMethodEnum } from '../../enums/enums';
import { toast } from 'react-toastify'; 

const RentPage = () => {
    const { id } = useParams();  
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');  
    const [numberOfDays, setNumberOfDays] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [pricePerDay, setPricePerDay] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [petData, setPetData] = useState(null);
    const [numberOfDaysError, setNumberOfDaysError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [paymentMethodError, setPaymentMethodError] = useState('');


    const fetchData = async () => {
        try {
            if (type === 'pet') {
                const response = await axiosInstance.get(`/Pet/${id}`);  
                setPetData(response.data);
                setPricePerDay(response.data.price);
            } else if (type === 'package') {
                const response = await axiosInstance.get(`/SpecialPackage/get-package-by-id/${id}`);  
                setPetData(response.data);
                setPricePerDay(response.data.price);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, type]);

    const handleNumberOfDaysChange = (e) => {
        const value = e.target.value;
        setNumberOfDays(value);
        calculateTotalPrice(value, pricePerDay);
    };

    const calculateTotalPrice = (days, price) => {
        if (days > 0 && price) {
            setTotalPrice(days * price);
        }
    };

    const getPaymentMethodKey = (value) => {
        return parseInt(Object.keys(PaymentMethodEnum).find(key => PaymentMethodEnum[key] === value));
    };

    const validate = () => {
    let hasErrors = false;
    let numberError = '';
    let addressErr = '';
    let paymentErr = '';

    if (!numberOfDays || numberOfDays <= 0) {
        numberError = 'Please enter number of days.';
        hasErrors = true;
    }
    if (!address.trim()) {
        addressErr = 'Please enter your address.';
        hasErrors = true;
    }
    if (!paymentMethod) {
        paymentErr = 'Please select a payment method.';
        hasErrors = true;
    }
    setNumberOfDaysError(numberError);
    setAddressError(addressErr);
    setPaymentMethodError(paymentErr);

    if (hasErrors) return null;

    return {
        numberOfDays: parseInt(numberOfDays),
        address: address.trim(),
        paymentMethod: getPaymentMethodKey(paymentMethod),
        petId: type === 'pet' ? parseInt(id) : null,
        packageId: type === 'package' ? parseInt(id) : null
    };
};


    const handleSubmit = async () => {
        const rentData = validate();
        if (!rentData) return;
        try {
            if (type === 'pet') {
                await axiosInstance.post(`/RentInfo/create-for-pet/${id}`, rentData);
            } else if (type === 'package') {
                await axiosInstance.post(`/RentInfo/create-for-package/${id}`, rentData);
            }
            toast.success('Rental confirmed!');
            navigate('/profile');
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            toast.error('An error occurred while confirming the rental.');
        }
    };

    return (
        <div className="rent-page-bckgr">
            <div className="rent-page-container">
                <div className="rent-page-header">
                    <h1 className="rent-page-title">Rental confirmation</h1>
                </div>
                <div className="rent-page-details">
                    <div className="rent-page-flex-container">
                        <div className="rent-page-form-left">
                            <div className="rent-page-form-group">
                                <label htmlFor="numberOfDays" className="rent-page-form-label">Number of days</label>
                                <input
                                    type="number"
                                    id="numberOfDays"
                                    className="rent-page-form-number"
                                    placeholder="Enter number of days"
                                    min="1"
                                    max="365"
                                    value={numberOfDays}
                                    onChange={handleNumberOfDaysChange}
                                    required
                                />
                                 {numberOfDaysError && <p className="error-message-rent">{numberOfDaysError}</p>}
                            </div>

                            <div className="rent-page-form-group">
                                <label htmlFor="address" className="rent-page-form-label">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    className="rent-page-form-address"                                    
                                    placeholder="Enter your address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                                 {addressError && <p className="error-message-rent">{addressError}</p>}
                            </div>
                        </div>

                        <div className="rent-page-form-right">
                            <div className="rent-page-form-group rent-page-radio-group">
                                <label className="rent-page-form-label">Payment method</label>
                                <div>
                                    {Object.entries(PaymentMethodEnum).map(([key, value]) => (
                                        <label key={key}>
                                            <input
                                                type="radio"
                                                value={value}
                                                checked={paymentMethod === value}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            /> {value}
                                        </label>
                                    ))}
                                    
                                </div>
                                {paymentMethodError && <p className="error-message-rent">{paymentMethodError}</p>}
                            </div>

                       <PayPalScriptProvider options={{
                                "client-id": "AaiDDmW8TcJxLlmGPm_padOBej_MU2OaXKcBJEsCQjdYi90DrKvLvoDycbCsW1PVitS646PM7L4wjVIM",
                                "intent": "authorize",
                                "components": "buttons"
                            }}>
                                {paymentMethod === 'PayPal' && (
                                    <PayPalButtons
                                        createOrder={(data, actions) => {
                                            const rentData = validate();
                                            if (!rentData) return;

                                            return actions.order.create({
                                                purchase_units: [{
                                                    amount: {
                                                        value: totalPrice.toString()
                                                    }
                                                }]
                                            });
                                        }}
                                        onApprove={async (data, actions) => {
                                            try {
                                                const order = await actions.order.authorize();
                                                console.log('Payment authorized', order);
                                                await handleSubmit();
                                            } catch (error) {
                                                console.error('Authorization error', error);
                                                toast.error('There was a problem with the payment.');
                                            }
                                        }}
                                        onError={(err) => {
                                            console.error('PayPal error', err);
                                            toast.error('PayPal payment failed. Try again.');
                                        }}
                                    />
                                )}
                        </PayPalScriptProvider>

                        </div>
                    </div>
                </div>

                <div className="rent-page-pet-details">
                    <div className="rent-page-pet-info">
                        {petData && type === 'pet' && (
                            <div className="pet-card">
                                <img src={petData.imageUrl} alt={petData.name} className="rent-page-pet-image" />
                                <div className="pet-info">
                                    <h3>{petData.name}</h3>
                                    <p>Price per day: €{petData.price}</p>
                                </div>
                            </div>
                        )}

                        {petData && type === 'package' && (
                <div>
                    <h3>Package includes:</h3>
                    {petData.specialPackagePets?.map(({ pet }, index) => (
                    <div key={index} className="pet-card">
                        <img src={pet.imageUrl} alt={pet.name} className="rent-page-pet-image" />
                        <div className="pet-info">
                        <h3>{pet.name}</h3>
                        </div>
                    </div>
                    ))}
                    <div className="pet-info">
                    <p>Package price per day: €{petData.price}</p>
                    </div>
                </div>
                )}
                    </div>
                </div>
                <section className="rent-page-summary">
                    <div className="rent-page-summary-item">
                        <span className="rent-page-summary-label">Total price:</span>
                        <span className="rent-page-summary-value">€{totalPrice}</span>
                    </div>
                </section>
        {   
            paymentMethod === 'Cash' && (
                    <div className="rent-page-confirmation">
                        <button className="rent-page-confirm-button" onClick={handleSubmit}>Confirm rental</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RentPage;
