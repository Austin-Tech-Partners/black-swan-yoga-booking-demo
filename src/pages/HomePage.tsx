import { useSchedule } from '../hooks/useSchedule';

const HomePage = () => {
  const { data, loading, error } = useSchedule();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find a Class</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.classes.map(cls => (
          <div key={cls.id} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold">{cls.name}</h2>
            <p className="text-gray-600">{cls.teacher.name}</p>
            <p className="text-gray-600">{cls.studio.name}</p>
            <p className="text-gray-600">
              {new Date(cls.startTime).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage; 