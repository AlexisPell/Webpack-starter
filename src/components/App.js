import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './../styles/main.scss'

const App = () => {
	return (
		<Router>
			<div className='app'>
				<h1>Webpack starter</h1>
			</div>
		</Router>
	)
}

export default App
