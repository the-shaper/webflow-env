//import Pikaday from 'pikaday'
import initializeCalculator from './features/calculator'
import initializeFormLogic from './features/formLogic'
import initializeRadioButtons from './features/radiobutts'
import './styles/style.css'
import 'pikaday/css/pikaday.css'

const calculator = initializeCalculator()
initializeFormLogic(calculator)
initializeRadioButtons()
