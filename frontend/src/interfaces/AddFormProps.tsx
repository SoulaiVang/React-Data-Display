export interface AddFormProps {
    metadata: {COLUMN_NAME: string; DATA_TYPE: string; IS_NULLABLE: string}[];
    onSubmit: (newData: Record<string, any>) => void;
    onCancel: () => void;
}