// One row for each Program
class ProgramRow extends React.Component {
  render() {
    var selected = this.props.active ? 'selected' : '';
    return (
      <option name={ this.props.name }>
        { this.props.name }
      </option>
    )
  }
}

class Program extends React.Component {
  constructor(props){
    super(props);
    this.getPrograms = this.getPrograms.bind(this);
    this.state = {
      programs: [],
    }
  }

  componentDidMount() {
    this.getPrograms();
  }

  onChange(event) {
    this.props.onChange(event.target.value);
  }

  getPrograms(){
    fetch('/_get_programs')
      .then(response => response.json())
      .then(json => {
        this.setState({
          programs: json
        });
      });
  }

  render() {
    var programList = [];
    this.state.programs.forEach(function(program) {
      programList.push(
        <ProgramRow
          key={ program }
          name={ program }
        />)
    });

    return (
      <select id="select-program" onChange={ this.onChange.bind(this) } value={this.props.active}>
        { programList }
      </select>
    )
  }
}