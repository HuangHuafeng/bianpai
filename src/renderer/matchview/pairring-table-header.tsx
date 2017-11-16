import * as React from 'react'

interface IPairringTableHeaderProps {
  readonly updatable?: boolean
}

interface IPairringTableHeaderState {}

export class PairringTableHeader extends React.PureComponent<IPairringTableHeaderProps, IPairringTableHeaderState> {
  constructor(props: IPairringTableHeaderProps) {
    super(props)
  }

  public render() {
    let operateColumn = null
    if (this.props.updatable) {
      operateColumn = <th>操作</th>
    }
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
          {operateColumn}
        </tr>
      </thead>
    )
  }
}
