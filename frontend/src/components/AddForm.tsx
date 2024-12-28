import { useState } from 'react';

interface AddNewFormProps {
  data: Record<string, any>[];
  onSubmit: (newData: Record<string, any>) => void;
  onCancel: () => void;
}

const AddNewForm = ({ data, onSubmit, onCancel }: AddNewFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const headers = Object.keys(data[0]); // To dynamically create field entries for the form

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-overlay">
      <form onSubmit={handleSubmit} className="form-container">
        <h2>Add New Material</h2>
        {headers.map((header) => {
              if (header === 'Id') {
                return null;
              }
              return <div key={header} className="form-row">
                      <label>
                          {header}:
                          <input
                              type="text"
                              name={header}
                              value={formData[header] || ''}
                              onChange={handleChange}
                          />
                      </label>
                    </div>
            })}
        <div className="form-actions">
          <button type="submit">Add</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewForm;