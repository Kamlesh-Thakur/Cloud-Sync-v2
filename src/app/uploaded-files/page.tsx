'use client';

import DevelopmentTable from 'components/admin/data-tables/DevelopmentTable';
import { useEffect, useState } from 'react';
import tableDataDevelopment from 'variables/data-tables/tableDataDevelopment';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    async function fetchFiles() {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch('/api/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFiles(data.files);

        console.log(data);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('Failed to load files.');
      } finally {
        setLoading(false); // Set loading to false after fetch, regardless of success/failure
      }
    }

    fetchFiles();
  }, []);

  return (
    <div>
      <div className="mt-5 grid h-full">
        <DevelopmentTable tableData={files} />
      </div>
    </div>
  );
};

export default Dashboard;
