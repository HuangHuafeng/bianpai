import * as React from 'react'

interface IPlayerTableHeaderProps {}

interface IPlayerTableHeaderState {}

export class PlayerTableHeader extends React.PureComponent<IPlayerTableHeaderProps, IPlayerTableHeaderState> {
  constructor(props: IPlayerTableHeaderProps) {
    super(props)
  }

  public render() {
    return (
      <thead>
        <tr>
          <th>编号</th>
          <th>姓名</th>
          <th>单位</th>
          <th>操作</th>
        </tr>
      </thead>
    )
  }
}
