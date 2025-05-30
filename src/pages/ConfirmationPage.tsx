import { useParams } from 'react-router-dom';

const ConfirmationPage = () => {
  const { bookingId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Booking Confirmed</h1>
      <p>Booking ID: {bookingId}</p>
    </div>
  );
};

export default ConfirmationPage; 