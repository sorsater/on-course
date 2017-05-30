class ProgramRow extends React.Component {

  render() {
    return (
      <option name={this.props.name}>
        { this.props.name }
      </option>)
  }
}

class Program extends React.Component {
  constructor(props){
    super(props)
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
    var tom = [];
    this.state.programs.forEach(function(program) {
      tom.push(<ProgramRow key={program} name={program} />)
    })
    return (
      <select id="select-program" onChange={ this.onChange.bind(this) }>
        { tom }
      </select>
    )
  }
}


class Loader extends React.Component {

  constructor(props){
    super(props)
    this.getFields = this.getFields.bind(this);
    this.getProfiles = this.getProfiles.bind(this);
    this.getSchedule = this.getSchedule.bind(this);
    this.getCourses = this.getCourses.bind(this);
    this.getProfileCourses = this.getProfileCourses.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      fields: [],
      profiles: [],
      schedule: [],
      courses: [],
      profileCourses: [],
      program_name: 'Maskinteknik',
    }

  }

  onChange(event) {
    this.setState({program_name: event})
    this.getFields(event);
    this.getProfiles(event);
    this.getSchedule(event);
    this.getCourses(event);
    this.getProfileCourses(event);
  }

  componentDidMount() {
    this.getFields(this.state.program_name);
    this.getProfiles(this.state.program_name);
    this.getSchedule(this.state.program_name);
    this.getCourses(this.state.program_name);
    this.getProfileCourses(this.state.program_name);
  }

  getFields(program){
    fetch('/_get_fields?program=' + program)
      .then(response => response.json())
      .then(json => {
        this.setState({
          fields: json
        });
      });
  }

  getProfiles(program){
    fetch('/_get_profiles?program=' + program)
      .then(response => response.json())
      .then(json => {
        this.setState({
          profiles: json
        });
      });
  }

  getSchedule(program){
    fetch('/_get_schedule')
      .then(response => response.json())
      .then(json => {
        this.setState({
          schedule: json
        });
      });
  }

  getCourses(program){
    fetch('/_get_courses?program=' + program)
      .then(response => response.json())
      .then(json => {
        this.setState({
          courses: json
        });
      });
  }

  getProfileCourses(program){
    fetch('/_get_profile_courses?program=' + program)
      .then(response => response.json())
      .then(json => {
        this.setState({
          profileCourses: json
        });
      });
  }

  render() {
      return (
        <div>
          <Program onChange={this.onChange}/>
            <CourseViewer
                   fields={ this.state.fields }
                   courses={ this.state.courses }
                   profiles={ this.state.profiles }
                   schedule={ this.state.schedule }
                   profileCourses= { this.state.profileCourses}
                 />;
       </div>
     )
  }
}
