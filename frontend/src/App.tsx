import './App.css';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import MaterialsTable from './components/MaterialsTable';
import AddForm from './components/AddForm';
import EditForm from './components/EditForm';
import { MetadataField } from './interfaces/MetadataField';

function App() {
  const [materials, setMaterials] = useState<Record<string, any>[]>([]);
  const [metadata, setMetadata] = useState<MetadataField[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Record<string, any>[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [showId, setShowId] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Record<string, any> | null>(null);

  // Toggle function for showId
  function toggleId() {
    setShowId(!showId);
  }

  // Open the add form
  function handleAddNew() {
    setShowAddForm(true);
  }

  // Handle search input change
  function onSearchChange(search: string) {
    setSearchTerm(search);
    setSelectedRowIndex(null);
  }

  function handleEdit() {
    if (selectedRowIndex === null) {
        alert('Please select a row to edit.');
        return;
    }
    setEditData(materials[selectedRowIndex]);
    setIsEditing(true);
  }

  // Handle form submission for adding new data
  async function handleAddSubmit(newData: Record<string, any>) {
    try {
      // Send the new data to the backend
      const response = await fetch('http://localhost:3000/Materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
  
      if (response.ok) {
        const addedData = await response.json();
        setMaterials((prev) => [...prev, addedData]);
        setShowAddForm(false);
      } else {
        console.error('Failed to add new material.');
      }
    } catch (error) {
      console.error('Error adding material:', error);
    }
  }

    // Handle form submission
    async function handleEditSubmit(updatedData: Record<string, any>) {
      try {
          const response = await fetch(`http://localhost:3000/Materials/${updatedData.Id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedData),
          });

          if (response.ok) {
              const updatedMaterials = materials.map((item) =>
                  item.Id === updatedData.Id ? updatedData : item
              );
              setMaterials(updatedMaterials);
              setIsEditing(false);
              setEditData(null);
          } else {
              console.error('Failed to update material.');
          }
      } catch (error) {
          console.error('Error updating material:', error);
      }
  }

  // Handling data deletion
  async function handleDelete() {
    if (selectedRowIndex === null) {
        alert('Please select a row to delete.');
        return;
    }

    const selectedMaterial = materials[selectedRowIndex]; // Get the selected material
    const materialId = selectedMaterial.Id;

    try {
        const response = await fetch(`http://localhost:3000/Materials/${materialId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Update the materials state after successful deletion
            const updatedMaterials = materials.filter((_, index) => index !== selectedRowIndex);
            setMaterials(updatedMaterials);
            setSelectedRowIndex(null); // Clear selection
            alert('Material deleted successfully.');
        } else {
            const error = await response.json();
            console.error('Error deleting material:', error);
            alert(error.error || 'Failed to delete material.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the material.');
    }
  }

  // Fetch data from the backend
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch('http://localhost:3000/Materials');
        const data = await response.json();
        setMaterials(data);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchMaterials();
  }, []);

  // Fetch metadata data schema from backend, used for making dynamic forms
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('http://localhost:3000/Fields/Materials');
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchMetadata();
  }, []);

  // To clear highlighted row index when clicking anything outside the table
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        const tableElement = document.querySelector('.materials-table');
        if (tableElement && !tableElement.contains(event.target as Node)) {
            setSelectedRowIndex(null); // Clear the selected row index
        }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
        document.removeEventListener('click', handleClickOutside); // Cleanup on unmount
    };
}, []);

  // Debounce the search term
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm); // Update debounced search term after delay
    }, 500);

    return () => {
      clearTimeout(timeoutId); // Clear timeout if searchTerm changes before delay
    };
  }, [searchTerm]);

  // Filter data based on debounced search term
  useEffect(() => {
    if (debouncedSearchTerm.trim() === '') {
      setFilteredMaterials(materials); // No search term, show all data
    } else {
      const lowercasedSearchTerm = debouncedSearchTerm.toLowerCase();
      const filtered = materials.filter((item) =>
        Object.values(item)
          .some((val) => val != null && val.toString().toLowerCase().includes(lowercasedSearchTerm))
      );
      setFilteredMaterials(filtered); // Set filtered data
    }
  }, [debouncedSearchTerm, materials]);

  return (
    <>
      <Header 
        showId={showId}
        searchTerm={searchTerm} 
        onSearchChange={onSearchChange} 
        toggleId={toggleId} 
        onAdd={handleAddNew}
        onEdit={handleEdit} 
        onDelete={handleDelete}
      />
      {showAddForm && (
        <AddForm 
          metadata={metadata} 
          onSubmit={handleAddSubmit} 
          onCancel={() => setShowAddForm(false)}
        />
      )}
      {isEditing && editData && (
        <EditForm
            data={editData}
            metadata={metadata}
            onSubmit={handleEditSubmit}
            onCancel={() => {
                setIsEditing(false);
                setEditData(null);
            }}
        />
      )}
      <MaterialsTable 
        data={filteredMaterials} 
        showId={showId} 
        selectedRowIndex={selectedRowIndex}
        onRowClick={setSelectedRowIndex}
      />
    </>
  );
}

export default App;