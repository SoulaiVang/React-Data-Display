import { useState } from "react";

interface EditFormProps {
    data: Record<string, any>;
    onSubmit: (updatedData: Record<string, any>) => void;
    onCancel: () => void;
}

const EditForm = ({ data, onSubmit, onCancel }: EditFormProps) => {
    const [formData, setFormData] = useState(data);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSubmit(formData);
    }

    return (
        <div className="form-overlay">
            <form onSubmit={handleSubmit} className="form-container">
                <h2>Edit Material</h2>
                {Object.keys(data).map((key) => (
                    <div key={key} className="form-row">
                        <label>
                            {key}:
                            <input
                                type="text"
                                name={key}
                                value={formData[key] || ''}
                                onChange={handleChange}
                                disabled={key === 'Id'} // Prevent editing ID
                            />
                        </label>
                    </div>
                ))}
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
