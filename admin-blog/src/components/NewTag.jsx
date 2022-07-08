import {
  MinusCircleOutlined,
  PlusOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { useMediaQuery } from "react-responsive";
import style from "../css/NewItem.module.css";

function NewTag() {
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
      <TagOutlined className={style["font-item-outlined"]} />

      <Form name="dynamic_form_item" onFinish={onFinish} autoComplete="off">
        <Space
          style={
            isTabletOrMobile ? mobileSpaceStyleShift : desktopSpaceStyleShift
          }
          align="baseline"
        >
          <Form.Item
            name={["tag"]}
            label={isTabletOrMobile ? null : "标签名"}
            rules={[{ required: true, message: "请输入tag" }]}
          >
            <Input
              placeholder="标签名"
              allowClear
              className={style["input-box"]}
            />
          </Form.Item>
        </Space>
        <Form.List name="tags">
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
                    name={[name, "tag"]}
                    label={isTabletOrMobile ? null : "标签名"}
                    rules={[{ required: true, message: "请输入tag" }]}
                  >
                    <Input
                      placeholder="标签名"
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
                  添加新标签
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

export default NewTag;
