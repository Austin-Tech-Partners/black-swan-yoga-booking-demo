import { useParams } from 'react-router-dom';

const DonationPage = () => {
  const { classId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Select Donation</h1>
      <p>Class ID: {classId}</p>
    </div>
  );
};

export default DonationPage; 