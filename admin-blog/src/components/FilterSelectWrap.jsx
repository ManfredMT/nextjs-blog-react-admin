import { Select } from "antd";
import { useMediaQuery } from "react-responsive";
const { Option } = Select;

function FilterSelectWrap({
  label,
  placeholder,
  onChange,
  selectClass,
  selectValue,
  allItems,
}) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  return (
    <>
      <span>{`${label} : `}</span>
      <Select
        showSearch={!isTabletOrMobile}
        placeholder={placeholder}
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        className={selectClass}
        value={selectValue}
      >
        {allItems.map((item) => {
          return (
            <Option key={item} value={item}>
              {item}
            </Option>
          );
        })}
      </Select>
    </>
  );
}

export default FilterSelectWrap;
