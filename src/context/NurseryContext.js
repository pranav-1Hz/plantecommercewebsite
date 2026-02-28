import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const NurseryContext = createContext({
  nurseries: [],
  addNursery: () => {},
  removeNursery: () => {},
  editNursery: () => {},
  approveNursery: () => {},
  rejectNursery: () => {},
  currentRole: 'admin',
  setCurrentRole: () => {},
  currentUserNurseryId: null,
  setCurrentUserNurseryId: () => {},
});

const NurseryProvider = ({ children }) => {
  const [nurseries, setNurseries] = useState([]);
  const [currentRole, setCurrentRole] = useState('admin');
  const [currentUserNurseryId, setCurrentUserNurseryId] = useState(null);

  const handleSetCurrentRole = role => {
    setCurrentRole(role);
    if (role === 'nursery_owner') {
      setCurrentUserNurseryId(2);
    } else {
      setCurrentUserNurseryId(null);
    }
  };

  const fetchNurseries = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/nurseries');
      if (res.ok) {
        const data = await res.json();
        setNurseries(data);
      }
    } catch (err) {
      console.error('Failed to fetch nurseries:', err);
    }
  };

  useEffect(() => {
    fetchNurseries();
  }, []);

  const addNursery = nursery => {
    const newNursery = {
      ...nursery,
      id: Date.now(),
      status: 'pending',
      ownerId: Date.now() + '-owner',
    };
    setNurseries([...nurseries, newNursery]);
  };

  const removeNursery = async id => {
    // Optimistically remove from UI immediately
    const previousNurseries = nurseries;
    setNurseries(nurseries.filter(n => n.id !== id));
    try {
      const res = await fetch(`http://localhost:5000/api/nurseries/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        // Rollback if backend failed
        setNurseries(previousNurseries);
        alert('Failed to delete nursery from server. Please try again.');
      }
    } catch (err) {
      // Rollback on network error
      setNurseries(previousNurseries);
      console.error('Failed to delete nursery:', err);
      alert('Network error: Could not delete nursery.');
    }
  };

  const editNursery = updatedNursery => {
    setNurseries(nurseries.map(n => (n.id === updatedNursery.id ? updatedNursery : n)));
  };

  const approveNursery = async id => {
    try {
      const res = await fetch(`http://localhost:5000/api/nurseries/${id}/approve`, {
        method: 'PUT',
      });
      if (res.ok) {
        setNurseries(nurseries.map(n => (n.id === id ? { ...n, status: 'approved' } : n)));
      }
    } catch (err) {
      console.error('Failed to approve nursery:', err);
    }
  };

  const rejectNursery = async id => {
    try {
      const res = await fetch(`http://localhost:5000/api/nurseries/${id}/reject`, {
        method: 'PUT',
      });
      if (res.ok) {
        setNurseries(nurseries.map(n => (n.id === id ? { ...n, status: 'rejected' } : n)));
      }
    } catch (err) {
      console.error('Failed to reject nursery:', err);
    }
  };

  return (
    <NurseryContext.Provider
      value={{
        nurseries,
        addNursery,
        removeNursery,
        editNursery,
        approveNursery,
        rejectNursery,
        currentRole,
        setCurrentRole: handleSetCurrentRole,
        currentUserNurseryId,
        setCurrentUserNurseryId,
      }}
    >
      {children}
    </NurseryContext.Provider>
  );
};

NurseryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NurseryProvider;
