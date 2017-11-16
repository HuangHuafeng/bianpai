import { ImmutableMatch } from '../common/immutable-match'
import { Player } from '../common/immutable-player'

export class MatchStore {
  match: ImmutableMatch

  constructor() {
    this.match = new ImmutableMatch()

    if (__DEV__) {
      this.setName('2017年全国象棋锦标赛(个人)')
      this.setOrganizer('国家体育总局棋牌运动管理中心、中国象棋协会')
      this.setTotalRounds(7)
      this.generateSomeDevPlayers()
    }
  }

  private generateSomeDevPlayers() {
    this.addPlayer('赵子雨', '湖北棋牌运动管理中心')
    this.addPlayer('崔革', '黑龙江省棋牌管理中心')
    this.addPlayer('鲁天', '江苏棋院')
    this.addPlayer('赵金成', '中国棋院杭州分院')
    this.addPlayer('孙昕昊', '浙江非奥项目管理中心')
    this.addPlayer('李冠男', '辽宁队')
    this.addPlayer('黄学谦', '香港')
    this.addPlayer('孙勇征', '上海金外滩队')
    this.addPlayer('何文哲', '中国棋院杭州分院')
    this.addPlayer('李炳贤', '中国棋院杭州分院')
    this.addPlayer('武俊强', '四川成都龙翔通讯队')
    this.addPlayer('于幼华', '浙江非奥项目管理中心	')
    this.addPlayer('程宇东', '广东碧桂园')
    this.addPlayer('黎德志', '煤矿体协')
  }

  public getMatch() {
    return this.match
  }

  public newMatch(name: string, totalRounds: number, organizer: string = '') {
    this.match = new ImmutableMatch()
    this.setName(name)
    this.setTotalRounds(totalRounds)
    this.setOrganizer(organizer)

    if (__DEV__) {
      this.generateSomeDevPlayers()
    }
  }

  public setName(name: string) {
    this.match = this.match.setName(name)
  }

  public setOrganizer(organizer: string) {
    this.match = this.match.setOrganizer(organizer)
  }

  public setTotalRounds(totalRounds: number) {
    this.match = this.match.setTotalRounds(totalRounds)
  }

  public addPlayer(name: string, organization: string = '') {
    this.match = this.match.addPlayer(name, organization)
  }

  public updatePlayer(number: number, player: Player) {
    this.match = this.match.updatePlayer(number, player)
  }

  public removePlayer(number: number) {
    this.match = this.match.removePlayer(number)
  }

  public removeAllPlayers() {
    this.match = this.match.removeAllPlayers()
  }

  public updateTableResult(round: number, table: number, result: string) {
    this.match = this.match.updateTableResult(round, table, result)
  }

  public startCurrentRound(currentRound: number) {
    this.match = this.match.startCurrentRound(currentRound)
  }

  public start() {
    this.match = this.match.start()
  }

  public endCurrentRound(currentRound: number) {
    this.match = this.match.endCurrentRound(currentRound)
  }
}
