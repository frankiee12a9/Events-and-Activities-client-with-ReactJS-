import { useField } from "formik";
import React from "react";
import { Form, Label, Select } from "semantic-ui-react";

// custom reusable form field validation
interface Props {
  placeholder: string;
  options: any;
  name: string;
  label?: string;
}

export default function MyTextSelectInput(props: Props) {
  const [field, meta, helpers] = useField(props.name); // useField()

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <Select
        clearable
        options={props.options}
        value={field.value || null}
        placeholder={props.placeholder}
        onChange={(e, d) => helpers.setValue(d.value)} // onChange
        onBlur={() => helpers.setTouched(true)} // use onBlur effect
      />
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}
