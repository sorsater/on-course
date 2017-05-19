// The Selected semester
class Semester extends React.Component {
  onChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    return (
      <select onChange={ this.onChange.bind(this) }>
        <option name="Alla">Alla</option>
        <option name="7">7</option>
        <option name="8">8</option>
        <option name="9">9</option>
      </select>
    )
  }
}

// For each course in the schedule that is selected
class ScheduleItem extends React.Component {
  handleCourseDel(courseCode){
    this.props.handleCourseDel(courseCode);
  }
  render() {
    var color = this.props.course.color;
    console.log("SCHDUEL ITEM COLOR")
    console.log(color)
    var hej = {backgroundColor: color}
    console.log(hej)
    return (
      <div className={ 'course-selected' } style={ hej } onClick={(e) => {
        e.stopPropagation();
        this.handleCourseDel(this.props.course.code)
      }}>
        {this.props.course.code}
      </div>
    )
  }
}

// The schedule that is to the right of the screen
class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.handleCourseDel = this.handleCourseDel.bind(this);
    this.state = {
      'clickStatus': {
        'p1b1': {'selected': 'scheduleUnselected', 'checked': true},
        'p1b2': {'selected': 'scheduleUnselected', 'checked': true},
        'p1b3': {'selected': 'scheduleUnselected', 'checked': true},
        'p1b4': {'selected': 'scheduleUnselected', 'checked': true},
        'p1none': {'selected': 'scheduleUnselected', 'checked': true},
        'p2b1': {'selected': 'scheduleUnselected', 'checked': true},
        'p2b2': {'selected': 'scheduleUnselected', 'checked': true},
        'p2b3': {'selected': 'scheduleUnselected', 'checked': true},
        'p2b4': {'selected': 'scheduleUnselected', 'checked': true},
        'p2none': {'selected': 'scheduleUnselected', 'checked': true},
      }
    }
  }
  handleCourseDel(code) {
    this.props.handleCourseDel(code);
  }

  handleBlockClick(slot) {
    this.props.handleBlockClick({
      'period': slot['period'],
      'block': slot['block'],
      'checked': this.state.clickStatus[slot['id']].checked,
    });

    var css = (this.state.clickStatus[slot['id']].selected === 'scheduleUnselected') ? 'scheduleSelected' : 'scheduleUnselected';
    var new_clickStatus = this.state.clickStatus;
    new_clickStatus[slot['id']].selected = css;
    new_clickStatus[slot['id']].checked = ! this.state.clickStatus[slot['id']].checked;
    this.setState({
      'clickStatus': new_clickStatus
    })
  }

  render() {

    var p1b1 = [];
    var p1b2 = [];
    var p1b3 = [];
    var p1b4 = [];
    var p1none = [];

    var p2b1 = [];
    var p2b2 = [];
    var p2b3 = [];
    var p2b4 = [];
    var p2none = [];

    var codes = [];
    var courseItem;
    var c;
    for (var i = 0; i < this.props.courses.length; i++) {
      c = this.props.courses[i]
      courseItem = <ScheduleItem
        key={c.code}
        handleCourseDel={this.handleCourseDel}
        course={c}
      />
      codes.push(c.code);
      switch (c.block1) {
        case '1': p1b1.push(courseItem);    break;
        case '2': p1b2.push(courseItem);    break;
        case '3': p1b3.push(courseItem);    break;
        case '4': p1b4.push(courseItem);    break;
        case '-': p1none.push(courseItem);  break;
        default:
      }
      switch (c.block2) {
        case '1': p2b1.push(courseItem);    break;
        case '2': p2b2.push(courseItem);    break;
        case '3': p2b3.push(courseItem);    break;
        case '4': p2b4.push(courseItem);    break;
        case '-': p2none.push(courseItem);  break;
        default:
      }
    };

    var defaultClasses = "col-sm-3 light-grey noborder"
    var slotClasses = "col-sm-3 light-grey potatis"

    return (
      <div>
        <input type='button'
          value={'Ta bort alla'}
          onClick={() => {this.handleCourseDel('all')}}
        />
        <div className="row my-row">
          <div className={defaultClasses}>
            <h5>Block</h5>
          </div>
          <div className={defaultClasses}>
            <h5>Period 1</h5>
          </div>
          <div className={defaultClasses}>
            <h5>Period 2</h5>
          </div>
        </div>
        <div className="row my-row">
          <div className={defaultClasses}>
            1
          </div>
          <div className={slotClasses + ' ' + this.state.clickStatus['p1b1'].selected } onClick={() => {this.handleBlockClick({ 'period': '1', 'block': '1', 'id': 'p1b1'})}}>
            {p1b1}
          </div>
          <div className={slotClasses + ' ' + this.state.clickStatus['p2b1'].selected} onClick={() => {this.handleBlockClick({ 'period': '2', 'block': '1', 'id': 'p2b1'})}}>
            {p2b1}
          </div>
        </div>
        <div className="row my-row">
          <div className={defaultClasses}>
            2
          </div>
          <div className={slotClasses + ' ' + this.state.clickStatus['p1b2'].selected } onClick={() => {this.handleBlockClick({ 'period': '1', 'block': '2', 'id': 'p1b2'})}}>
            {p1b2}
          </div>
          <div className={slotClasses + ' ' + this.state.clickStatus['p2b2'].selected } onClick={() => {this.handleBlockClick({ 'period': '2', 'block': '2', 'id': 'p2b2'})}}>
            {p2b2}
          </div>
        </div>
        <div className="row my-row">
          <div className={defaultClasses}>
            3
          </div>
          <div className={slotClasses + ' ' + this.state.clickStatus['p1b3'].selected } onClick={() => {this.handleBlockClick({ 'period': '1', 'block': '3', 'id': 'p1b3'})}}>
            {p1b3}
          </div>
          <div className={slotClasses + ' ' + this.state.clickStatus['p2b3'].selected } onClick={() => {this.handleBlockClick({ 'period': '2', 'block': '3', 'id': 'p2b3'})}}>
            {p2b3}
          </div>
        </div>
        <div className="row my-row">
          <div className={defaultClasses}>
            4
          </div>
          <div className={slotClasses + ' ' + this.state.clickStatus['p1b4'].selected } onClick={() => {this.handleBlockClick({ 'period': '1', 'block': '4', 'id': 'p1b4'})}}>
            {p1b4}
          </div>
          <div className={slotClasses + ' ' + this.state.clickStatus['p2b4'].selected } onClick={() => {this.handleBlockClick({ 'period': '2', 'block': '4', 'id': 'p2b4'})}}>
            {p2b4}
          </div>
        </div>
        <div className="row my-row">
          <div className={defaultClasses}>
            Ospecifierat
          </div>
          <div className={slotClasses + ' ' + this.state.clickStatus['p1none'].selected } onClick={() => {this.handleBlockClick({ 'period': '1', 'block': '-', 'id': 'p1none'})}}>
            {p1none}
          </div>
          <div className={slotClasses + ' ' + this.state.clickStatus['p2none'].selected } onClick={() => {this.handleBlockClick({ 'period': '2', 'block': '-', 'id': 'p2none'})}}>
            {p2none}
          </div>
        </div>
      </div>
    )
  }
}
