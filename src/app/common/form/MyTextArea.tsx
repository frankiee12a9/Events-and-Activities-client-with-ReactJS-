import { useField } from "formik"
import React from "react"
import { Form, Label } from "semantic-ui-react"

// custom reusable form field validation
interface Props {
	placeholder: string
	rows: number
	name: string
	label?: string
}

export default function MyTextArea(props: Props) {
	const [field, meta] = useField(props.name) // useField()

	return (
		<Form.Field error={meta.touched && !!meta.error}>
			<label>{props.label}</label>
			<textarea {...field} {...props} />
			{/* error label */}
			{meta.touched && meta.error ? (
				<Label basic color="red">
					{meta.error}
				</Label>
			) : null}
		</Form.Field>
	)
}
