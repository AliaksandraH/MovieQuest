import Select from "react-dropdown-select";
import "./selectDropdown.scss";

const SelectDropdown = ({
    data,
    labelField,
    valueField,
    values,
    setValues,
}) => {
    const CustomContentRenderer = ({ props, state }) => {
        const selectedCount = state.values.length;
        const totalCount = props.options.length;

        return (
            <p>
                <span>
                    {selectedCount} of {totalCount} selected
                </span>
            </p>
        );
    };

    return (
        <Select
            options={data}
            onChange={(values) => {
                setValues(values.map((el) => el[valueField]));
            }}
            multi={true}
            className="select-dropdown"
            dropdownHeight="100px"
            color="#9f0013"
            clearable={true}
            labelField={labelField}
            valueField={valueField}
            contentRenderer={values.length > 5 ? CustomContentRenderer : false}
        />
    );
};

export default SelectDropdown;
