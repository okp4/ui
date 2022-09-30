import { List as ImmutableList, OrderedMap } from 'immutable'
import type { StepId, StepStatus } from 'ui/index'
import type { InitializerArgs, InitialStepStatus, StepperAction, StepperState } from './useStepper'
import { useStepper } from './useStepper'
import { act } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'

type Data = {
  initialCurrentStepId: string
  initialStepsStatus: InitialStepStatus[]
  action: StepperAction
  expectedState: StepperState
}

describe('Considering the useStepper hook', () => {
  const emptyState: StepperState = {
    currentStepId: '',
    stepsStatus: OrderedMap(),
    enabledSteps: ImmutableList()
  }

  const initialStepsStatus1: InitialStepStatus[] = [
    { id: 'step1' },
    { id: 'step2' },
    { id: 'step3' }
  ]

  const expectedState1WhenInvalidAction: StepperState = {
    currentStepId: 'step1',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'uncompleted')
      .set('step2', 'uncompleted')
      .set('step3', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3'])
  }

  const expectedState1WhenStepCompleted: StepperState = {
    currentStepId: 'step2',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'completed')
      .set('step2', 'uncompleted')
      .set('step3', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3'])
  }

  const expectedState1WhenStepFailed: StepperState = {
    currentStepId: 'step1',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'invalid')
      .set('step2', 'uncompleted')
      .set('step3', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3'])
  }

  const initialStepsStatus2: InitialStepStatus[] = [
    { id: 'firstStep', status: 'completed' },
    { id: 'secondStep', status: 'uncompleted' },
    { id: 'thirdStep', status: 'disabled' },
    { id: 'fourthStep', status: 'uncompleted' }
  ]

  const expectedState2WhenPreviousClicked: StepperState = {
    currentStepId: 'firstStep',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'completed')
      .set('secondStep', 'uncompleted')
      .set('thirdStep', 'disabled')
      .set('fourthStep', 'uncompleted'),
    enabledSteps: ImmutableList(['firstStep', 'secondStep', 'fourthStep'])
  }

  const expectedState2WhenStepCompleted: StepperState = {
    currentStepId: 'fourthStep',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'completed')
      .set('secondStep', 'completed')
      .set('thirdStep', 'disabled')
      .set('fourthStep', 'uncompleted'),
    enabledSteps: ImmutableList(['firstStep', 'secondStep', 'fourthStep'])
  }

  const initialStepsStatus3: InitialStepStatus[] = [
    { id: 'firstStep', status: 'disabled' },
    { id: 'secondStep', status: 'uncompleted' },
    { id: 'thirdStep', status: 'uncompleted' },
    { id: 'fourthStep', status: 'uncompleted' },
    { id: 'fifthStep', status: 'disabled' }
  ]

  const expectedState3WhenPreviousClicked: StepperState = {
    currentStepId: 'secondStep',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'disabled')
      .set('secondStep', 'uncompleted')
      .set('thirdStep', 'uncompleted')
      .set('fourthStep', 'uncompleted')
      .set('fifthStep', 'disabled'),
    enabledSteps: ImmutableList(['secondStep', 'thirdStep', 'fourthStep'])
  }

  const expectedState3WhenStepCompleted: StepperState = {
    currentStepId: 'fourthStep',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('firstStep', 'disabled')
      .set('secondStep', 'uncompleted')
      .set('thirdStep', 'completed')
      .set('fourthStep', 'uncompleted')
      .set('fifthStep', 'disabled'),
    enabledSteps: ImmutableList(['secondStep', 'thirdStep', 'fourthStep'])
  }

  const initialStepsStatus4: InitialStepStatus[] = [
    { id: 'step1', status: 'completed' },
    { id: 'step2', status: 'completed' },
    { id: 'step3', status: 'uncompleted' }
  ]

  const expectedState4WhenStepperSubmitted: StepperState = {
    currentStepId: 'step3',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'completed')
      .set('step2', 'completed')
      .set('step3', 'completed'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3'])
  }

  const initialStepsStatus4ForReset: InitializerArgs = {
    initialCurrentStepId: 'step1',
    initialStepsStatus: [
      { id: 'step1', status: 'uncompleted' },
      { id: 'step2', status: 'uncompleted' },
      { id: 'step3', status: 'uncompleted' }
    ]
  }

  const expectedState4WhenStepperReset: StepperState = {
    currentStepId: 'step1',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'uncompleted')
      .set('step2', 'uncompleted')
      .set('step3', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3'])
  }

  const initialStepsStatus5: InitialStepStatus[] = [
    { id: 'step1', status: 'completed' },
    { id: 'step2', status: 'invalid' },
    { id: 'step3', status: 'uncompleted' }
  ]

  const expectedState5WhenPreviousClicked: StepperState = {
    currentStepId: 'step1',
    stepsStatus: OrderedMap<StepId, StepStatus>()
      .set('step1', 'completed')
      .set('step2', 'invalid')
      .set('step3', 'uncompleted'),
    enabledSteps: ImmutableList(['step1', 'step2', 'step3'])
  }

  describe.each`
    initialCurrentStepId | initialStepsStatus     | action                                                              | expectedState
    ${''}                | ${[]}                  | ${{ type: '' }}                                                     | ${emptyState}
    ${''}                | ${[]}                  | ${{ type: 'stepCompleted' }}                                        | ${emptyState}
    ${'step1'}           | ${initialStepsStatus1} | ${{ type: '' }}                                                     | ${expectedState1WhenInvalidAction}
    ${'step1'}           | ${initialStepsStatus1} | ${{ type: 'foo' }}                                                  | ${expectedState1WhenInvalidAction}
    ${'step1'}           | ${initialStepsStatus1} | ${{ type: 'stepCompleted' }}                                        | ${expectedState1WhenStepCompleted}
    ${'step1'}           | ${initialStepsStatus1} | ${{ type: 'stepFailed' }}                                           | ${expectedState1WhenStepFailed}
    ${'secondStep'}      | ${initialStepsStatus2} | ${{ type: 'previousClicked' }}                                      | ${expectedState2WhenPreviousClicked}
    ${'secondStep'}      | ${initialStepsStatus2} | ${{ type: 'stepCompleted' }}                                        | ${expectedState2WhenStepCompleted}
    ${'thirdStep'}       | ${initialStepsStatus3} | ${{ type: 'previousClicked' }}                                      | ${expectedState3WhenPreviousClicked}
    ${'thirdStep'}       | ${initialStepsStatus3} | ${{ type: 'stepCompleted' }}                                        | ${expectedState3WhenStepCompleted}
    ${'step3'}           | ${initialStepsStatus4} | ${{ type: 'stepperSubmitted' }}                                     | ${expectedState4WhenStepperSubmitted}
    ${'step3'}           | ${initialStepsStatus4} | ${{ type: 'stepperReseted', payload: initialStepsStatus4ForReset }} | ${expectedState4WhenStepperReset}
    ${'step2'}           | ${initialStepsStatus5} | ${{ type: 'previousClicked' }}                                      | ${expectedState5WhenPreviousClicked}
  `(
    'Given an initial current step id <$initialCurrentStepId> and an initial steps status array',
    ({ initialCurrentStepId, initialStepsStatus, action, expectedState }: Data) => {
      describe(`When dispatch the action of type ${action.type}`, () => {
        test(`Then, expect state to be ${JSON.stringify(expectedState)}`, () => {
          const { result } = renderHook(() => useStepper(initialCurrentStepId, initialStepsStatus))
          act(() => {
            result.current.dispatch(action)
          })
          expect(result.current.state).toStrictEqual(expectedState)
        })
      })
    }
  )
})
