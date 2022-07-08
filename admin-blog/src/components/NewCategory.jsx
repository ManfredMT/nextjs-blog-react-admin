import {
  GroupOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { useMediaQuery } from "react-responsive";
import style from "../css/NewItem.module.css";

function NewCategory() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };
  const desktopSpaceStyle = {
    display: "flex",
    marginLeft: "0",
    justifyContent: "center",
  };
  const desktopSpaceStyleShift = {
    display: "flex",
    marginLeft: "-22px",
    justifyContent: "center",
  };
  const mobileSpaceStyleShift = {
    display: "flex",
    margin: "0",
    marginLeft: "0px",
    justifyContent: "center",
    width: "auto",
  };
  const mobileSpaceStyle = {
    display: "flex",
    margin: "0",
    justifyContent: "center",
    width: "auto",
  };

  return (
    <div className={style["new-item-box"]}>
      <GroupOutlined className={style["font-item-outlined"]} />

      <Form name="dynamic_form_item" onFinish={onFinish} autoComplete="off">
        <Space
          style={
            isTabletOrMobile ? mobileSpaceStyleShift : desktopSpaceStyleShift
          }
          align="baseline"
        >
          <Form.Item
            name={["category"]}
            label={isTabletOrMobile ? null : "类别名称"}
            rules={[{ required: true, message: "请输入类别名称" }]}
          >
            <Input
              placeholder="类别名称"
              allowClear
              className={style["input-box"]}
            />
          </Form.Item>
        </Space>
        <Form.List name="categories">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={
                    isTabletOrMobile ? mobileSpaceStyle : desktopSpaceStyle
                  }
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "category"]}
                    label={isTabletOrMobile ? null : "类别名称"}
                    rules={[{ required: true, message: "请输入类别名称" }]}
                  >
                    <Input
                      placeholder="类别名称"
                      allowClear
                      className={style["input-box"]}
                    />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item className={style["add-field-button"]}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  添加新类别
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item className={style["new-item-submit-button"]}>
          <Button type="primary" htmlType="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default NewCategory;
