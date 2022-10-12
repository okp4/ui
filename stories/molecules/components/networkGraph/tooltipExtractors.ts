import type { Node } from 'ngraph.graph'
import type { DeepReadonly } from 'superTypes'
import type { TooltipExtractor } from 'ui/molecules/networkGraph/ecs/system/nodeTooltipSystem'
import type { EvmosValidator, FamilyTreeObject } from './meshFactory'
import femaleIcon from '../../../assets/female.svg'
import maleIcon from '../../../assets/male.svg'

export const familyTreeTooltipExtractor: TooltipExtractor<FamilyTreeObject> = (
  node: DeepReadonly<Node<FamilyTreeObject>>
) => {
  const tooltip = document.createElement('div')
  const ImgHTML = document.createElement('img')
  const title = document.createElement('h3')
  const datesWrapper = document.createElement('div')
  const dateBirth = document.createElement('p')
  const dateDeath = document.createElement('p')
  const { name, gender, dateOfBirth, dateOfDeath, portrait }: FamilyTreeObject = node.data

  const formatDate = (dateString: string): string => {
    const [day, month, year]: string[] = dateString.split('/')
    const date = new Date(`${year}-${month}-${day}`)
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  tooltip.classList.add('networkgraph-story-tooltip')
  datesWrapper.classList.add('networkgraph-story-dates-wrapper')
  ImgHTML.classList.add('networkgraph-story-portrait')

  ImgHTML.src = portrait !== '' ? portrait : gender === 'male' ? maleIcon : femaleIcon

  title.innerText = name
  dateBirth.innerText = `👼 - ${formatDate(dateOfBirth)}`
  dateDeath.innerText = `💀 - ${formatDate(dateOfDeath)}`

  datesWrapper.append(dateBirth, dateDeath)
  tooltip.append(ImgHTML, title, datesWrapper)

  return tooltip
}

export const validatorTooltipExtractor: TooltipExtractor<EvmosValidator> = (
  node: DeepReadonly<Node<EvmosValidator>>
) => {
  const tooltip = document.createElement('div')
  const pAddress = document.createElement('p')
  const pVotingPower = document.createElement('p')
  const pPercentVotingPower = document.createElement('p')
  const { address, voting_power, percentVotingPower }: EvmosValidator = node.data
  const formattedPercent =
    percentVotingPower.toFixed(2) === '0.00' ? `> 00.1%` : `${percentVotingPower.toFixed(2)}%`

  tooltip.classList.add('networkgraph-story-tooltip')

  pAddress.innerText = `Validator address: ${address}`
  pVotingPower.innerText = `Voting power: ${voting_power}`
  pPercentVotingPower.innerText = `Voting power in percent: ${formattedPercent}`

  tooltip.append(pAddress, pVotingPower, pPercentVotingPower)
  return tooltip
}
