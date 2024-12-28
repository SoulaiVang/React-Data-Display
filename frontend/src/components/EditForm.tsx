import { useState } from "react";
import { EditFormProps } from "../interfaces/EditFormProps";

const EditForm = ({ data, metadata, onSubmit, onCancel }: EditFormProps) => {
  const [formData, setFormData] = useState(data);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value}));
  }

  function handleSubmit(e: React.FormEvent) {
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
  }

return (
  <div className="form-overlay">
      <form onSubmit={handleSubmit} className="form-container">
          <h2>Edit Material</h2>
          {metadata.map(({ COLUMN_NAME, DATA_TYPE, IS_NULLABLE }) => {
          const isRequired = IS_NULLABLE === "NO";

          // Determine input type based on DATA_TYPE
          let inputType = 'text';
          if (DATA_TYPE === 'int') {
            inputType = 'number';
          }

          return (
            <div key={COLUMN_NAME} className="form-row">
              <label>
                {isRequired ? "* " + COLUMN_NAME : COLUMN_NAME}:
                <input
                  type={inputType}
                  name={COLUMN_NAME}
                  value={formData[COLUMN_NAME] ?? ""}
                  onChange={handleChange}
                  disabled={COLUMN_NAME === "Id"} // Prevent editing ID
                  required={isRequired} // Add required attribute if the field is not nullable
                />
              </label>
            </div>
          );
        })}
            <span>* indicates a required field</span>
            <div className="form-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={onCancel}>
                Cancel
              </button>
          </div>
      </form>
    </div>
  );
};

export default EditForm;
