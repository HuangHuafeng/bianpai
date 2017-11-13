import * as React from 'react'
import { Manager } from '../manager'

interface IPairringTableHeaderProps {
  readonly manager: Manager
}

interface IPairringTableHeaderState {}

export class PairringTableHeader extends React.Component<IPairringTableHeaderProps, IPairringTableHeaderState> {
  constructor(props: IPairringTableHeaderProps) {
    super(props)
  }

  public render() {
    return (
      <thead>
        <tr>
          <th>台号</th>
          <th>编号</th>
          <th>红方单位</th>
          <th>积分</th>
          <th>红方姓名</th>
          <th>结果</th>
          <th>黑方姓名</th>
          <th>积分</th>
          <th>黑方单位</th>
          <th>编号</th>
        </tr>
      </thead>
    )
  }
}
