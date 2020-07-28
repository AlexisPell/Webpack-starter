import React from 'react'
import { render } from 'react-dom'
import './styles/main.scss'

// Files
// import WebpackLogo from '@/assets/webpack-logo.png'

// Components
import Logo from './components/Logo'

const App = () => {
	return (
		<div className='container'>
			<h1>Webpack starter</h1>
			<hr />
			<Logo />
		</div>
	)
}

render(<App />, document.getElementById('root'))
