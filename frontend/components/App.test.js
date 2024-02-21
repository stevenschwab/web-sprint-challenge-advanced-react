import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import AppFunctional from "./AppFunctional"
import server from '../../backend/mock-server'
import '@testing-library/jest-dom/extend-expect'

jest.setTimeout(1000)
const waitForOptions = { timeout: 100 }
const queryOptions = { exact: false }

let up, down, left, right, reset, submit
let coordinates, steps, message, email

const updateStatelessSelectors = document => {
  up = document.querySelector('#up')
  down = document.querySelector('#down')
  left = document.querySelector('#left')
  right = document.querySelector('#right')
  reset = document.querySelector('#reset')
  submit = document.querySelector('#submit')
}

const updateStatefulSelectors = document => {
  coordinates = document.querySelector('#coordinates')
  steps = document.querySelector('#steps')
  message = document.querySelector('#message')
  email = document.querySelector('#email')
}

[AppFunctional].forEach((Component, idx) => {
  const label = idx === 0 ? 'FUNCTIONAL' : 'CLASS-BASED'
  
  describe(`${label}`, () => {
    beforeAll(() => { server.listen() })
    afterAll(() => { server.close() })
    beforeEach(() => {
      render(<Component />)
      updateStatelessSelectors(document)
      updateStatefulSelectors(document)
    })
    afterEach(() => {
      server.resetHandlers()
      document.body.innerHTML = ''
    })

    describe('AppFunctional Component', () => {
      test(`[1] Correct coordinates for initial state
          Coordinates should be (2,2)`, () => {
        expect(coordinates.textContent).toMatch(/\(2.*2\)$/)
      })
      test(`[2] Actions: up, left, down, right
          The steps should be 4`, async () => {
        fireEvent.click(up)
        fireEvent.click(left)
        fireEvent.click(down)
        fireEvent.click(right)
        await screen.findByText('You moved 4 times', queryOptions, waitForOptions)
      })
      test(`[3] Actions: left, left
          The message of 'You can't go left' is displayed`, () => {
        fireEvent.click(left)
        fireEvent.click(left)
        expect(message.textContent).toBe("You can't go left")
      })
      test('[4] Buttons and links render with the correct text', () => {
        expect(up.textContent).toBe("UP")
        expect(down.textContent).toBe("DOWN")
        expect(left.textContent).toBe("LEFT")
        expect(right.textContent).toBe("RIGHT")
        expect(reset.textContent).toBe("reset")
        const submitButton = screen.getByTestId('submit-button')
        expect(submitButton).toBeInTheDocument()
      })
      test('[5] Actions: type email and state value updates', () => {
        fireEvent.change(email, { target: { value: 'lady@gaga.com' } })
        expect(email).toHaveValue('lady@gaga.com')
      })
    })
  })
})