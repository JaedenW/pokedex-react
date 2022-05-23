import React from 'react';
import {
	Nav,
	Navbar,
	Container,
	Form,
	Button,
	FormControl,
} from 'react-bootstrap';

function Navigation(props) {
	const { search, setSearch } = props;

	function handleSearch(event) {
		setSearch(event.target.value);
	}

	return (
		<Navbar bg="light" expand="lg">
			<Container fluid>
				<Navbar.Brand href="#">Pokedex</Navbar.Brand>
				<Nav
					className="me-auto my-2 my-lg-0"
					style={{ maxHeight: '120px' }}
					navbarScroll
				></Nav>
				<Form className="d-flex">
					<FormControl
						onChange={handleSearch}
						size="md"
						type="search"
						placeholder="Search"
						className="me-2"
						aria-label="Search"
					/>
				</Form>
			</Container>
		</Navbar>
	);
}

export default Navigation;
