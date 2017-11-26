import * as React from 'react'
import { Button } from 'react-bootstrap'
import * as assert from 'assert'
import { Manager } from '../manager'
import { ImmutableMatch, MatchStatus, RoundStatus } from '../../common/immutable-match'
import { Round } from '../../common/immutable-round'
import { PairringTable } from './pairring-table'
import { FightingTable } from './fighting-table'
import { FinishedTable } from './finished-table'

interface IRoundViewProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
  readonly round: number
}

interface IRoundViewState {
  roundData: Round
}

export class RoundView extends React.PureComponent<IRoundViewProps, IRoundViewState> {
  constructor(props: IRoundViewProps) {
    super(props)
  }

  /*
  public componentWillReceiveProps(nextProps: IRoundViewProps) {
    if (this.props.match.equals(nextProps.match) === false) {
      const roundDataInMatch: Round = nextProps.match.getRoundData(this.props.round)
      this.setState({ roundData: roundDataInMatch })
    }
  }

  public shouldComponentUpdate(nextProps: IRoundViewProps, nextState: IRoundViewState, nextContext: any): boolean {
    if (
      nextProps.match !== this.props.match ||
      nextProps.round !== this.props.round ||
      nextProps.manager !== this.props.manager
    ) {
      return true
    }

    if (nextState.roundData !== undefined) {
      return true
    }

    return false
  }
  */

  public render() {
    const roundStatus = this.props.match.getRoundStatus(this.props.round)
    const roundData: Round = this.props.match.getRoundData(this.props.round)
    let status: string
    let actions = []
    let data
    switch (roundStatus) {
      case RoundStatus.NotStarted:
        status = '本轮比赛还没有开始'
        break

      case RoundStatus.OnGoingPairing:
        status = '本轮比赛正在安排对阵表'
        actions.push(
          <Button bsStyle="danger" onClick={this.startRound} key="end-pairing">
            对阵安排完成，开始本轮比赛
          </Button>
        )
        actions.push(
          <Button bsStyle="primary" onClick={this.restorePairing} key="restore-pairing">
            恢复为软件安排的对阵
          </Button>
        )
        data = (
          <PairringTable
            manager={this.props.manager}
            roundData={roundData}
            playerList={this.props.match.playerList}
            changePlayerCallback={this.onExchangePlayerInGame}
          />
        )
        break

      case RoundStatus.OnGoingFighting:
        status = '本轮比赛正在进行，请在下方录入每一台的结果'
        const disabled = roundData.canEnd() === false
        actions.push(
          <Button bsStyle="primary" onClick={this.printPairingToPDF} key="pairing">
            打印对阵表
          </Button>
        )
        actions.push(
          <Button bsStyle="danger" onClick={this.endCurrentRound} disabled={disabled} key="end-fighting">
            结束本轮比赛
          </Button>
        )
        data = <FightingTable roundData={roundData} updateCallback={this.updateTableResult} />
        break

      case RoundStatus.Finished:
        status = '本轮比赛已经结束'
        actions.push(
          <Button bsStyle="primary" onClick={this.printPairingToPDF} key="pairing">
            打印对阵表
          </Button>
        )
        actions.push(
          <Button bsStyle="primary" onClick={this.printResultToPDF} key="result">
            打印结果
          </Button>
        )
        data = <FinishedTable roundData={roundData} />
        break

      default:
        throw new Error('IMPOSSIBLE! unknown round status.')
    }

    return (
      <div id="round-view">
        <div id="round-status-and-actions">
          <p>
            {status}
            <br />
            {actions}
          </p>
        </div>
        {data}
      </div>
    )
  }

  private updateTableResult = (table: number, result: string) => {
    this.props.manager.updateTableResult(this.props.match.currentRound, table, result)
  }

  private onExchangePlayerInGame = (table: number, currentPlayerNumber: number, withPlayerNumber: number) => {
    this.props.manager.changePlayerInGame(table, currentPlayerNumber, withPlayerNumber)
  }

  private printResultToPDF = () => {
    this.props.manager.print({ type: 'round-result', round: this.props.round })
  }

  private printPairingToPDF = () => {
    this.props.manager.print({ type: 'round-pairing', round: this.props.round })
  }

  private restorePairing = () => {
    this.props.manager.resetPairing()
  }

  private startRound = () => {
    this.props.manager.startCurrentRound(this.props.round)
  }

  private endCurrentRound = () => {
    this.props.manager.endCurrentRound()
  }
}
