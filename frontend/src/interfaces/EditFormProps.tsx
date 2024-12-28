export interface EditFormProps {
    data: Record<string, any>;
    metadata: { COLUMN_NAME: string; DATA_TYPE: string; IS_NULLABLE: string }[];
    onSubmit: (updatedData: Record<string, any>) => void;
    onCancel: () => void;
}