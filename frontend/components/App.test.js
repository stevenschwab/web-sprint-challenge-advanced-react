import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import AppFunctional from "./AppFunctional"
import server from './backend/mock-server'
import '@testing-library/jest-dom'

let up, down, left, right, reset, submit
let squares, coordinates, steps, message, email 

test('sanity', () => {
  screen.debug()
  expect(true).toBe(false)
})
