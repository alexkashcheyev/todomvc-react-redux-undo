import { connect } from 'react-redux'
import Header from '../components/Header'
import { addTodo, undo, redo } from '../actions'

export default connect(null, { addTodo, undo, redo })(Header)
