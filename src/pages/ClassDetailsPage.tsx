import { useParams } from 'react-router-dom';

const ClassDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Class Details</h1>
      <p>Class ID: {id}</p>
    </div>
  );
};

export default ClassDetailsPage; 