// The selected level
class Level extends React.Component {
  onChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <select onChange={ this.onChange.bind(this) }>
        <option name="Alla">Alla</option>
        <option name="G1">G1</option>
        <option name="G2">G2</option>
        <option name="A">A</option>
      </select>
    )
  }
}