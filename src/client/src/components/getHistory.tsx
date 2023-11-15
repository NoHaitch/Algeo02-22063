import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ImageHistory = () => {
  const [historyData, setHistoryData] = useState<string[]>([]);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/uploads/image.json');
        const data = await response.json();
        // Exclude the first element
        const historyWithoutFirstElement = data.slice(1);
        setHistoryData(historyWithoutFirstElement);
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    fetchHistoryData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="history-container"
    >
      <h2 className="text-xl font-bold mb-4">Upload History</h2>
      {historyData.length > 0 ? (
        <ul className="list-disc list-inside">
          {historyData.map((imageName, index) => (
            <li key={index}>{imageName}</li>
          ))}
        </ul>
      ) : (
        <p>No upload history available.</p>
      )}
    </motion.div>
  );
};

export default ImageHistory;
