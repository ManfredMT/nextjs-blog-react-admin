import { Form, Input, InputNumber, Table } from "antd";

function EditableTable({
  form,
  data,
  columns,
  editingKey,
  setEditingKey,
  tableClass,
  tableRowClass,
}) {
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `请输入${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const isEditing = (record) => record.key === editingKey;
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "postNumber" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const cancel = () => {
    setEditingKey("");
  };
  return (
    <Form form={form} component={false}>
      <Table
        className={tableClass}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        dataSource={data}
        columns={mergedColumns}
        rowClassName={tableRowClass}
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
}

export default EditableTable;
