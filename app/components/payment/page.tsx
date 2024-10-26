"use client";
import React, { useState } from 'react';
import Modal from 'react-modal'; // Make sure to install react-modal
import { CircularProgress } from '@mui/material';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: (method: 'stripe' | 'paypal', cardDetails: any) => Promise<void>;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPayment }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (method: 'stripe' | 'paypal') => {
    setLoading(true);
    const cardDetails = { cardNumber, expiryDate, cvc };

    try {
      await onPayment(method, cardDetails);
      onClose(); // Close modal after payment
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="payment-modal" overlayClassName="overlay">
      <h2 className="text-2xl mb-4">Payment Details</h2>
      <form>
        <div className="mb-4">
          <label className="block mb-1">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Expiry Date (MM/YY)</label>
          <input
            type="text"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">CVC</label>
          <input
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <button
          type="button"
          onClick={() => handlePayment('stripe')} // or 'paypal' based on your logic
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay Now'}
        </button>
      </form>
      <button onClick={onClose} className="mt-4 text-red-500">
        Cancel
      </button>
    </Modal>
  );
};

export default PaymentModal;
