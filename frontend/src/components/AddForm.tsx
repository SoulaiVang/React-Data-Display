import { useState } from 'react';
import { AddFormProps } from '../interfaces/AddFormProps';

const AddForm = ({ metadata, onSubmit, onCancel }: AddFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform validation to check if required fields are filled
    const missingRequiredFields = metadata
      .filter((field) => field.IS_NULLABLE === 'NO' && !formData[field.COLUMN_NAME])
      .map((field) => field.COLUMN_NAME);

    if (missingRequiredFields.length > 0) {
      alert(`The following fields are required: ${missingRequiredFields.join(', ')}`);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="form-overlay">
      <form onSubmit={handleSubmit} className="form-container">
        <h2>Add New Material</h2>
        {metadata.map(({ COLUMN_NAME, DATA_TYPE, IS_NULLABLE }) => {
          if (COLUMN_NAME === 'Id') {
            return null; // Skip the ID field
          }

          // Determine input type based on DATA_TYPE
          let inputType = 'text';
          if (DATA_TYPE === 'int') {
            inputType = 'number';
          }

          // Required flag
          const isRequired = IS_NULLABLE === 'NO';

          return (
            <div key={COLUMN_NAME} className="form-row">
              <label>
                {isRequired ? "* " + COLUMN_NAME : COLUMN_NAME}:
                <input
                  type={inputType}
                  name={COLUMN_NAME}
                  value={formData[COLUMN_NAME] || ''}
                  onChange={handleChange}
                  required={isRequired}
                />
              </label>
            </div>
          );
        })}
        <span>* indicates a required field</span>
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

export default AddForm;