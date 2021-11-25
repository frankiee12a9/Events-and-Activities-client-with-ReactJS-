import { observer } from "mobx-react-lite"
import React from "react"
import { Container, Header, Segment } from "semantic-ui-react"
import { useStore } from "../../app/stores/store"

// component does consume data from useStore => observer() is needed!
export default observer(function ServerError() {
	const { commonStore } = useStore()

	return (
		<Container>
			<Header as="h1" content="Server error" />
			<Header as="h5" color="red" sub content={commonStore.error?.message} />
			{commonStore.error?.details && (
				<Segment>
					<Header as="h4" content="Stack trace" color="teal" />
					<code style={{ marginTop: "10px" }}>{commonStore.error.details}</code>
				</Segment>
			)}
		</Container>
	)
})
