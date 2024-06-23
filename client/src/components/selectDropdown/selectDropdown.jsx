import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-dropdown-select";
import "./selectDropdown.scss";

const SelectDropdown = ({
    data,
    labelField,
    valueField,
    values,
    setValues,
}) => {
    const [defaultValues, setDefaultValues] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const mappedValues = data.filter((option) =>
            values.includes(option[valueField])
        );
        setDefaultValues(mappedValues);
    }, [data, values, valueField]);

    const CustomContentRenderer = ({ props, state }) => {
        const selectedCount = state.values.length;
        const totalCount = props.options.length;

        return (
            <p>
                <span>
                    {selectedCount} {t("of")} {totalCount} {t("selected")}
                </span>
            </p>
        );
    };

    return (
        <Select
            options={data}
            values={defaultValues}
            onChange={(values) => {
                setValues(values.map((el) => el[valueField]));
            }}
            multi={true}
            className="select-dropdown"
            dropdownHeight="150px"
            color="#9f0013"
            clearable={true}
            labelField={labelField}
            valueField={valueField}
            searchBy={labelField}
            contentRenderer={values.length > 5 ? CustomContentRenderer : false}
            placeholder={`${t("select")}...`}
        />
    );
};

export default SelectDropdown;
