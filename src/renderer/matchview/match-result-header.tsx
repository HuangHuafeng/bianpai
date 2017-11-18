import * as React from 'react'

interface IMatchResultHeaderProps {}

interface IMatchResultHeaderState {}

export class MatchResultHeader extends React.PureComponent<IMatchResultHeaderProps, IMatchResultHeaderState> {
  constructor(props: IMatchResultHeaderProps) {
    super(props)
  }

  public render() {
    return (
      <thead>
        <tr>
          <th>名次</th>
          <th>编号</th>
          <th>姓名</th>
          <th>单位</th>
          <th>总分</th>
          <th>对手分</th>
          <th>胜</th>
          <th>和</th>
          <th>负</th>
          <th>先手数</th>
          <th>后手数</th>
        </tr>
      </thead>
    )
  }
}
