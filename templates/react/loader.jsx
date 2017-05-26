class Loader extends React.Component {

  constructor(props){
    super(props)
    this.getFields = this.getFields.bind(this);
    this.getProfiles = this.getProfiles.bind(this);
    this.getSchedule = this.getSchedule.bind(this);
    this.getCourses = this.getCourses.bind(this);
    this.getProfileCourses = this.getProfileCourses.bind(this);
    this.state = {
      fields: [],
      profiles: [],
      schedule: [],
      courses: [],
      profileCourses: [],
    }

  }

  componentDidMount() {
    this.getFields();
    this.getProfiles();
    this.getSchedule();
    this.getCourses();
    this.getProfileCourses();
  }

  getFields(){
    fetch('/_get_fields?program=Datateknik')
      .then(response => response.json())
      .then(json => {
        this.setState({
          fields: json
        });
      });
  }

  getProfiles(){
    fetch('/_get_profiles?program=Datateknik')
      .then(response => response.json())
      .then(json => {
        this.setState({
          profiles: json
        });
      });
  }

  getSchedule(){
    fetch('/_get_schedule')
      .then(response => response.json())
      .then(json => {
        this.setState({
          schedule: json
        });
      });
  }

  getCourses(){
    fetch('/_get_courses?program=Datateknik')
      .then(response => response.json())
      .then(json => {
        this.setState({
          courses: json
        });
      });
  }

  getProfileCourses(){
    fetch('/_get_profile_courses?program=Datateknik')
      .then(response => response.json())
      .then(json => {
        this.setState({
          profileCourses: json
        });
      });
  }

  render() {
    // if(Boolean(this.state.fields) &&
    //    Boolean(this.state.profiles) &&
    //    Boolean(this.state.schedule) &&
    //    Boolean(this.state.courses) &&
    //    Boolean(this.state.profileCourses)) {
      return <CourseViewer
               program={ program }
               fields={ this.state.fields }
               courses={ this.state.courses }
               profiles={ this.state.profiles }
               schedule={ this.state.schedule }
               profileCourses= { this.state.profileCourses}
             />;
    // } else {
    //   return <div className={"loader"}>Potatis</div>
    // }
  }

}
