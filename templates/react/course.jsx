// One row for each course
class CourseRow extends React.Component {
  addCourse() {
    var c = this.props.course;

    this.props.onClick({
      'code': c.code,
      'semester': c.semester,
      'block1': c.block1,
      'block2': c.block2,
   });
  }
  render() {
    var nameTdStyle = { width: '70%', color: 'white' };
    var normalTdStyle = { width: '8%', color: 'white' };

    return (
      <div className="row row-eq-height course-row" onClick={ this.addCourse.bind(this) }>
        <div className="col-sm-2 course-row">
          <a href="#">{ this.props.course.code }</a>
        </div>
        <div className="col-sm-1 course-row">
          { this.props.course.hp }
        </div>
        <div className="col-sm-1 course-row">
          { this.props.course.level }
        </div>
        <div className="col-sm-1 course-row">
          { this.props.course.semester }
        </div>
        <div className="col-sm-1 course-row">
          { this.props.course.block1 }
        </div>
        <div className="col-sm-1 course-row">
          { this.props.course.block2 }
        </div>
        <div className="col-sm-5 course-row">
          { this.props.course.name }
        </div>
      </div>
    )
  }
}

// The main component
class CourseViewer extends React.Component {
  constructor(props){
    super(props);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeSemester = this.handleChangeSemester.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleCourseAdd = this.handleCourseAdd.bind(this);
    this.handleCourseDel = this.handleCourseDel.bind(this);
    this.handleBlockClick = this.handleBlockClick.bind(this);

    this.state = {
      selectedField: -1,
      searchString: '',
      courseList: [],
      profileList: [-1],
      period1List: [],
      period2List: [],
      currentField: 'none',
      currentSemester: 'All',
      colors: ["#FF0000", "#FF9900", "#CCFF00", "#33FF00", "#00FF66", "#00FFFF", "#0066FF", "#3300FF", "#CC00FF", "#FF0099"],
      busyColors: [],
    };
  }

  handleChangeField(fieldID) {
    this.setState({
      currentField: fieldID,
      profileList: [-1],
     })
  }

  handleChangeSemester(semester) {
    this.setState({ currentSemester: semester });
  }

  handleProfileClick(profileObj) {
  //  this.setState({ profileList: [] });
    var id = profileObj.id;
    var checked = profileObj.checked;
    if (checked === true) {
      this.setState({ profileList: this.state.profileList.concat([id]) });
    }
    else{
      var array = this.state.profileList;
      var idx = array.indexOf(id);
      array.splice(idx, 1);
      this.setState({ profileList: array });
    }
  }

  handleChangeSearch(event){
    this.setState({ searchString: event.target.value });
  }

  // Adding course to the list
  handleCourseAdd(course) {
    // Makes sure no duplicates are added
    var found = false;
    this.state.courseList.forEach(function(c) {
      if (course.code === c.code){
        found = true;
      }
    });
    if (found === false) {
      console.log('COLORS')
      console.log(this.state.colors);
      course['color'] = this.state.colors[this.state.courseList.length];
      this.setState({ courseList: this.state.courseList.concat([course]) })
    }
  }

  handleCourseDel(courseCode){
    var newCourseList;
    if (courseCode === 'all'){
      newCourseList = [];
    }
    else{
      newCourseList = this.state.courseList.filter(function(course) {
        if (!course.code.match(courseCode)) {
          return true;
        }
      });
    }
    this.setState({ courseList: newCourseList})
  }

  handleBlockClick(blockObj) {
    var period = blockObj.period;
    var block = blockObj.block;
    var checked = blockObj.checked;

    if (checked === true) {
      if (period === '1') {
        this.setState({ period1List: this.state.period1List.concat( [block] ) });
      }
      else if (period === '2') {
        this.setState({ period2List: this.state.period2List.concat( [block] ) });
      }
    }
    else {
      if (period === '1') {
        var array = this.state.period1List;
        var idx = array.indexOf(block);
        array.splice(idx, 1);
        this.setState({ period1List: array});
      }
      else if (period === '2') {
        var array = this.state.period2List;
        var idx = array.indexOf(block);
        array.splice(idx, 1);
        this.setState({ period2List: array});
      }
    }
  }

