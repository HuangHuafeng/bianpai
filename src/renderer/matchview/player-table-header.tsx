import * as React from 'react'
import { Manager } from '../manager'

interface IPlayerTableHeaderProps {
  readonly manager: Manager
}

interface IPlayerTableHeaderState {}

export class PlayerTableHeader extends React.Component<IPlayerTableHeaderProps, IPlayerTableHeaderState> {
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
