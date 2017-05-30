function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}

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

   // Get name followed by anything except a semicolon
   var cookiestring = RegExp("cart[^;]+").exec(document.cookie);
   // Return everything after the equal sign, or an empty string if the cookie name not found
   var cart =  unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "").split(',');


   cart.indexOf(c.code) === - 1 ? cart.push(c.code) : console.log('already in cart')
   //console.log(cart);
   document.cookie = 'cart=' + cart;
  }

  render() {
    if (this.props.header === false) {
      var activeStyle = this.props.active ? 'not-active' : '';

      var url = 'http://kdb-5.liu.se/liu/lith/studiehandboken/' + this.props.course.link;

      return (
        <div className={`row row-eq-height course-row ${activeStyle}`} onClick={ this.addCourse.bind(this) }>
          <div className="col-sm-2 course-row" onClick={ (e) => { e.stopPropagation(); }}>
            <a href={ url }>{ this.props.course.code }</a>
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
      } else {
        return (
          <div className="row row-eq-height course-row course-row-header">
            <div className="col-sm-2 course-row course-row-header">
              <a href="#">Kurskod</a>
            </div>
            <div className="col-sm-1 course-row course-row-header">   HP      </div>
            <div className="col-sm-1 course-row course-row-header">   Nivå    </div>
            <div className="col-sm-1 course-row course-row-header">   Termin  </div>
            <div className="col-sm-1 course-row course-row-header">   Block1  </div>
            <div className="col-sm-1 course-row course-row-header">   Block2  </div>
            <div className="col-sm-5 course-row course-row-header">   Namn    </div>
          </div>
        )
      }
  }
}

// The main component
class CourseViewer extends React.Component {
  constructor(props){
    super(props);
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeSemester = this.handleChangeSemester.bind(this);
    this.handleChangeLevel = this.handleChangeLevel.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleCourseAdd = this.handleCourseAdd.bind(this);
    this.handleCourseDel = this.handleCourseDel.bind(this);
    this.handleBlockClick = this.handleBlockClick.bind(this);

    var cookiestring = RegExp("cart[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    var cart =  unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "").split(',');
    var colors = ['blueviolet','brown','burlywood','yellowgreen','coral','dodgerblue','crimson','teal','seagreen','sandybrown','plum','peru'];
    var courseCount = 0;

    this.state = {
      selectedField: -1,
      searchString: '',
      courseList: [],
      profileList: [-1],
      period1List: [],
      period2List: [],
      currentField: 'none',
      currentSemester: 'Alla',
      currentLevel: 'Alla',
      courseCount: courseCount,
      colors: colors,
      cart: cart,
    };
  }

  handleChangeField(fieldID) {
    this.setState({
      currentField: fieldID,
      profileList: [-1],
    });
  }

  handleChangeSemester(semester) {
    this.setState({ currentSemester: semester });
  }

  handleChangeLevel(level) {
    this.setState({ currentLevel: level });
  }

  handleProfileClick(profileObj) {
  //  this.setState({ profileList: [] });
    var id = profileObj.id;
    var checked = profileObj.checked;
    if (checked === true) {
      if (this.state.profileList.indexOf(id) === -1){
        this.setState({ profileList: this.state.profileList.concat([id]) });
      }
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
      //course['color'] = rainbow(this.state.colors.length, this.state.colors[this.state.courseCount]);
      course['color'] = this.state.colors[this.state.courseCount];
      this.setState({
        courseList: this.state.courseList.concat([course]),
        courseCount: (this.state.courseCount + 1)%this.state.colors.length
      });
    } else {
      this.handleCourseDel(course.code);
    }
  }

  handleCourseDel(courseCode){
    var newCourseList;
    if (courseCode === 'all'){
      newCourseList = [];
      document.cookie = 'cart=';
    }
    else{
      newCourseList = this.state.courseList.filter(function(course) {
        if (!course.code.match(courseCode)) {
          return true;
        }
      });

      // Get name followed by anything except a semicolon
      var cookiestring = RegExp("cart[^;]+").exec(document.cookie);
      // Return everything after the equal sign, or an empty string if the cookie name not found
      var cart =  unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "").split(',');

      var i = cart.indexOf(courseCode);
      i !== -1 ? cart.splice(i, 1) : console.log('not in cart');
      console.log(cart);
      document.cookie = 'cart=' + cart;
    }
    this.setState({
      courseList: newCourseList,
      courseCount: 0,
    })
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

  componentWillReceiveProps() {

    var _this = this;
    if(_this.props.schedule.length && _this.state.courseList && _this.state.courseList.length == 0){
    _this.state.cart.forEach(function(c_cookie) {
      if (c_cookie) {
        var i = _this.props.schedule.map(function(e) { return e.code; }).indexOf(c_cookie);
        _this.props.schedule[i].color = _this.state.colors[_this.state.courseCount];
        _this.state.courseCount++;
        _this.state.courseList.push(_this.props.schedule[i]);
      }
    });
    }
  }
  render() {

    // Number of courses that match criteria
    var courseCount;

    // Filter profiles from field
    var profiles = this.props.profiles;
    var curField = this.state.currentField;

    profiles = profiles.filter(function(profile) {
      if (profile.fieldID == curField){
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
    if (curSem !== 'Alla'){
      schedule = schedule.filter(function(row) {
        if (row.semester == curSem) {
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
            'link': cour.link,
            'semester': sche.semester,
            'period': sche.period,
            'block1': sche.block1,
            'block2': sche.block2,
          });
          break;
        }
      }
    }

    // Filter on level
    var curLevel = this.state.currentLevel;
    if (curLevel !== 'Alla'){
      courses = courses.filter(function(row) {
        if (row.level == curLevel) {
          return true;
        }
      });
    }
    // Filter courses that match schedule (period and block)
    var period1 = this.state.period1List;
    var period2 = this.state.period2List;
    var _this = this;
    if (period1.length > 0 || period2.length > 0){
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
    var courseRows = [];
    // The header for the courses
    courseRows.push(
      <CourseRow
        key={ 'header' }
        header={ true } />
    );

    courses.forEach((course) => {
      var active = _this.state.courseList.map(function(e) { return e.code; }).indexOf(course.code) !== -1;
      courseRows.push(
        <CourseRow
          key={ course.code }
          course={ course }
          onClick={ this.handleCourseAdd.bind(this) }
          active={ active }
          header={ false}
        />
      );
    })

    return (
      <div className="row row-eq-height container-fluid">
        <div className="col-sm-8 grey">
          <div id="select-field-program">
            Valt huvudområde:
            <Fields
              fields={this.props.fields}
              onChange={ this.handleChangeField.bind(this) }
            />
            <br />
            Vald termin:
            <Semester
              onChange={ this.handleChangeSemester.bind(this) }
            />
            <br />
            Vald nivå:
            <Level
              onChange={ this.handleChangeLevel.bind(this) }
            />
          </div>
          <Profiles
            field={ this.state.currentField }
            profileCheckbox={ this.handleProfileClick.bind(this) }
            profiles={ profiles }
          />
          <div className="course-count">
            Antal kurser: { courses.length }
          </div>
          <div className="course-list">
            <input id="search" type="text"
              value={ this.state.searchString }
              onChange={ this.handleChangeSearch }
              placeholder="Vad får det lov att vara? 😋"
            />
            { courseRows }
          </div>
        </div>
        <div className="col-sm-4 light-grey schedule">
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
