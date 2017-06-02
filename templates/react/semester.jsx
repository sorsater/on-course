// The selected semester
class Semester extends React.Component {
  onChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <select className="form-control" onChange={ this.onChange.bind(this) }>
        <option name="Alla">Alla</option>
        <option name="7">7</option>
        <option name="8">8</option>
        <option name="9">9</option>
      </select>
    )
  }
}