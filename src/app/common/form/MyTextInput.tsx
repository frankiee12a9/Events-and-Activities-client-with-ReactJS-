import { useField } from "formik"
import React from "react"
import { Form, Label } from "semantic-ui-react"

// custom reusable form field validation
interface Props {
	placeholder?: string
	type? : string 
	name: string
	label?: string
}

export default function MyTextInput(props: Props) {
	const [field, meta] = useField(props.name) // useField()
	return (
		<Form.Field>
			<label>{props.label}</label>
			<input {...field} {...props} />
			{meta.touched && meta.error ? (
				<Label basic color="red">
					{meta.error}
				</Label>
			) : null}
		</Form.Field>
	)
}
