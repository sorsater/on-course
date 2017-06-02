// The class that loads all other components
class Loader extends React.Component {
  constructor(props){
    super(props);
    this.getFields = this.getFields.bind(this);
    this.getProfiles = this.getProfiles.bind(this);
    this.getSchedule = this.getSchedule.bind(this);
    this.getCourses = this.getCourses.bind(this);
    this.getProfileCourses = this.getProfileCourses.bind(this);
    this.onChange = this.onChange.bind(this);

    var cookiestring = RegExp("program[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    var program =  unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
    if(!program){
      program = 'Datateknik';
    }

    this.state = {
      fields: [],
      profiles: [],
      schedule: [],
      courses: [],
      profileCourses: [],
      program_name: program,
    }
  }

  onChange(event) {
    this.setState({program_name: event})
    this.getFields(event);
    this.getProfiles(event);
    this.getSchedule(event);
    this.getCourses(event);
    this.getProfileCourses(event);
    document.cookie = 'program=' + event;
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
          <CourseViewer
            loggedInCart={ this.props.loggedInCart }
            activeProgram={ this.state.program_name }
            onChange={ this.onChange }
            fields={ this.state.fields }
            courses={ this.state.courses }
            profiles={ this.state.profiles }
            schedule={ this.state.schedule }
            profileCourses= { this.state.profileCourses }
          />;
       </div>
     )
  }
}
