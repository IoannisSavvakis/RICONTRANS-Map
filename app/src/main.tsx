import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';


const appTheme = createTheme({
	palette: {
		primary: {
			main: "#FEFEFA",
		},
		secondary: {
			main: "#F2F3F4",
		},
	},

	typography: {
		h1: {
			fontSize: "1.5rem",
			fontWeight: 600,
		},
		h2: {
			fontSize: "1.1rem",
			fontWeight: 400,
		},
		h3: {
			fontSize: "0.9rem",
			fontWeight: 400,
		},
	},
})


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ThemeProvider theme={appTheme}>
			<App />
		</ThemeProvider>
	</React.StrictMode>,
)
