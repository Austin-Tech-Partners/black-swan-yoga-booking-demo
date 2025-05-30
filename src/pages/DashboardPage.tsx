const DashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
          <p className="text-gray-600">No upcoming classes</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Past Classes</h2>
          <p className="text-gray-600">No past classes</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 