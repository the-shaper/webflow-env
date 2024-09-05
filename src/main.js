import initializeCalculator from './features/calculator'
import initializeFormLogic from './features/formLogic'
import initializeRadioButtons from './features/radiobutts'

const calculator = initializeCalculator()
initializeFormLogic(calculator)
initializeRadioButtons()
