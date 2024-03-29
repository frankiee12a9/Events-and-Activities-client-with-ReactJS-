import React from "react"
import { Button, Header, Icon, Segment } from "semantic-ui-react"
import { Link } from "react-router-dom"

export default function NotFound() {
	return (
		<Segment placeholder>
			<Header icon>
				<Icon name="search" />
				Opps-we've loooked everywhere and could not found this :(
			</Header>
			<Segment.Inline>
				<Button as={Link} to="/activities" primary>
					Return to activities page
				</Button>
			</Segment.Inline>
		</Segment>
	)
}