  render() {
    // Number of courses that match criteria
    var courseCount;

    // Filter profiles from field
    var profiles = this.props.profiles;
    var curField = this.state.currentField;

    profiles = profiles.filter(function(profile) {
      if (profile.fieldID.match(curField)){
        return true;
      }
    });

    // Filter courses that match profil
    var profileList = this.state.profileList;
    var validProfilesCourses = [];
    // Filter out valid courses in profileCourses
    if (profileList.indexOf(-1) === -1){
      this.props.profileCourses.forEach(function(prof) {
        if (profileList.some(pl => pl == prof.profileID)) {
          validProfilesCourses.push(prof.code);
        }
      })
    } else {
      this.props.courses.forEach(function(prof) {
        validProfilesCourses.push(prof.code);
      });
    }
    var profile_courses = [];
    this.props.courses.forEach(function(course) {
      if (validProfilesCourses.some(pl => pl === course.code)){
        profile_courses.push(course);
      }
    });

    // Filter courses that match semester
    var schedule = this.props.schedule;
    var curSem = this.state.currentSemester;
    if (curSem !== 'All'){
      schedule = schedule.filter(function(row) {
        if (row.semester.match(curSem)) {
            return true;
        }
      });
    }

    // Join the courses with schedule and merge properties
    var courses = [];
    for (var c = 0; c < profile_courses.length; c++) {
      for (var s = 0; s < schedule.length; s++) {
        var cour = profile_courses[c];
        var sche = schedule[s];
        if (cour.code == sche.code) {
          courses.push({
            'code': cour.code,
            'name': cour.name,
            'level': cour.level,
            'hp': cour.hp,
            'semester': sche.semester,
            'period': sche.period,
            'block1': sche.block1,
            'block2': sche.block2,
          });
          break;
        }
      }
    }

    // Filter courses that match schedule (period and block)
    var period1 = this.state.period1List;
    var period2 = this.state.period2List;
    if (period1.length > 0 || period2.length > 0){
      var _this = this;
      courses = courses.filter(function(course) {
        if (period1.indexOf(course.block1) > -1 || period2.indexOf(course.block2) > -1){
          return true;
        }
      });
    }

    // Filter the result with the search field
    var searchString = this.state.searchString.trim().toLowerCase();
    if(searchString.length > 0){
      courses = courses.filter(function(course){
        return (course.code + course.name).toLowerCase().match( searchString );
      });
    }

    // Create the actual course row objects
    var courseRows = []
    courses.forEach((course) => {
      courseRows.push(
        <CourseRow
          key={ course.code }
          course={ course }
          onClick={ this.handleCourseAdd.bind(this) }
        />
      );
    })

    courseCount = courses.length;

    var divStyle = {padding: '20px'};
    return (
      <div className="row row-eq-height container-fluid potatis">
        <div className="col-sm-8 grey">
          <div id="select-program">
            Valt program: { this.props.program.name }
          </div>
          <div id="select-field-program">
            Valt huvudområde:
            <Fields
              fields={fields}
              onChange={ this.handleChangeField.bind(this) }
            />
            <br />
            Vald termin:
            <Semester
              onChange={ this.handleChangeSemester.bind(this) }
            />
          </div>
          <Profiles
            field={ this.state.currentField }
            profileCheckbox={ this.handleProfileClick.bind(this) }
            profiles={ profiles }
          />
          <div className={'course-count'}>
            Antal kurser: {courseCount}
          </div>
          <div style={ divStyle }>
            <input id="search" type="text"
              value={ this.state.searchString }
              onChange={ this.handleChangeSearch }
              placeholder="Vad får det lov att vara? 😋"
            />
            { courseRows }
          </div>
        </div>
        <div className="col-sm-4 light-grey">
          <Schedule
            courses={ this.state.courseList }
            handleCourseDel={ this.handleCourseDel }
            handleBlockClick={ this.handleBlockClick }
          />
        </div>
      </div>
    )
  }
}
