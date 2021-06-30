import React from 'react'
import { createRenderer } from 'react-test-renderer/shallow';
import Header from './Header'
import TodoTextInput from '../components/TodoTextInput'

const setup = () => {
  const props = {
    addTodo: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn()
  }

  const renderer = createRenderer();
  renderer.render(<Header {...props} />)
  const output = renderer.getRenderOutput()

  return {
    props: props,
    output: output,
    renderer: renderer
  }
}

describe('components', () => {
  describe('Header', () => {
    it('should render correctly', () => {
      const { output } = setup()
      expect(output.type).toBe('header')
      expect(output.props.className).toBe('header')

      const [ h1, input ] = output.props.children
      expect(h1.type).toBe('h1')
      expect(h1.props.children).toBe('todos')
      expect(input.type).toBe(TodoTextInput)
      expect(input.props.newTodo).toBe(true)
      expect(input.props.placeholder).toBe('What needs to be done?')
    })

    it('should call addTodo if length of text is greater than 0', () => {
      const { output, props } = setup()
      const input = output.props.children[1]
      input.props.onSave('')
      expect(props.addTodo).not.toBeCalled()
      input.props.onSave('Use Redux')
      expect(props.addTodo).toBeCalled()
    })

    it('should call undo on click on undo button', () => {
      const { output, props } = setup()
      const [ , , container ] = output.props.children
      const [ undo ] = container.props.children

      undo.props.onClick()

      expect(props.undo).toBeCalled()
    })

    it('should call redo on click on redo button', () => {
      const { output, props } = setup()
      const [ , , container ] = output.props.children
      const [ , redo ] = container.props.children

      redo.props.onClick()

      expect(props.redo).toBeCalled()
    })
  })
})
